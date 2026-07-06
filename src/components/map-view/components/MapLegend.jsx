import { FAIXAS_PM25 } from '@/rules/qualidadeAr';

/**
 * Legenda do mapa exibindo as faixas de PM2.5 com cores.
 */
export function MapLegend() {
  return (
    <div className="MapLegendComponent absolute bottom-7 right-1 z-10 bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass text-sm max-md:hidden">
      <div className="p-4">
        <h4 className="mb-2 text-sm">PM2.5 (µg/m³)</h4>
        {FAIXAS_PM25.map((f) => (
          <div key={f.label} className="flex items-center gap-2 mb-1">
            <span className="w-[14px] h-[14px] rounded-full shrink-0" style={{ background: f.color }} />
            {f.label}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-black/10">
          <span className="w-[14px] h-[14px] rounded-full shrink-0" style={{ background: '#9e9e9e' }} />
          Offline
        </div>
      </div>
    </div>
  );
}
