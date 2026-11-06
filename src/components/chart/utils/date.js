/**
 * Formata uma data como valor aceito por `<input type="date">`.
 *
 * @param {Date} date - Data a formatar.
 * @returns {string} Data no formato `YYYY-MM-DD`.
 */
export function formatarDataInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
