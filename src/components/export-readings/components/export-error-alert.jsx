/**
 * Alerta de erro da exportação, com botão opcional de nova tentativa.
 *
 * @param {object} props
 * @param {string} props.message - Mensagem já traduzida.
 * @param {() => void} [props.onRetry] - Ação de nova tentativa.
 * @param {string} [props.retryLabel] - Rótulo já traduzido do botão.
 * @param {string} [props.className] - Classes extras de layout.
 */
export function ExportErrorAlert({ message, onRetry, retryLabel, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center gap-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
    >
      <i className="fas fa-triangle-exclamation" />
      <span className="flex-1 min-w-[220px]">{message}</span>
      {onRetry && retryLabel && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-[10px] border border-red-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-white transition-colors"
        >
          <i className="fas fa-rotate-right mr-1" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
