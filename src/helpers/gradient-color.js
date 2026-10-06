import { SEM_DADOS } from '@/rules/faixas';
import { getBand } from './get-band.js';

/**
 * Gera um estilo de cor a partir de um valor e de uma lista de faixas.
 *
 * O fundo é interpolado entre a faixa que contém o valor e a seguinte, o que
 * preserva a leitura de gradiente do mapa. Já o rótulo e a cor do texto vêm da
 * faixa fechada que contém o valor, e não da faixa inferior: é o que garante
 * que o texto do popup, a cor do marcador e a legenda do mapa concordem entre
 * si, e que as faixas do gráfico usem exatamente os mesmos cortes.
 *
 * @param {number|null|undefined} value - Valor a ser avaliado.
 * @param {Array<{min: number, max: number, rgb: number[], color: string, textColor: string, label: string, labelKey: string}>} faixas -
 *   Faixas normalizadas e ordenadas.
 * @returns {{color: string, textColor: string, label: string, labelKey: string}} Estilo de cor
 * (cor de fundo, cor do texto e rótulo da faixa).
 */
export function gradientColor(value, faixas) {
  const faixa = getBand(value, faixas);
  if (!faixa) return SEM_DADOS;

  const indice = faixas.indexOf(faixa);
  const proxima = faixas[indice + 1];

  if (!proxima || !Number.isFinite(proxima.min)) {
    return { color: faixa.color, textColor: faixa.textColor, label: faixa.label, labelKey: faixa.labelKey };
  }

  const span = proxima.min - faixa.min;
  const t = span > 0 ? Math.min(Math.max((value - faixa.min) / span, 0), 1) : 0;
  const [r, g, b] = faixa.rgb;
  const [pr, pg, pb] = proxima.rgb;

  return {
    color: `rgb(${Math.round(r + (pr - r) * t)},${Math.round(g + (pg - g) * t)},${Math.round(b + (pb - b) * t)})`,
    textColor: faixa.textColor,
    label: faixa.label,
    labelKey: faixa.labelKey,
  };
}
