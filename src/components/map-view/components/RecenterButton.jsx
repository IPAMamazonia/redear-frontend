import { VIEW_CONFIG } from '../rules';

export function RecenterButton({ mapRef }) {
  return (
    <button
      className="w-9 h-9 flex items-center justify-center bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass cursor-pointer text-text-dark text-base hover:shadow-hover transition-shadow"
      onClick={() => mapRef.current?.getView().animate({ center: VIEW_CONFIG.center, zoom: VIEW_CONFIG.zoom, duration: 500 })}
      title="Centralizar mapa"
    >
      ⌖
    </button>
  );
}
