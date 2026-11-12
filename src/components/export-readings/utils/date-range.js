const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo';

/**
 * Retorna a data de hoje no fuso de São Paulo no formato `YYYY-MM-DD`.
 *
 * O backend calcula o período padrão nesse fuso; usar o mesmo fuso evita que
 * usuários em outras regiões vejam um dia diferente do efetivamente aplicado.
 */
export function todayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

/**
 * Soma/subtrai meses de uma data `YYYY-MM-DD`, com clamp no último dia do mês.
 *
 * Ex.: `2026-01-31` com `-2` → `2025-11-30`.
 *
 * @param {string} isoDate - Data no formato `YYYY-MM-DD`.
 * @param {number} months  - Quantidade de meses (pode ser negativa).
 * @returns {string} Nova data no formato `YYYY-MM-DD`.
 */
export function addMonthsClamped(isoDate, months) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDay);

  return new Date(Date.UTC(targetYear, normalizedMonth, targetDay)).toISOString().slice(0, 10);
}

/** Período padrão exibido no formulário: últimos 2 meses de calendário. */
export function defaultDateRange() {
  const endDate = todayInSaoPaulo();
  return { startDate: addMonthsClamped(endDate, -2), endDate };
}

/**
 * Valida o intervalo do formulário. Retorna chaves i18n, não strings prontas.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} today
 * @returns {string[]}
 */
export function validateDateRange(startDate, endDate, today) {
  const errors = [];

  if (!startDate || !endDate) {
    errors.push('exportData.validation.dateRequired');
    return errors;
  }

  if (endDate < startDate) {
    errors.push('exportData.validation.endAfterStart');
  }

  if (today && endDate > today) {
    errors.push('exportData.validation.futureDates');
  }

  return errors;
}
