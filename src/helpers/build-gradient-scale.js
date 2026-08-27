import { gradientColor } from './gradient-color.js';

/**
 * Cria uma função que avalia a cor de um valor usando uma lista fixa de faixas.
 *
 * O resultado é uma função `(value) => estilo` que delega para
 * {@link gradientColor} com as faixas fornecidas.
 *
 * @param {Array<{min: number, rgb: number[], textColor?: string, label: string}>} stops -
 *   Faixas ordenadas por `min`.
 * @returns {(value: number|null|undefined) => {color: string, textColor: string, label: string}}
 *   Função que retorna o estilo de cor para um determinado valor.
 */
export function buildGradientScale(stops) {
  return (value) => gradientColor(value, stops);
}
