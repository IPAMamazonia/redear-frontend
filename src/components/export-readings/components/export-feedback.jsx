import { useTranslation } from '@/i18n';

import { formatBytes } from '../utils/download';

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
 * Mensagens de erro de validação/API e confirmação de download.
 *
 * @param {object} props
 * @param {string|null} props.formError - Chave i18n de erro local.
 * @param {{code: string, messageKey: string}|null} props.error - Erro da exportação.
 * @param {object|null} props.result - Resultado bem-sucedido.
 * @param {() => void} props.onRetry
 * @param {() => void} props.onDownloadAgain
 */
export function ExportFeedback({ formError, error, result, onRetry, onDownloadAgain }) {
  const { t, getLocale } = useTranslation();
  const locale = getLocale();

  if (formError) {
    return (
      <div
        role="alert"
        className="mt-5 flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <i className="fas fa-circle-exclamation mt-0.5" />
        <span>{t(formError)}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mt-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        <i className="fas fa-triangle-exclamation" />
        <span className="flex-1 min-w-[220px]">{t(error.messageKey)}</span>
        {error.code !== 'CANCELLED' && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-[10px] border border-red-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-white transition-colors"
          >
            <i className="fas fa-rotate-right mr-1" />
            {t('exportData.retry')}
          </button>
        )}
      </div>
    );
  }

  if (!result) return null;

  const metadata = result.metadata;
  const redeArCount = metadata.redeArIds?.length ?? 0;
  const purpleAirCount = metadata.purpleAirIds?.length ?? 0;
  const seconds = (result.elapsedMs / 1000).toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800"
    >
      <i className="fas fa-circle-check text-base" />
      <div className="flex-1 min-w-[240px]">
        <p className="font-semibold">{t('exportData.successTitle')}</p>
        <p className="mt-0.5 break-all text-xs">
          {t('exportData.successFile', { filename: result.filename })}
        </p>
        <p className="mt-0.5 text-xs text-emerald-700/80">
          {t('exportData.successDetails', {
            bytes: formatBytes(result.bytes),
            seconds,
          })}
          {' · '}
          {t('exportData.summarySensors', { redeAr: redeArCount, purpleAir: purpleAirCount })}
          {' · '}
          {formatDate(metadata.startDate, locale)} – {formatDate(metadata.endDate, locale)}
        </p>
      </div>
      <button
        type="button"
        onClick={onDownloadAgain}
        className="cursor-pointer rounded-[10px] border border-emerald-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-white transition-colors"
      >
        <i className="fas fa-download mr-1" />
        {t('exportData.downloadAgain')}
      </button>
    </div>
  );
}
