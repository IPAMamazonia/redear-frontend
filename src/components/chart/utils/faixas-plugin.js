import { rgba } from '@/helpers/faixas';

const ALFA_FUNDO = 0.12;
const ALFA_LIMITE = 0.45;

/**
 * Plugin Chart.js que pinta as faixas de qualidade atrás das séries.
 *
 * As faixas vêm de `variable.faixas` — a mesma estrutura que define a cor do
 * marcador no mapa, o chip do popup e a legenda —, então o gráfico e o mapa não
 * têm como divergir: o mesmo corte que separa "Bom" de "Moderado" no mapa é o
 * corte desenhado aqui.
 *
 * Cada faixa é recortada na área do gráfico: uma faixa que termina acima da
 * área visível é preenchida só até o topo, e uma faixa inteira fora da escala
 * simplesmente não é desenhada.
 *
 * @param {Array<{min: number, max: number, rgb: number[], label: string}>} faixas - Faixas normalizadas, em ordem crescente.
 * @returns {object} Plugin Chart.js registrado no `beforeDraw`.
 */
export function criarPluginFaixas(faixas) {
  return {
    id: 'qualityBands',
    beforeDraw(chart) {
      if (!Array.isArray(faixas) || faixas.length === 0) return;

      const { ctx, chartArea, scales } = chart;
      if (!chartArea || !scales?.y) return;

      const largura = chartArea.right - chartArea.left;
      let baseAnterior = chartArea.bottom;

      for (let i = 0; i < faixas.length; i++) {
        const faixa = faixas[i];
        const ehUltima = i === faixas.length - 1;
        const limite = ehUltima || !Number.isFinite(faixa.max) ? chartArea.top : scales.y.getPixelForValue(faixa.max);
        const topo = Math.max(Math.min(limite, chartArea.bottom), chartArea.top);

        if (topo < baseAnterior) {
          ctx.fillStyle = rgba(faixa.rgb, ALFA_FUNDO);
          ctx.fillRect(chartArea.left, topo, largura, baseAnterior - topo);

          if (limite > chartArea.top && limite < chartArea.bottom) {
            ctx.save();
            ctx.strokeStyle = rgba(faixa.rgb, ALFA_LIMITE);
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(chartArea.left, limite);
            ctx.lineTo(chartArea.right, limite);
            ctx.stroke();
            ctx.restore();
          }

          baseAnterior = topo;
        }
      }
    },
  };
}

/**
 * Calcula o limite superior do eixo Y.
 *
 * Parte do maior valor observado, com folga, arredondado para um passo legível.
 * Quando a variável reserva um topo de escala para as faixas (`faixasYMax`), o
 * eixo sobe até lá — é o que permite ler "estava ruim?" comparando a altura do
 * ponto com as faixas. O eixo nunca fica abaixo do que os dados exigem.
 *
 * @param {number} maiorValor - Maior valor da série (0 se não houver).
 * @param {number|null|undefined} faixasYMax - Topo reservado para as faixas.
 * @param {number} passo - Passo de arredondamento do eixo.
 * @returns {number} Limite superior do eixo Y.
 */
export function calcularYMax(maiorValor, faixasYMax, passo = 25) {
  const automatico = Math.ceil(Math.max((maiorValor || 0) * 1.15, 50) / passo) * passo;
  return Math.max(automatico, faixasYMax || 0);
}

/**
 * Seleciona as faixas que o gráfico realmente desenha.
 *
 * Devolve `null` para variáveis sem topo de escala reservado — em pressão e
 * contagem de partículas a escala completa achataria a série na borda do eixo.
 * Nas demais, descarta as faixas que ficaram sem altura dentro do `yMax`, para
 * que nem o desenho nem a legenda anunciem uma faixa invisível.
 *
 * @param {Array<object>} faixas - Faixas da variável.
 * @param {number} yMax - Limite superior do eixo Y.
 * @param {number|null|undefined} faixasYMax - Topo reservado para as faixas.
 * @returns {Array<object>|null} Faixas visíveis, ou `null` se a variável não usa faixas no gráfico.
 */
export function faixasVisiveis(faixas, yMax, faixasYMax) {
  if (!faixasYMax || !Array.isArray(faixas)) return null;
  return faixas.filter((f) => f.max > 0 && f.min < yMax);
}
