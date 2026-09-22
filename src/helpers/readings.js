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