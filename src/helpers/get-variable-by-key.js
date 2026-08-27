import { MAP_VARIABLES } from '@/rules/variables';

/**
 * Obtém uma variável de mapa pela sua chave.
 *
 * Se a chave não for encontrada, retorna a primeira variável da lista como
 * padrão.
 *
 * @param {string} key - Chave da variável.
 * @returns {object} A variável encontrada ou a variável padrão.
 */
export function getVariableByKey(key) {
  return MAP_VARIABLES.find((v) => v.key === key) || MAP_VARIABLES[0];
}
