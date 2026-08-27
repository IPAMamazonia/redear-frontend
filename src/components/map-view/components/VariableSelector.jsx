import { setSelectedVariable } from '@/store/slices/uiSlice';
import { MAP_VARIABLES } from '@/rules/variables';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useRef } from 'react';

export function VariableSelector() {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.ui.selectedVariable);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = MAP_VARIABLES.find((v) => v.key === selected) || MAP_VARIABLES[0];

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="VariableSelectorComponent text-sm" ref={ref}>
      <div className="relative">
        <button
          className={`h-9 px-3 flex items-center gap-2 bg-card backdrop-blur-xl border border-white/35 rounded shadow-glass 
            cursor-pointer text-text-dark text-xs font-medium hover:shadow-hover transition-all ease-[cubic-bezier(0.4,0,0.2,1)] 
            duration-300 ${open ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
          onClick={() => setOpen(true)}
          title="Selecionar variável"
        >
          <i className="fas fa-layer-group text-[10px]" />
          <span>{current.label}</span>
          <i className="fas fa-chevron-up text-[10px]" />
        </button>

        <div
          className={`absolute bottom-full left-0 mb-1 bg-card backdrop-blur-xl border border-white/35 rounded 
            shadow-glass py-1 min-w-[160px] max-h-[340px] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
            origin-bottom-left ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'
          }`}
        >
          {MAP_VARIABLES.map((v) => (
            <button
              key={v.key}
              className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer bg-transparent border-none hover:bg-black/5 transition-colors ${
                v.key === selected ? 'font-semibold text-text-dark' : 'text-text-light'
              }`}
              onClick={() => {
                dispatch(setSelectedVariable(v.key));
                setOpen(false);
              }}
            >
              {v.label}
              <span className="ml-1 opacity-50">{v.unit}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
