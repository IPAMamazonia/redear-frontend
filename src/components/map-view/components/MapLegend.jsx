import { COR_SEM_DADOS, OFFLINE } from '@/rules/faixas';
import { getVariableByKey } from '@/helpers';
import { useTranslation } from '@/i18n';
import { useSelector } from 'react-redux';

export function MapLegend() {
  const { t } = useTranslation();
  const selectedVariableKey = useSelector((state) => state.ui.selectedVariable);
  const variable = getVariableByKey(selectedVariableKey);

  return (
    <div className="MapLegendComponent absolute bottom-7 right-1 z-10 bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass text-sm max-md:hidden">
      <div className="p-4">
        <h4 className="mb-2 text-sm">{t(variable.labelKey)} ({variable.unit})</h4>
        {variable.faixas.map((f) => (
          <div key={f.labelKey} className="flex items-center gap-2 mb-1">
            <span
              className="w-[14px] h-[14px] rounded-full shrink-0"
              style={{ background: f.color, color: f.textColor }}
            />
            {t(f.labelKey)}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-black/10">
          <span className="w-[14px] h-[14px] rounded-full shrink-0" style={{ background: COR_SEM_DADOS }} />
          {t(OFFLINE.labelKey)}
        </div>
      </div>
    </div>
  );
}
