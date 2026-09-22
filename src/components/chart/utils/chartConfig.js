import { gerarDadosHistorico, getCorAQI, getLabelAQI } from '@/helpers/format';

const COR_LINHA = '#2c3e50';

const ZONAS = [
  { max: 40, cor: 'rgba(0,228,0,0.05)' },
  { max: 80, cor: 'rgba(255,255,0,0.04)' },
  { max: 120, cor: 'rgba(255,126,0,0.04)' },
  { max: 200, cor: 'rgba(255,0,0,0.04)' },
  { max: 250, cor: 'rgba(139,0,0,0.05)' },
];

function criarDataset(dados) {
  return {
    label: 'AQI',
    data: dados.valores,
    borderColor: COR_LINHA,
    borderWidth: 2.5,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBackgroundColor: COR_LINHA,
    fill: true,
    tension: 0.3,
    spanGaps: true,
  };
}

function criarTooltip(dados) {
  return {
    backgroundColor: 'rgba(44,62,80,0.95)',
    titleFont: { size: 13 },
    bodyFont: { size: 12 },
    padding: 12,
    cornerRadius: 8,
    callbacks: {
      label(ctx) {
        const valor = dados.valores[ctx.dataIndex];
        return [
          ` AQI: ${valor}  (${getLabelAQI(valor)})`,
          ` PM2.5: ${dados.pm25[ctx.dataIndex]} µg/m³`,
          ` PM10: ${dados.pm10[ctx.dataIndex]} µg/m³`,
        ];
      },
      labelColor(ctx) {
        const cor = getCorAQI(dados.valores[ctx.dataIndex]);
        return { borderColor: cor.cor, backgroundColor: cor.cor };
      },
    },
  };
}

const zoom = {
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
};

const scales = {
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
};

function criarPluginGradiente() {
  return {
    id: 'gradientFill',
    beforeDraw(chart) {
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
  };
}

function criarPluginZonas() {
  return {
    id: 'aqiZones',
    beforeDraw(chart) {
      const { ctx, chartArea, scales: eixos } = chart;
      if (!chartArea || !eixos.y) return;

      let prevY = chartArea.bottom;
      ZONAS.forEach((z) => {
        const y = eixos.y.getPixelForValue(z.max);

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
  };
}

/**
 * Monta a configuração do Chart.js para a série AQI.
 * Os dados mockados são gerados uma única vez (e reutilizados pelos tooltips),
 * evitando regenerar passeios aleatórios a cada interação.
 *
 * @param {string|null} localId - Identificador da localidade selecionada.
 * @param {string} periodo - Período selecionado ('1D', '1M', ...).
 */
export function criarConfigChart(localId, periodo) {
  const dados = gerarDadosHistorico(localId, periodo);

  return {
    type: 'line',
    data: {
      labels: dados.labels,
      datasets: [criarDataset(dados)],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: criarTooltip(dados),
        zoom,
      },
      scales,
    },
    plugins: [criarPluginGradiente(), criarPluginZonas()],
  };
}