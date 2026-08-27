/**
 * Calcula a média aritmética de dois valores numéricos.
 *
 * Valores nulos ou indefinidos são ignorados. Se apenas um dos valores for
 * válido, retorna este valor; se ambos forem inválidos, retorna `null`. O
 * resultado é arredondado para 1 casa decimal.
 *
 * @param {number|null|undefined} v1 - Primeiro valor.
 * @param {number|null|undefined} v2 - Segundo valor.
 * @returns {number|null} A média com 1 casa decimal, ou `null` se ambos os
 * valores forem nulos ou indefinidos.
 */
export function avg(v1, v2) {
  const a = v1 ?? null;
  const b = v2 ?? null;
  if (a == null && b == null) return null;
  if (a == null) return Number(b);
  if (b == null) return Number(a);
  return Number(((a + b) / 2).toFixed(1));
}
