const PERIODOS = [
  { value: '1D', label: '1 D' },
  { value: '7D', label: '7 D' },
  { value: '14D', label: '14 D' },
  { value: '1M', label: '1 M' },
  { value: '2M', label: '2 M' },
  { value: '3M', label: '3 M' },
  { value: '6M', label: '6 M' },
];

/**
 * Seletor de período do gráfico com botões de alternância.
 *
 * @param {string} props.value - Período ativo.
 * @param {(value: string) => void} props.onChange - Callback com o período clicado.
 */
export function PeriodSelector({ value, onChange }) {
  return (
    <div className="flex gap-0 flex-wrap bg-white/60 backdrop-blur rounded-[10px] p-[0.35rem] border border-white/50">
      {PERIODOS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-[1.1rem] py-2 border-none bg-transparent cursor-pointer text-sm font-semibold transition-all duration-[0.35s] ease-out relative rounded-lg
            ${
              value === p.value
                ? 'text-[#FF6D00] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-[3px] after:rounded after:bg-[#FF6D00]'
                : 'text-text-light hover:text-[#FF6D00]'
            }`}
          title={p.label.replace(' ', '')}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}