import { lerpColor } from './lerp-color.js';

/**
 * Gera um estilo de cor a partir de um valor e de uma lista de faixas.
 *
 * Percorre as faixas ordenadas e devolve um gradiente interpolado entre as
 * duas faixas vizinhas que contêm o valor. Quando o valor é nulo ou ultrapassa
 * a última faixa, retorna um valor neutro ou a cor da última faixa.
 *
 * @param {number|null|undefined} value - Valor a ser avaliado.
 * @param {Array<{min: number, rgb: number[], textColor?: string, label: string}>} stops -
 *   Faixas ordenadas por `min` com pelo menos 2 elementos.
 * @returns {{color: string, textColor: string, label: string}} Estilo de cor
 * (cor de fundo, cor do texto e rótulo da faixa).
 */
export function gradientColor(value, stops) {
  if (value == null) return { color: '#9e9e9e', textColor: '#ffffff', label: 'Sem dados' };
  for (let i = 0; i < stops.length - 1; i++) {
    if (value <= stops[i + 1].min) {
      const t = (value - stops[i].min) / (stops[i + 1].min - stops[i].min);
      return {
        color: lerpColor(stops[i].rgb, stops[i + 1].rgb, t),
        textColor: stops[i].textColor ?? '#000000',
        label: stops[i].label,
      };
    }
  }
  const last = stops[stops.length - 1];
  return { color: lerpColor(last.rgb, last.rgb, 1), textColor: last.textColor ?? '#000000', label: last.label };
}
