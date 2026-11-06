import { calcularYMax, criarPluginFaixas, faixasVisiveis } from '@/components/chart/utils/faixas-plugin';
import { getLocale } from '@/i18n/translate';

const PMS_COLORS = {
  pms1: { border: '#00E400', bg: 'rgba(0,228,0,0.08)' },
  pms2: { border: '#FF7E00', bg: 'rgba(255,126,0,0.08)' },
};

const PMS_FIELDS = {
  pm25: 'pm2_5_env',
  pm10: 'pm10_env',
  pm1: 'pm1_0_env',
};

function criarDataset(label, data, { border, bg }) {
  return {
    label,
    data,
    borderColor: border,
    backgroundColor: bg,
    borderWidth: 1.5,
    pointRadius: 0,
    pointHoverRadius: 5,
    tension: 0.3,
    spanGaps: true,
  };
}

/**
 * Extrai as duas séries PMS (PMS1/PMS2) de um campo das leituras.
 *
 * @param {Array<Record<string, number|string|null|undefined>>} readings - Leituras do sensor.
 * @param {string} field - Sufixo do campo (ex.: `pm2_5_env`).
 * @returns {{ pms1: Array<number|null>, pms2: Array<number|null> }}
 */
export function extractPmsPair(readings, field) {
  return {
    pms1: readings.map((reading) => reading[`pms1_${field}`] ?? null),
    pms2: readings.map((reading) => reading[`pms2_${field}`] ?? null),
  };
}

/**
 * Monta os datasets do mini gráfico para a variável selecionada.
 *
 * Partículas finas usam as duas séries PMS; as demais variáveis usam o
 * extrator da própria variável.
 *
 * @param {object} variable - Variável selecionada.
 * @param {Array<object>} readings - Leituras já ordenadas.
 * @param {(key: string) => string} t - Função de tradução.
 * @returns {Array<object>} Datasets prontos para o Chart.js.
 */
export function buildDatasets(variable, readings, t) {
  const pmsField = PMS_FIELDS[variable.key];

  if (pmsField) {
    const { pms1, pms2 } = extractPmsPair(readings, pmsField);
    return [
      criarDataset('PMS1', pms1, PMS_COLORS.pms1),
      criarDataset('PMS2', pms2, PMS_COLORS.pms2),
    ];
  }

  return [
    criarDataset(
      t(variable.labelKey),
      readings.map((reading) => variable.extract(reading)),
      PMS_COLORS.pms1,
    ),
  ];
}

function prepararLeituras(readings) {
  return (readings || [])
    .filter((reading) => reading.datetime)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

function formatarLabels(readings, language) {
  const locale = getLocale(language);

  return readings.map((reading) =>
    new Date(reading.datetime).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
}

/**
 * Monta a configuração completa do mini gráfico.
 *
 * @param {Array<object>|undefined} readings - Leituras do sensor.
 * @param {object} variable - Variável selecionada.
 * @param {(key: string) => string} t - Função de tradução.
 * @param {string} language - Idioma ativo.
 * @returns {object|null} Configuração do Chart.js ou `null` quando não há pontos suficientes.
 */
export function buildMiniChartConfig(readings, variable, t, language) {
  const data = prepararLeituras(readings);
  if (data.length < 2) return null;

  const labels = formatarLabels(data, language);
  const datasets = buildDatasets(variable, data, t);

  const allValues = datasets.flatMap((dataset) => dataset.data).filter((value) => value != null);
  const dataMax = allValues.reduce((max, value) => {
    const numero = Number(value);
    return Number.isFinite(numero) && numero > max ? numero : max;
  }, 0);
  const yMax = calcularYMax(dataMax, variable.faixasYMax);
  const faixas = faixasVisiveis(variable.faixas, yMax, variable.faixasYMax);

  return {
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
    plugins: faixas ? [criarPluginFaixas(faixas)] : [],
  };
}
