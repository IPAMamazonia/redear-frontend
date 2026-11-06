import { formatLimite } from '@/helpers/format';
import { useTranslation } from '@/i18n';

/**
 * Legenda das faixas de qualidade pintadas atrás das séries do gráfico.
 *
 * Reusa exatamente as faixas que o plugin desenhou (`faixas` já filtradas pelo
 * eixo Y), então a legenda não pode descrever uma faixa que não está no
 * gráfico, nem esconder uma que está. Os limites numéricos ajudam a ler a
 * altura do ponto contra a faixa.
 *
 * @param {Array<{min: number, max: number, color: string, textColor: string, label: string, labelKey: string}>} props.faixas - Faixas visíveis no gráfico.
 * @param {string} props.unit - Unidade da variável.
 */
export function FaixasLegend({ faixas, unit }) {
  const { t } = useTranslation();
  if (!Array.isArray(faixas) || faixas.length === 0) return null;

  return (
    <div className="max-w-[1280px] mx-auto mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {faixas.map((faixa) => (
        <span key={faixa.labelKey} className="inline-flex items-center gap-1.5 text-xs text-text-light">
          <span
            className="w-[14px] h-[14px] rounded-[4px] shrink-0 border border-black/10"
            style={{ background: faixa.color }}
          />
          <span className="font-semibold text-text-dark">{t(faixa.labelKey)}</span>
          <span>{formatLimite(faixa.min, faixa.max, unit)}</span>
        </span>
      ))}
    </div>
  );
}