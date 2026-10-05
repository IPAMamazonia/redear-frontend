/**
 * Utilitários das faixas de qualidade.
 *
 * Traduzem as duas formas de declaração que o projeto usa — `*_STOPS` com
 * limite inferior (`min`, escalas contínuas com gradiente) e `AQI_STOPS` com
 * limite superior (`max`, índice AQI) — para a mesma estrutura fechada
 * `{min, max}`, consumida pelo mapa, pelo popup, pela legenda e pelo gráfico.
 */

/**
 * Converte `[r, g, b]` em `rgb(r,g,b)`.
 *
 * @param {number[]} rgb - Canais de 0 a 255.
 * @returns {string} Cor no formato CSS `rgb(r,g,b)`.
 */
export function rgbToCss(rgb) {
  return `rgb(${rgb.join(',')})`;
}

/**
 * Converte `[r, g, b]` em `rgba(r,g,b,a)`.
 *
 * @param {number[]} rgb - Canais de 0 a 255.
 * @param {number} alpha - Opacidade de 0 a 1.
 * @returns {string} Cor no formato CSS `rgba(r,g,b,a)`.
 */
export function rgba(rgb, alpha) {
  return `rgba(${rgb.join(',')},${alpha})`;
}

/**
 * Normaliza uma lista de stops em faixas fechadas e ordenadas.
 *
 * Stops com `min` (gradiente) recebem como `max` o `min` do stop seguinte; a
 * última faixa é aberta em `Infinity`. Stops com `max` (índice) recebem como
 * `min` o `max` do stop anterior; a primeira faixa é aberta para menos
 * infinito. A primeira faixa com `min` declarado preserva o próprio `min`, o
 * que permite escalas que não começam em zero (pressão, por exemplo).
 *
 * @param {Array<{min?: number, max?: number, rgb: number[], label: string, textColor?: string}>} stops -
 *   Stops ordenados do menor para o maior.
 * @returns {Array<{min: number, max: number, rgb: number[], color: string, textColor: string, label: string}>}
 *   Faixas fechadas, com a cor CSS pré-calculada.
 */
export function normalizarFaixas(stops) {
  return stops.map((stop, i) => {
    const anterior = stops[i - 1];
    const proximo = stops[i + 1];

    const min = stop.min ?? anterior?.max ?? -Infinity;
    const max = stop.max ?? proximo?.min ?? Infinity;

    return {
      min,
      max,
      rgb: stop.rgb,
      color: rgbToCss(stop.rgb),
      textColor: stop.textColor ?? '#000000',
      label: stop.label,
    };
  });
}
