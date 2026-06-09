export function LoadingOverlay({ loading }) {
  if (!loading) return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded">
      <div className="flex items-center gap-3 text-text-dark font-semibold">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Carregando sensores…
      </div>
    </div>
  );
}
