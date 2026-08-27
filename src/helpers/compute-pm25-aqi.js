/**
 * Converte uma concentração de PM2.5 (µg/m³) no índice AQI da EPA.
 *
 * A concentração é truncada a 1 casa decimal e, em seguida, interpolada
 * linearmente dentro da faixa de breakpoints correspondente. Para valores
 * acima do último breakpoint, a mesma inclinação é aplicada. Valores nulos
 * retornam `null`.
 *
 * @param {number|null|undefined} pm25 - Concentração de PM2.5 em µg/m³.
 * @param {Array<{iLow: number, iHigh: number, cLow: number, cHigh: number}>} breakpoints -
 *   Breakpoints EPA (concentração ↔ índice AQI) ordenados por concentração.
 * @returns {number|null} O índice AQI arredondado, ou `null` se `pm25` for nulo.
 */
export function computePM25AQI(pm25, breakpoints) {
  if (pm25 == null) return null;
  const c = Math.floor(pm25 * 10) / 10; // EPA trunca PM2.5 a 1 casa decimal
  for (const { iLow, iHigh, cLow, cHigh } of breakpoints) {
    if (c <= cHigh) {
      return Math.round(((iHigh - iLow) / (cHigh - cLow)) * (c - cLow) + iLow);
    }
  }
  const last = breakpoints[breakpoints.length - 1];
  return Math.round(((last.iHigh - last.iLow) / (last.cHigh - last.cLow)) * (c - last.cLow) + last.iLow);
}
