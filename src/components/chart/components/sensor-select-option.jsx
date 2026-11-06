/**
 * Item do dropdown de filtros.
 *
 * @param {object} props
 * @param {{id: string, label: string, sublabel?: string}} props.option - Opção renderizada.
 * @param {boolean} props.selected - Se a opção está selecionada.
 * @param {boolean} props.multiple - Se o dropdown permite múltipla seleção.
 * @param {() => void} props.onToggle - Alterna a seleção do item.
 */
export function SensorSelectOption({ option, selected, multiple, onToggle }) {
  return (
    <label
      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
        multiple ? 'hover:bg-black/5' : ''
      } ${!multiple && selected ? 'bg-black/5' : ''}`}
    >
      {multiple ? (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="w-3.5 h-3.5 cursor-pointer accent-[#FF6D00]"
        />
      ) : (
        <span className="block w-[14px]">
          {selected && <i className="fas fa-check text-[11px] text-[#FF6D00]" />}
        </span>
      )}
      <span className="flex-1 min-w-0" onClick={() => !multiple && onToggle()}>
        <span className="block text-sm font-medium text-text-dark truncate">{option.label}</span>
        {option.sublabel && (
          <span className="block text-[11px] text-text-light truncate">{option.sublabel}</span>
        )}
      </span>
    </label>
  );
}
