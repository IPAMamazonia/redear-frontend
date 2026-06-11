/**
 * Grupo de botões toggle no estilo "segmented control".
 *
 * @param {Array<{value: string, label: string}>} props.options - Opções disponíveis.
 * @param {string}   props.value    - Valor atualmente selecionado.
 * @param {function} props.onChange - Callback chamada com o valor clicado.
 * @param {string}   [props.className] - Classes adicionais.
 */
export function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`SegmentedControlComponent flex gap-0 bg-white/50 
        backdrop-blur rounded-[10px] p-1 border border-white/40 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-[1.1rem] py-[0.45rem] border-none bg-transparent cursor-pointer 
            text-sm font-semibold rounded-lg transition-all duration-[0.35s] ease-out
            ${
              value === opt.value
                ? 'text-text-dark bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                : 'text-text-light hover:text-[#FF6D00]'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
