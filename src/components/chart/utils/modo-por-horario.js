import { Interaction } from 'chart.js';

/**
 * Modo de interação que casa um ponto por dataset pelo *horário* mais próximo
 * do cursor.
 *
 * Por que não `mode: 'index'`: esse modo do Chart.js não casa por horário, e
 * sim por posição no array — em `Interaction.modes.index` o índice da série
 * mais próxima do cursor é reaproveitado em todas as outras séries:
 *
 *     const index = items[0].index;
 *     const element = meta.data[index];
 *
 * Isso só vale para séries *paralelas* (índice `i` = mesmo instante em todas).
 * Aqui cada dataset é um sensor, com início, fim, contagem de pontos e cadência
 * próprios. Dois sensores da mesma rede podem ter leituras de 18 h de diferença
 * no mesmo índice, e o tooltip acabava mostrando valores de instantes
 * diferentes sob um único cabeçalho de horário.
 *
 * A busca é feita em espaço de pixel (`element.x`), que é sempre crescente e já
 * refletindo zoom e pan, e não depende de `element.parsed` — que não é populado
 * quando o dataset usa `parsing: false`.
 *
 * Um sensor cuja leitura mais próxima está além da tolerância da própria série
 * fica de fora do tooltip: honesto é não ter linha nenhuma naquele instante, em
 * vez de exibir um valor antigo como se fosse atual.
 */

/** Nome do modo em `Interaction.modes`. */
export const MODO_POR_HORARIO = 'porHorario';

/** Onde o instante do cursor é guardado na instância do Chart.js. */
const CHAVE_INSTANTE = Symbol('instanteDoCursor');

/** Folga mínima entre cursor e leitura aceita, em ms de tempo real. */
const FOLGA_MINIMA_MS = 2 * 60 * 1000;

/** Quantas vezes o espaçamento próprio da série a folga pode alcançar. */
const FATOR_FOLGA = 2;

/**
 * Lê o instante (ms) ao qual o cursor foi resolvido na última interação.
 *
 * O tooltip usa esse valor no cabeçalho, para que o horário mostrado seja o do
 * cursor — e não o de um dos sensores, que é arbitrário entre séries.
 *
 * @param {object} chart - Instância do Chart.js.
 * @returns {number|null} Instante em ms, ou `null` se ainda não houve interação.
 */
export function lerInstanteDoCursor(chart) {
  return chart?.[CHAVE_INSTANTE] ?? null;
}

/**
 * Índice do ponto cujo `x` (pixel) está mais próximo de `px`.
 *
 * @param {Array<{x: number}>} pontos - `meta.data` do dataset, em ordem crescente de x.
 * @param {number} px - Posição do cursor em pixels do canvas.
 * @returns {number} Índice do ponto mais próximo.
 */
function indiceMaisProximo(pontos, px) {
  let inicio = 0;
  let fim = pontos.length - 1;

  while (inicio < fim) {
    const meio = (inicio + fim) >> 1;
    if (pontos[meio].x < px) inicio = meio + 1;
    else fim = meio;
  }

  if (inicio > 0 && px - pontos[inicio - 1].x <= pontos[inicio].x - px) inicio -= 1;

  return inicio;
}

/**
 * Tolerância aceita para uma série, em ms de tempo real.
 *
 * Deriva do espaçamento médio da própria série, então acompanha a cadência de
 * cada fonte sem parâmetro mágico: uma série de 4 em 4 minutos não absorve um
 * ponto de 18 h atrás, e uma série horária continua aceitando o ponto vizinho.
 *
 * @param {Array<{x: number}>} pontos - `meta.data` do dataset.
 * @param {object} escala - Escala X do gráfico.
 * @returns {number} Tolerância em ms.
 */
function toleranciaDaSerie(pontos, escala) {
  if (pontos.length < 2) return FOLGA_MINIMA_MS;

  const primeiro = escala.getValueForPixel(pontos[0].x);
  const ultimo = escala.getValueForPixel(pontos[pontos.length - 1].x);
  const espacamento = Math.abs(ultimo - primeiro) / (pontos.length - 1);

  if (!Number.isFinite(espacamento)) return FOLGA_MINIMA_MS;

  return Math.max(FOLGA_MINIMA_MS, espacamento * FATOR_FOLGA);
}

function modoPorHorario(chart, event) {
  const escala = chart.scales?.x;
  if (!escala || event.x == null) return [];

  const instante = escala.getValueForPixel(event.x);
  if (!Number.isFinite(instante)) return [];

  chart[CHAVE_INSTANTE] = instante;

  const ativos = [];

  for (const meta of chart.getSortedVisibleDatasetMetas()) {
    const pontos = meta.data;
    if (pontos.length === 0) continue;

    const indice = indiceMaisProximo(pontos, event.x);
    const ponto = pontos[indice];
    if (!ponto || ponto.skip) continue;

    const instanteDoPonto = escala.getValueForPixel(ponto.x);
    if (Math.abs(instanteDoPonto - instante) > toleranciaDaSerie(pontos, escala)) continue;

    ativos.push({ element: ponto, datasetIndex: meta.index, index: indice });
  }

  return ativos;
}

if (!Interaction.modes[MODO_POR_HORARIO]) {
  Interaction.modes[MODO_POR_HORARIO] = modoPorHorario;
}
