/**
 * Localiza a faixa de qualidade que contém um valor.
 *
 * A busca é linear e usa o limite superior (`max`) de cada faixa, que é a
 * forma canônica em `normalizarFaixas`. Faixas abertas em `Infinity` ensurem
 * que qualquer valor finito caia em alguma faixa. O rótulo devolvido é sempre
 * o da faixa que de fato contém o valor — é ele que precisa bater com a cor
 * exibida na legenda do mapa e nas faixas do gráfico.
 *
 * @param {number|null|undefined} value - Valor a ser classificado.
 * @param {Array<{min: number, max: number, label: string}>} faixas - Faixas normalizadas, em ordem crescente.
 * @returns {{min: number, max: number, label: string, color: string, textColor: string}|null}
 *   A faixa encontrada, ou `null` se o valor é nulo ou a lista está vazia.
 */
export function getBand(value, faixas) {
  if (value == null || !Array.isArray(faixas) || faixas.length === 0) return null;

  for (const faixa of faixas) {
    if (value <= faixa.max) return faixa;
  }

  return faixas[faixas.length - 1];
}
