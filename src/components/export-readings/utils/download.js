import { getLocale } from '@/i18n/translate';

/** Dispara o download de um Blob via elemento <a>. */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Formata bytes para exibição no progresso/resultado. */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toLocaleString(getLocale(), {
    maximumFractionDigits: unitIndex === 0 ? 0 : 1,
    minimumFractionDigits: 0,
  })} ${units[unitIndex]}`;
}
