import { getLocale } from '@/i18n/translate';

export function formatNumberString(value, decimals = 0) {
  if (value == null || isNaN(value)) return '';

  return Number(value).toLocaleString(getLocale(), {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formata o intervalo de uma faixa de qualidade.
 *
 * @param {number} min - Limite inferior.
 * @param {number} max - Limite superior (pode ser infinito).
 * @param {string} unit - Unidade exibida após os valores.
 * @returns {string} Intervalo legível, como `0 – 12.1 µg/m³` ou `≥ 50 µg/m³`.
 */
export function formatLimite(min, max, unit) {
  const teto = Number.isFinite(max) ? max : null;
  const piso = Number.isFinite(min) ? min : 0;
  const arredonda = (value) => Number(value.toFixed(1)).toString();

  if (teto == null) return `≥ ${arredonda(piso)} ${unit}`;
  return `${arredonda(piso)} – ${arredonda(teto)} ${unit}`;
}
