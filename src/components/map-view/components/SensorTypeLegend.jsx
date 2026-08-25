import { useEffect, useRef, useState } from 'react';

export function SensorTypeLegend() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="SensorTypeLegendComponent text-sm">
      <div className="relative" ref={ref}>
        <button
          className={`w-9 h-9 flex items-center justify-center bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass cursor-pointer text-text-dark text-base hover:shadow-hover transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
          }`}
          onClick={() => setOpen(true)}
          title="Tipos de sensor"
        >
          <i className="fas fa-info" />
        </button>

        <div
          className={`absolute bottom-full left-0 mb-1 bg-card backdrop-blur-xl border border-white/35 rounded z-10
            shadow-glass p-4 max-w-[240px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] origin-bottom-left 
            ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Tipos de Sensor</h4>
            <button
              className="text-text-light hover:text-text-dark text-lg leading-none cursor-pointer bg-transparent border-none p-0"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col gap-2 text-xs text-text-light">
            <div className="flex items-center gap-2">
              <span className="w-[14px] h-[14px] rounded-full bg-verde shrink-0 border border-white" />
              <span>RedeAR (circular)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-[14px] h-[14px] shrink-0 bg-verde border border-white" />
              <span>PurpleAir (quadrado)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
