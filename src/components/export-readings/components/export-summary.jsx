import { useTranslation } from '@/i18n';

function formatDate(date, locale) {
  if (!date) return '—';

  const parsed = new Date(`${date}T12:00:00-03:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Resumo da seleção antes do download.
 *
 * @param {object} props
 * @param {number} props.redeArCount
 * @param {number} props.purpleAirCount
 * @param {string} props.startDate
 * @param {string} props.endDate
 * @param {number} props.precision
 */
export function ExportSummary({ redeArCount, purpleAirCount, startDate, endDate, precision }) {
  const { t, getLocale } = useTranslation();
  const locale = getLocale();
  const hasSelection = redeArCount + purpleAirCount > 0;

  return (
    <div className="ExportSummaryComponent mt-5 rounded-[10px] border border-black/5 bg-white/45 px-4 py-3 text-sm text-text-light">
      {hasSelection ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span>
            <i className="fas fa-microchip mr-1.5 text-verde-escuro" />
            {t('exportData.summarySensors', {
              redeAr: redeArCount,
              purpleAir: purpleAirCount,
            })}
          </span>
          <span>
            <i className="fas fa-calendar-alt mr-1.5 text-laranja" />
            {formatDate(startDate, locale)} – {formatDate(endDate, locale)}
          </span>
          <span>
            <i className="fas fa-sliders-h mr-1.5 text-verde-escuro" />
            {t('exportData.summaryPrecision', { precision })}
          </span>
        </div>
      ) : (
        <p>{t('exportData.emptySelection')}</p>
      )}
    </div>
  );
}
