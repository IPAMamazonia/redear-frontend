import { SEM_DADOS } from '@/rules/faixas';
import { getBand } from './get-band.js';

/**
 * Retorna a cor e o rótulo da categoria AQI para um índice.
 *
 * A cor é discreta por faixa (sem interpolação). Valores nulos retornam o
 * estilo "Sem dados".
 *
 * @param {number|null|undefined} aqi - Índice AQI.
 * @param {Array<{min: number, max: number, color: string, textColor: string, label: string}>} faixas -
 *   Faixas AQI normalizadas, em ordem crescente de índice.
 * @returns {{color: string, textColor: string, label: string}} Estilo de cor
 * (cor de fundo, cor do texto e rótulo da categoria).
 */
export function aqiColor(aqi, faixas) {
  const faixa = getBand(aqi, faixas);
  if (!faixa) return SEM_DADOS;

  return { color: faixa.color, textColor: faixa.textColor, label: faixa.label };
}
