/**
 * Interpola linearmente entre duas cores RGB.
 *
 * Cada cor é representada como um array `[r, g, b]` com canais de 0 a 255. O
 * parâmetro `t` controla a mistura: `0` retorna a cor `low` e `1` retorna a
 * cor `high`.
 *
 * @param {number[]} low - Cor inicial como `[r, g, b]`.
 * @param {number[]} high - Cor final como `[r, g, b]`.
 * @param {number} t - Fator de interpolação entre 0 e 1.
 * @returns {string} A cor interpolada no formato `rgb(r,g,b)`.
 */
export function lerpColor(low, high, t) {
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${r},${g},${b})`;
}
