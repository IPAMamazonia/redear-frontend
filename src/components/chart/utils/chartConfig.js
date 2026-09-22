const CORES_PALETA = [
  '#2C3E50',
  '#FF7E00',
  '#00A85A',
  '#7B1FA2',
  '#1976D2',
  '#C62828',
  '#F9A825',
  '#00695C',
  '#4E342E',
  '#5D4037',
];

const ZONAS = [
  { max: 40, cor: 'rgba(0,228,0,0.05)' },
  { max: 80, cor: 'rgba(255,255,0,0.04)' },
  { max: 120, cor: 'rgba(255,126,0,0.04)' },
  { max: 200, cor: 'rgba(255,0,0,0.04)' },
  { max: 250, cor: 'rgba(139,0,0,0.05)' },
];

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

function criarDataset(serie, cor) {
  return {
    label: serie.name,
    data: serie.data,
    borderColor: cor,
    borderWidth: 1.8,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: cor,
    tension: 0.3,
    spanGaps: true,
    fill: false,
  };
}

function formataValor(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return v.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function criarTooltip(unit) {
  return {
    backgroundColor: 'rgba(44,62,80,0.95)',
    titleFont: { size: 13 },
    bodyFont: { size: 12 },
    padding: 12,
    cornerRadius: 8,
    callbacks: {
      title(items) {
        const x = items[0]?.parsed?.x;
        if (x == null) return '';
        return new Date(x).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      label(ctx) {
        return `${ctx.dataset.label}: ${formataValor(ctx.parsed?.y)} ${unit}`.trim();
      },
    },
  };
}

function criarEscalas(spanMs, yMax) {
  return {
    x: {
      type: 'linear',
      grid: { display: false },
      ticks: {
        maxTicksLimit: 10,
        font: { size: 11 },
        color: '#999',
        callback(value) {
          const d = new Date(value);
          if (spanMs <= 3 * 86400000) {
            return d.toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
          return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        },
      },
    },
    y: {
      beginAtZero: true,
      max: yMax,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { font: { size: 11 }, color: '#999' },
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
 * Monta a configuração do Chart.js para as séries de sensores.
 *
 * @param {object} params
 * @param {Array<{ name: string, data: Array<{ x: number, y: number }> }>} params.datasets - Séries prontas (montarSeries).
 * @param {number} params.yMax - Limite superior dinâmico do eixo Y.
 * @param {string} params.unit - Unidade da variável (para o tooltip).
 * @param {boolean} params.mostrarZonas - Desenha as zonas do AQI (apenas para a variável 'aqi').
 * @param {number} params.spanMs - Tamanho do intervalo em ms (formato dos ticks do eixo X).
 * @param {number} params.totalPontos - Total de pontos do gráfico (decimation quando alto).
 * @param {boolean} params.dadosContinuos - True se nenhuma série tem lacunas (null) — requisito do LTTB.
 */
export function criarConfigChart({
  datasets = [],
  yMax = 50,
  unit = '',
  mostrarZonas = false,
  spanMs = 0,
  totalPontos = 0,
  dadosContinuos = false,
}) {
  const usarDecimation = totalPontos > 1500 && dadosContinuos;
  const amostrasAlvo = Math.min(Math.max(Math.round(totalPontos / 10), 300), 1500);

  return {
    type: 'line',
    data: {
      datasets: datasets.map((serie, i) => criarDataset(serie, CORES_PALETA[i % CORES_PALETA.length])),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false, // dados já vêm como {x, y} (necessário p/ decimation LTTB)
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
          labels: { font: { size: 11 }, boxWidth: 14, padding: 12, color: '#5a6d7a' },
        },
        tooltip: criarTooltip(unit),
        zoom,
        decimation: usarDecimation
          ? {
              enabled: true,
              algorithm: 'lttb',
              samples: amostrasAlvo,
              threshold: 500,
            }
          : undefined,
      },
      scales: criarEscalas(spanMs, yMax),
      elements: { line: { tension: 0.15 }, point: { radius: 0 } },
    },
    plugins: mostrarZonas ? [criarPluginZonas()] : [],
  };
}