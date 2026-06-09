export function ErrorBanner({ error }) {
  if (!error) return null;
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-red-50 text-red-700 px-4 py-2 rounded-sm text-sm shadow">
      Erro: {error}
    </div>
  );
}
