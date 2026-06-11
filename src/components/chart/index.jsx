import { Section, SectionHeading, GlassCard, GradientText, SegmentedControl } from '@/components';
import { gerarDadosHistorico, getCorAQI, getLabelAQI } from '@/helpers/format';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ESTADOS, TIPOS_TERRITORIO } from '@/mocks/sensors';
import ChartZoom from 'chartjs-plugin-zoom';
import Chart from 'chart.js/auto';

Chart.register(ChartZoom);

/**
 * Gráfico AQI com seleção de período, filtro por estado/território e zoom interativo.
 */
export function AQIChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [periodo, setPeriodo] = useState('1A');
  const [modo, setModo] = useState('estado');
  const [nivel1, setNivel1] = useState('');
  const [nivel2, setNivel2] = useState('');

  const getLocal = useCallback(() => nivel2 || nivel1 || null, [nivel1, nivel2]);

  const PERIODOS = [
    { value: '1D', label: '1 D' },
    { value: '5D', label: '5 D' },
    { value: '1M', label: '1 M' },
    { value: '6M', label: '6 M' },
    { value: 'YTD', label: 'YTD' },
    { value: '1A', label: '1 A' },
    { value: '5A', label: '5 A' },
    { value: 'Max', label: 'Máx' },
  ];

  const nivel1Options = modo === 'estado' ? ESTADOS : TIPOS_TERRITORIO;
  const selectedParent =
    modo === 'estado' ? ESTADOS.find((e) => e.id === nivel1) : TIPOS_TERRITORIO.find((t) => t.id === nivel1);
  const children = modo === 'estado' ? selectedParent?.municipios : selectedParent?.territorios;
  const hasChildren = children && children.length > 0;

  const createChart = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) chartRef.current.destroy();

    const dados = gerarDadosHistorico(getLocal(), periodo);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dados.labels,
        datasets: [
          {
            label: 'AQI',
            data: dados.valores,
            borderColor: '#2c3e50',
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#2c3e50',
            fill: true,
            tension: 0.3,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(44,62,80,0.95)',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function (ctx) {
                const d = gerarDadosHistorico(getLocal(), periodo);
                const idx = ctx.dataIndex;
                return [
                  ` AQI: ${d.valores[idx]}  (${getLabelAQI(d.valores[idx])})`,
                  ` PM2.5: ${d.pm25[idx]} µg/m³`,
                  ` PM10: ${d.pm10[idx]} µg/m³`,
                ];
              },
              labelColor: function (ctx) {
                const d = gerarDadosHistorico(getLocal(), periodo);
                const cor = getCorAQI(d.valores[ctx.dataIndex]);
                return { borderColor: cor.cor, backgroundColor: cor.cor };
              },
            },
          },
          zoom: {
            pan: { enabled: true, mode: 'x' },
            zoom: {
              wheel: { enabled: true, speed: 0.05 },
              drag: {
                enabled: true,
                mode: 'x',
                backgroundColor: 'rgba(255,126,0,0.1)',
                borderColor: '#FF7E00',
              },
              mode: 'x',
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 10, font: { size: 11 }, color: '#999' },
          },
          y: {
            beginAtZero: true,
            max: 250,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 }, color: '#999' },
          },
        },
      },
      plugins: [
        {
          id: 'gradientFill',
          beforeDraw: function (chart) {
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(139,0,0,0.25)');
            gradient.addColorStop(0.3, 'rgba(255,0,0,0.2)');
            gradient.addColorStop(0.5, 'rgba(255,126,0,0.15)');
            gradient.addColorStop(0.7, 'rgba(255,255,0,0.1)');
            gradient.addColorStop(1, 'rgba(0,228,0,0.08)');
            chart.data.datasets[0].backgroundColor = gradient;
          },
        },
        {
          id: 'aqiZones',
          beforeDraw: function (chart) {
            const { ctx, chartArea, scales } = chart;
            if (!chartArea || !scales.y) return;
            const zonas = [
              { max: 40, cor: 'rgba(0,228,0,0.05)' },
              { max: 80, cor: 'rgba(255,255,0,0.04)' },
              { max: 120, cor: 'rgba(255,126,0,0.04)' },
              { max: 200, cor: 'rgba(255,0,0,0.04)' },
              { max: 250, cor: 'rgba(139,0,0,0.05)' },
            ];
            let prevY = chartArea.bottom;
            zonas.forEach((z) => {
              const y = scales.y.getPixelForValue(z.max);
              ctx.fillStyle = z.cor;
              ctx.fillRect(chartArea.left, y, chartArea.right - chartArea.left, prevY - y);
              ctx.strokeStyle = z.cor.replace('0.0', '0.15');
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(chartArea.left, y);
              ctx.lineTo(chartArea.right, y);
              ctx.stroke();
              ctx.setLineDash([]);
              prevY = y;
            });
          },
        },
      ],
    });

    chartRef.current = chart;
  }, [getLocal, periodo]);

  useEffect(() => {
    createChart();
    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [createChart]);

  const handlePeriodo = (val) => setPeriodo(val);
  const handleModo = (m) => {
    setModo(m);
    setNivel1('');
    setNivel2('');
  };
  const handleNivel1 = (val) => {
    setNivel1(val);
    setNivel2('');
  };
  const handleNivel2 = (val) => setNivel2(val);

  return (
    <Section id="grafico" alt className="AQIChartComponent">
      <SectionHeading subtitle="Acompanhe a evolução dos índices com filtros de período e localização">
        <GradientText>Qualidade do Ar</GradientText> ao Longo do Tempo
      </SectionHeading>

      <div className="flex flex-wrap gap-4 max-w-[1280px] mx-auto mb-8 justify-between items-center max-md:flex-col max-md:items-stretch">
        <div className="flex gap-0 flex-wrap bg-white/60 backdrop-blur rounded-[10px] p-[0.35rem] border border-white/50">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => handlePeriodo(p.value)}
              className={`px-[1.1rem] py-2 border-none bg-transparent cursor-pointer text-sm font-semibold transition-all duration-[0.35s] ease-out relative rounded-lg
                ${
                  periodo === p.value
                    ? 'text-[#FF6D00] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:rounded after:bg-[#FF6D00]'
                    : 'text-text-light hover:text-[#FF6D00]'
                }`}
              title={p.label.replace(' ', '')}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <SegmentedControl
            options={[
              { value: 'estado', label: 'Estado' },
              { value: 'territorio', label: 'Território' },
            ]}
            value={modo}
            onChange={handleModo}
          />

          <div className="flex gap-2 items-center max-md:flex-col">
            <select
              value={nivel1}
              onChange={(e) => handleNivel1(e.target.value)}
              className="px-3 py-2 border border-black/10 rounded-[10px] text-sm text-text-dark bg-card backdrop-blur cursor-pointer min-w-[160px] max-md:w-full focus:outline-none focus:border-[#FF6D00] transition-colors duration-[0.35s]"
              style={{ width: '220px' }}
              aria-label="Selecionar"
            >
              <option value="">{modo === 'estado' ? 'Selecione um estado' : 'Selecione um tipo'}</option>
              {nivel1Options.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>

            <select
              value={nivel2}
              onChange={(e) => handleNivel2(e.target.value)}
              disabled={!hasChildren}
              className="px-3 py-2 border border-black/10 rounded-[10px] text-sm text-text-dark bg-card backdrop-blur cursor-pointer min-w-[160px] max-md:w-full focus:outline-none focus:border-[#FF6D00] transition-colors duration-[0.35s] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ width: '240px' }}
              aria-label="Detalhe"
            >
              <option value="">{nivel1 ? 'Todos' : 'Selecione primeiro'}</option>
              {hasChildren &&
                children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.nome}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto">
        <GlassCard className="p-6">
          <div className="h-[420px]">
            <canvas ref={canvasRef} id="aqiChart"></canvas>
          </div>
          <p className="text-center mt-3 text-sm text-text-light">
            <i className="fas fa-info-circle"></i> Arraste para zoom, role para ampliar. Passe o mouse sobre os pontos
            para detalhes.
          </p>
        </GlassCard>
      </div>
    </Section>
  );
}
