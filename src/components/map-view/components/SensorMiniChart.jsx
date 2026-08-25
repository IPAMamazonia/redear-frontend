import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PMS_COLORS = {
  pms1: { border: '#00E400', bg: 'rgba(0,228,0,0.08)' },
  pms2: { border: '#FF7E00', bg: 'rgba(255,126,0,0.08)' },
};

function extractPmsPair(readings, field) {
  const pms1 = readings.map((r) => r[`pms1_${field}`] ?? null);
  const pms2 = readings.map((r) => r[`pms2_${field}`] ?? null);
  return { pms1, pms2 };
}

function buildDatasets(variable, data) {
  const readings = data.map((r) => r);

  if (variable.key === 'pm25') {
    const { pms1, pms2 } = extractPmsPair(readings, 'pm2_5_env');
    return [
      { label: 'PMS1', data: pms1, borderColor: PMS_COLORS.pms1.border, backgroundColor: PMS_COLORS.pms1.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
      { label: 'PMS2', data: pms2, borderColor: PMS_COLORS.pms2.border, backgroundColor: PMS_COLORS.pms2.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
    ];
  }

  if (variable.key === 'pm10') {
    const { pms1, pms2 } = extractPmsPair(readings, 'pm10_env');
    return [
      { label: 'PMS1', data: pms1, borderColor: PMS_COLORS.pms1.border, backgroundColor: PMS_COLORS.pms1.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
      { label: 'PMS2', data: pms2, borderColor: PMS_COLORS.pms2.border, backgroundColor: PMS_COLORS.pms2.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
    ];
  }

  if (variable.key === 'pm1') {
    const { pms1, pms2 } = extractPmsPair(readings, 'pm1_0_env');
    return [
      { label: 'PMS1', data: pms1, borderColor: PMS_COLORS.pms1.border, backgroundColor: PMS_COLORS.pms1.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
      { label: 'PMS2', data: pms2, borderColor: PMS_COLORS.pms2.border, backgroundColor: PMS_COLORS.pms2.bg, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 5, tension: 0.3, spanGaps: true },
    ];
  }

  const values = readings.map((r) => variable.extract(r));
  return [
    {
      label: variable.label,
      data: values,
      borderColor: '#00E400',
      backgroundColor: 'rgba(0,228,0,0.08)',
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      tension: 0.3,
      spanGaps: true,
    },
  ];
}

export function SensorMiniChart({ readings, variable }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const data = (readings || [])
      .filter((r) => r.datetime)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    if (data.length < 2) return;

    const labels = data.map((r) => {
      const d = new Date(r.datetime);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    });

    const datasets = buildDatasets(variable, data);

    const allValues = datasets.flatMap((ds) => ds.data).filter((v) => v != null);
    const dataMax = allValues.length > 0 ? Math.max(...allValues) : 50;
    const yMax = Math.ceil(Math.max(dataMax * 1.15, 50) / 25) * 25;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'top',
            labels: { font: { size: 10 }, boxWidth: 12, padding: 8 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} ${variable.unit}`,
            },
          },
        },
        scales: {
          x: {
            display: true,
            ticks: { maxTicksLimit: 10, font: { size: 9 }, color: '#999' },
            grid: { display: false },
          },
          y: {
            display: true,
            beginAtZero: true,
            max: yMax,
            ticks: { font: { size: 10 }, color: '#999' },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [readings, variable]);

  if (!readings || readings.length < 2) {
    return (
      <div className="SensorMiniChartComponent h-[240px] flex items-center justify-center text-xs text-text-light">
        Dados insuficientes para o gráfico
      </div>
    );
  }

  return (
    <div className="SensorMiniChartComponent h-[240px]">
      <canvas ref={canvasRef} />
    </div>
  );
}
