import { useTranslation } from '@/i18n';

import { formatBytes } from '../utils/download';

/**
 * Estado de download em andamento. Não há percentual: o backend usa streaming
 * sem `Content-Length`.
 *
 * @param {object} props
 * @param {number} props.downloadedBytes
 * @param {number} props.elapsedMs
 * @param {() => void} props.onCancel
 */
export function ExportProgress({ downloadedBytes, elapsedMs, onCancel }) {
  const { t, getLocale } = useTranslation();
  const seconds = (elapsedMs / 1000).toLocaleString(getLocale(), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div
      role="status"
      aria-live="polite"
      className="ExportProgressComponent mt-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-laranja/20 bg-laranja/5 px-4 py-3 text-sm text-text-dark"
    >
      <i className="fas fa-spinner fa-spin text-laranja" />
      <span className="font-semibold">{t('exportData.downloading')}</span>
      <span className="text-text-light">
        {t('exportData.downloadedBytes', { bytes: formatBytes(downloadedBytes) })}
      </span>
      <span className="text-text-light">{t('exportData.elapsed', { seconds })}</span>
      <button
        type="button"
        onClick={onCancel}
        className="ml-auto cursor-pointer rounded-[10px] border border-red-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
      >
        <i className="fas fa-xmark mr-1" />
        {t('exportData.cancel')}
      </button>
    </div>
  );
}
