import { useTranslation } from '@/i18n';

/** Notas sobre formato e limitações do CSV exportado. */
export function ExportHelp() {
  const { t } = useTranslation();

  return (
    <details className="ExportHelpComponent mt-6 rounded-[10px] border border-black/5 bg-white/40 px-4 py-3 text-sm text-text-light">
      <summary className="cursor-pointer select-none font-semibold text-text-dark">
        <i className="fas fa-circle-info mr-2 text-verde-escuro" />
        {t('exportData.helpTitle')}
      </summary>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>{t('exportData.helpFormat')}</li>
        <li>{t('exportData.helpOrder')}</li>
        <li>{t('exportData.helpDecimal')}</li>
        <li>{t('exportData.helpLarge')}</li>
      </ul>
    </details>
  );
}
