import { FAIXAS_Y_MAX } from '@/rules/faixas';
import { normalizarFaixas } from './faixas.js';
import { buildGradientScale } from './build-gradient-scale.js';
import { aqiColor } from './aqi-color.js';

/**
 * Monta o descritor de uma variável monitorada.
 *
 * `faixas` é a forma canônica das faixas de qualidade: é consumida pela cor do
 * marcador no mapa, pelo chip do popup, pela legenda e pelas faixas coloridas
 * do gráfico — todas com os mesmos cortes e os mesmos rótulos. `getColor`
 * deriva dela (interpolado nas escalas contínuas, discreto no AQI), de modo que
 * nenhuma camada consiga divergir das outras.
 *
 * @param {object} config
 * @param {string} config.key - Identificador da variável no redux.
 * @param {string} config.label - Nome exibido da variável (pt-BR).
 * @param {string} config.labelKey - Chave i18n do nome da variável.
 * @param {string} config.unit - Unidade de medida.
 * @param {Array<{min?: number, max?: number, rgb: number[], label: string, labelKey: string, textColor?: string}>} config.stops - Stops brutos.
 * @param {(reading: object) => number|null} config.extract - Extrai o valor de uma leitura.
 * @param {'gradient'|'discrete'} [config.mode] - Cor interpolada dentro da faixa ou uma cor por faixa.
 * @returns {object} Descritor da variável.
 */
export function buildVariable({ key, label, labelKey, unit, stops, extract, mode = 'gradient' }) {
  const faixas = normalizarFaixas(stops);

  return {
    key,
    label,
    labelKey,
    unit,
    extract,
    faixas,
    faixasYMax: FAIXAS_Y_MAX[key] ?? null,
    getColor: mode === 'discrete' ? (value) => aqiColor(value, faixas) : buildGradientScale(faixas),
  };
}
