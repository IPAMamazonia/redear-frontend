import { useTranslation } from '@/i18n';

export function ClusterToggleButton({ enabled, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      className={`w-9 h-9 flex items-center justify-center bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass cursor-pointer text-text-dark text-sm hover:shadow-hover transition-shadow ${
        enabled ? '' : 'ring-2 ring-verde/50'
      }`}
      onClick={() => onToggle(!enabled)}
      title={enabled ? t('map.disableClusters') : t('map.enableClusters')}
    >
      <i className={`fas ${enabled ? 'fa-object-group' : 'fa-braille'}`} />
    </button>
  );
}
