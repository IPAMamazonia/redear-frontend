import { useCallback, useEffect, useRef } from 'react';
import ChartZoom from 'chartjs-plugin-zoom';
import { Decimation } from 'chart.js';
import Chart from 'chart.js/auto';

import { getLocale } from '@/i18n';
import { criarConfigChart } from '../utils';

Chart.register(ChartZoom, Decimation);

/**
 * Cria e destrói a instância do Chart.js ligada ao canvas do gráfico.
 *
 * @param {object} params
 * @param {boolean} params.visible - Indica se o canvas está montado e deve receber um gráfico.
 * @param {Array<object>} params.series - Séries e yMax calculados por `useChartData`.
 * @param {object} params.variable - Variável selecionada.
 * @param {number} params.spanMs - Duração do intervalo em ms.
 * @param {number} params.totalPontos - Total de pontos das séries.
 * @param {boolean} params.dadosContinuos - True quando nenhuma série tem lacunas.
 * @param {Array<object>|null} params.faixasVisiveis - Faixas visíveis no eixo Y.
 * @param {string} params.language - Idioma ativo.
 * @returns {{ canvasRef: import('react').RefObject<HTMLCanvasElement>, resetZoom: () => void }}
 */
export function useChartInstance({
  visible,
  series,
  variable,
  spanMs,
  totalPontos,
  dadosContinuos,
  faixasVisiveis,
  language,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const destroyChart = useCallback(() => {
    if (!chartRef.current) return;
    chartRef.current.destroy();
    chartRef.current = null;
  }, []);

  const criarChart = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    destroyChart();

    chartRef.current = new Chart(
      ctx,
      criarConfigChart({
        datasets: series.datasets,
        yMax: series.yMax,
        unit: variable.unit,
        faixas: faixasVisiveis,
        spanMs,
        totalPontos,
        dadosContinuos,
        locale: getLocale(language),
      }),
    );
  }, [series, variable, spanMs, totalPontos, dadosContinuos, faixasVisiveis, language, destroyChart]);

  useEffect(() => {
    if (!visible) {
      destroyChart();
      return undefined;
    }

    criarChart();
    return destroyChart;
  }, [criarChart, visible, destroyChart]);

  const resetZoom = useCallback(() => {
    chartRef.current?.resetZoom();
  }, []);

  return { canvasRef, resetZoom };
}
