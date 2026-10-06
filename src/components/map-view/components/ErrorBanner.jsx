import { useTranslation } from '@/i18n';

/**
 * Banner de erro exibido no topo do mapa quando a requisição de sensores falha.
 *
 * @param {string|null} props.error - Mensagem de erro ou null para ocultar.
 */
export function ErrorBanner({ error }) {
  const { t } = useTranslation();
  if (!error) return null;
  return (
    <div className="ErrorBannerComponent absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 text-red-700 px-4 py-2 rounded-sm text-sm shadow">
      {t('common.error')}: {t(error)}
    </div>
  );
}
