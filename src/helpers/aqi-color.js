/**
 * Retorna a cor e o rótulo da categoria AQI para um índice.
 *
 * A cor é discreta por faixa (sem interpolação). Valores nulos retornam o
 * estilo "Sem dados".
 *
 * @param {number|null|undefined} aqi - Índice AQI.
 * @param {Array<{max: number, rgb: number[], label: string, textColor?: string}>} stops -
 *   Faixas AQI ordenadas por limite superior de índice.
 * @returns {{color: string, textColor: string, label: string}} Estilo de cor
 * (cor de fundo, cor do texto e rótulo da categoria).
 */
export function aqiColor(aqi, stops) {
  if (aqi == null) return { color: '#9e9e9e', textColor: '#ffffff', label: 'Sem dados' };
  for (const s of stops) {
    if (aqi <= s.max) return { color: `rgb(${s.rgb.join(',')})`, textColor: s.textColor ?? '#000000', label: s.label };
  }
  const last = stops[stops.length - 1];
  return { color: `rgb(${last.rgb.join(',')})`, textColor: last.textColor ?? '#000000', label: last.label };
}
