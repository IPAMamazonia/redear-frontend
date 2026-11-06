import { useTranslation } from '@/i18n';

function ChartMessage({ icon, children }) {
  return (
    <div className="h-[420px] flex flex-col items-center justify-center gap-3 text-center px-4">
      <i className={icon} />
      {children}
    </div>
  );
}

/**
 * Estados de conteúdo do gráfico (sem seleção, carregando, erro ou sem leituras).
 *
 * @param {object} props
 * @param {boolean} props.hasSelection - Há uma seleção válida de sensores/município/estado.
 * @param {boolean} props.loading - Requisição de leituras em andamento.
 * @param {string|null} props.error - Chave i18n do erro, se houver.
 * @param {boolean} props.empty - Requisição concluída sem séries para desenhar.
 * @param {() => void} props.onRetry - Repete a busca de leituras.
 */
export function ChartState({ hasSelection, loading, error, empty, onRetry }) {
  const { t } = useTranslation();

  if (!hasSelection) {
    return (
      <ChartMessage icon="fas fa-chart-line text-4xl text-text-light/40">
        <p className="text-text-light max-w-md">
          {t('chart.emptyBefore')} <strong>{t('chart.emptySensors')}</strong> {t('chart.emptyMid')}{' '}
          <strong>{t('chart.emptyMunicipality')}</strong> {t('chart.emptyMid2')}{' '}
          <strong>{t('chart.emptyState')}</strong> {t('chart.emptyAfter')}
        </p>
      </ChartMessage>
    );
  }

  if (loading) {
    return (
      <ChartMessage icon="fas fa-spinner fa-spin text-3xl text-[#FF6D00]">
        <p className="text-text-light">{t('chart.loading')}</p>
      </ChartMessage>
    );
  }

  if (error) {
    return (
      <ChartMessage icon="fas fa-exclamation-triangle text-3xl text-red-600">
        <p className="text-text-light max-w-md">{t(error)}</p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer px-4 py-2 rounded-[10px] bg-[#FF6D00] text-white font-semibold shadow hover:bg-[#FF7F33] transition-colors"
        >
          {t('common.retry')}
        </button>
      </ChartMessage>
    );
  }

  if (empty) {
    return (
      <ChartMessage icon="fas fa-inbox text-3xl text-text-light/40">
        <p className="text-text-light max-w-md">{t('chart.noReadings')}</p>
      </ChartMessage>
    );
  }

  return null;
}
