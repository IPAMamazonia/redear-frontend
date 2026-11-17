/**
 * Item do dropdown de seleção compartilhado.
 *
 * Usa `role="option"` dentro do listbox: o item recebe foco programático pelas
 * setas e alterna a seleção com Enter/Espaço. O checkbox é apenas visual.
 *
 * @param {object} props
 * @param {{id: string, label: string, sublabel?: string}} props.option - Opção renderizada.
 * @param {boolean} props.selected - Se a opção está selecionada.
 * @param {boolean} props.multiple - Se o dropdown permite múltipla seleção.
 * @param {() => void} props.onToggle - Alterna a seleção do item.
 */
export function SensorSelectOption({ option, selected, multiple, onToggle }) {
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onToggle();
  };

  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
        multiple ? 'hover:bg-black/5' : ''
      } ${!multiple && selected ? 'bg-black/5' : ''}`}
    >
      {multiple ? (
        <input
          type="checkbox"
          checked={selected}
          readOnly
          tabIndex={-1}
          className="w-3.5 h-3.5 cursor-pointer accent-laranja pointer-events-none"
        />
      ) : (
        <span className="block w-[14px]">
          {selected && <i className="fas fa-check text-[11px] text-laranja" />}
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-medium text-text-dark truncate">{option.label}</span>
        {option.sublabel && (
          <span className="block text-[11px] text-text-light truncate">{option.sublabel}</span>
        )}
      </span>
    </div>
  );
}
