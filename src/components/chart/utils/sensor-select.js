/**
 * Helpers puros do dropdown de filtros do gráfico.
 */

/**
 * Pluraliza o substantivo usado no resumo da seleção.
 *
 * @param {string} palavra - Substantivo no singular.
 * @param {number} quantidade - Quantidade selecionada.
 * @returns {string} Substantivo no singular ou plural.
 */
export function pluralDe(palavra, quantidade) {
  if (palavra === 'sensor') return quantidade === 1 ? 'sensor' : 'sensores';
  return quantidade === 1 ? palavra : `${palavra}s`;
}

/**
 * Filtra opções pelo rótulo ou sub-rótulo.
 *
 * @param {Array<{id: string, label: string, sublabel?: string}>} options - Opções disponíveis.
 * @param {string} busca - Termo digitado.
 * @returns {Array<{id: string, label: string, sublabel?: string}>} Opções que casam com o termo.
 */
export function filtrarOpcoes(options, busca) {
  const termo = busca.trim().toLowerCase();
  if (!termo) return options;

  return options.filter((opcao) => {
    const rotulo = (opcao.label || '').toLowerCase();
    const sublabel = (opcao.sublabel || '').toLowerCase();
    return rotulo.includes(termo) || sublabel.includes(termo);
  });
}

/**
 * Adiciona/remove um id da seleção, conforme o modo do dropdown.
 *
 * @param {string[]} value - Ids selecionados.
 * @param {string} id - Id acionado.
 * @returns {string[]} Nova lista de ids.
 */
export function alternarSelecao(value, id) {
  return value.includes(id) ? value.filter((item) => item !== id) : [...value, id];
}

/**
 * Verifica se todas as opções visíveis já estão selecionadas.
 *
 * @param {Array<{id: string}>} opcoesVisiveis - Opções após a busca.
 * @param {string[]} value - Ids selecionados.
 * @returns {boolean}
 */
export function todosVisiveisSelecionados(opcoesVisiveis, value) {
  return opcoesVisiveis.length > 0 && opcoesVisiveis.every((opcao) => value.includes(opcao.id));
}

/**
 * Marca ou desmarca todas as opções visíveis, preservando as demais.
 *
 * @param {string[]} value - Ids selecionados.
 * @param {Array<{id: string}>} opcoesVisiveis - Opções após a busca.
 * @param {boolean} todosVisiveis - Se todas as opções visíveis já estão marcadas.
 * @returns {string[]} Nova lista de ids.
 */
export function alternarVisiveisSelecionados(value, opcoesVisiveis, todosVisiveis) {
  const ids = new Set(value);
  const visiveis = new Set(opcoesVisiveis.map((opcao) => opcao.id));

  if (todosVisiveis) visiveis.forEach((id) => ids.delete(id));
  else visiveis.forEach((id) => ids.add(id));

  return [...ids];
}

/**
 * Monta o texto do botão fechado do dropdown.
 *
 * @param {object} params
 * @param {boolean} params.multiple - Modo multi-seleção.
 * @param {number} params.quantidade - Quantidade selecionada no modo múltiplo.
 * @param {{ label: string }|undefined} params.opcaoAtiva - Opção ativa no modo único.
 * @param {string} params.placeholder - Texto quando nada está selecionado.
 * @param {string} params.itemWord - Substantivo usado no resumo múltiplo.
 * @param {(key: string) => string} params.t - Função de tradução.
 * @returns {string}
 */
export function tituloSelecao({ multiple, quantidade, opcaoAtiva, placeholder, itemWord, t }) {
  if (!multiple) return opcaoAtiva ? opcaoAtiva.label : placeholder;
  if (!quantidade) return placeholder;

  const sufixo = t(quantidade === 1 ? 'chart.selectedSingular' : 'chart.selectedPlural');
  return `${quantidade} ${pluralDe(itemWord, quantidade)} ${sufixo}`;
}
