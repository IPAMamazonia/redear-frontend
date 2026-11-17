/**
 * Converte temperatura de leituras purpleAir de Fahrenheit para Celsius.
 * A rede purpleAir reporta temperatura em °F; as demais já vêm em °C.
 *
 * @param {number|null} value - Temperatura em °F.
 * @returns {number|null} Temperatura em °C (1 casa decimal) ou null.
 */
export function purpleAirTempParaCelsius(value) {
  if (value == null) return value;
  return Number((((value - 32) * 5) / 9).toFixed(1));
}

/**
 * Normaliza o datetime de uma leitura para ISO 8601 em UTC.
 *
 * Aceita `Date` ou string. Strings sem timezone são interpretadas como UTC,
 * mesma convenção usada pela API de leituras.
 *
 * @param {Date|string|null|undefined} value - Datetime recebido da API.
 * @returns {string|null} Data em ISO 8601 ou null quando inválida/ausente.
 */
export function parseReadingDatetime(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const candidate = hasTimezone ? trimmed : `${trimmed.replace(/\s+/g, 'T')}Z`;
  const date = new Date(candidate);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Normaliza uma leitura individual sem mutar o objeto original.
 *
 * @param {object|null|undefined} reading - Leitura bruta.
 * @param {string} [source] - Fonte da leitura (`purpleAir` ou `RedeAr`).
 * @returns {object|null} Leitura normalizada ou null quando inválida.
 */
export function normalizeReading(reading, source) {
  if (!reading || typeof reading !== 'object') return null;

  const normalized = {
    ...reading,
    datetime: parseReadingDatetime(reading.datetime),
  };

  if (source === 'purpleAir') {
    normalized.bme_temperature = purpleAirTempParaCelsius(normalized.bme_temperature);
  }

  return normalized;
}

/**
 * Normaliza uma lista de leituras, descartando itens inválidos.
 *
 * @param {Array<object>|null|undefined} readings - Leituras brutas.
 * @param {string} [source] - Fonte aplicada a todas as leituras.
 * @returns {Array<object>} Leituras normalizadas.
 */
export function normalizeReadings(readings, source) {
  if (!Array.isArray(readings)) return [];

  return readings.map((reading) => normalizeReading(reading, source)).filter(Boolean);
}
