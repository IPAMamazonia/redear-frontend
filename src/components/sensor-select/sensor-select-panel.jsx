import { useTranslation } from '@/i18n';
import { SensorSelectOption } from './sensor-select-option';

/**
 * Painel aberto do dropdown de seleção compartilhado, com busca e ações.
 *
 * O `role="listbox"` fica apenas no container das opções; a busca e as ações
 * usam HTML nativo. Setas/Home/End movem o foco entre as opções.
 *
 * @param {object} props
 * @param {string} props.id - Id do container com `role="listbox"`.
 * @param {string} props.searchId - Id do input de busca (associado ao label).
 * @param {Array<{id: string, label: string, sublabel?: string}>} props.options - Todas as opções.
 * @param {Array<{id: string, label: string, sublabel?: string}>} props.filtered - Opções após a busca.
 * @param {boolean} props.multiple - Se o dropdown permite múltipla seleção.
 * @param {string[]|string} props.value - Ids selecionados (multi) ou id único.
 * @param {string} props.search - Termo de busca atual.
 * @param {(value: string) => void} props.onSearchChange - Atualiza o termo de busca.
 * @param {(id: string) => void} props.onToggle - Alterna um item.
 * @param {() => void} props.onToggleVisible - Marca/desmarca as opções visíveis.
 * @param {() => void} props.onClear - Limpa toda a seleção.
 * @param {boolean} props.allVisible - Se todas as opções visíveis já estão marcadas.
 */
export function SensorSelectPanel({
  id,
  searchId,
  options,
  filtered,
  multiple,
  value,
  search,
  onSearchChange,
  onToggle,
  onToggleVisible,
  onClear,
  allVisible,
}) {
  const { t } = useTranslation();
  const quantidade = multiple ? value.length : 0;

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;

    const optionElements = Array.from(event.currentTarget.querySelectorAll('[role="option"]'));
    if (!optionElements.length) return;

    event.preventDefault();

    const currentIndex = optionElements.indexOf(document.activeElement);
    let nextIndex;

    if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = optionElements.length - 1;
    } else if (currentIndex === -1) {
      nextIndex = key === 'ArrowDown' ? 0 : optionElements.length - 1;
    } else {
      const step = key === 'ArrowDown' ? 1 : -1;
      nextIndex = (currentIndex + step + optionElements.length) % optionElements.length;
    }

    optionElements[nextIndex].focus();
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="absolute left-0 top-full z-30 mt-1 w-[340px] max-w-[calc(100vw-2rem)] bg-card backdrop-blur-xl border border-white/35 rounded-lg shadow-glass py-2"
    >
      <div className="px-3 pb-2 border-b border-black/5">
        <label htmlFor={searchId} className="sr-only">
          {t('chart.search')}
        </label>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/60 border border-black/10 focus-within:border-laranja">
          <i className="fas fa-search text-[11px] text-text-light" aria-hidden="true" />
          <input
            id={searchId}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t('chart.search')}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-light"
          />
        </div>
        {multiple && filtered.length > 0 && (
          <div className="flex justify-between mt-2 text-xs">
            <button
              type="button"
              onClick={onToggleVisible}
              className="cursor-pointer text-laranja font-semibold bg-transparent border-none hover:underline"
            >
              {allVisible ? t('chart.unmarkVisible') : t('chart.markVisible')}
            </button>
            {quantidade > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="cursor-pointer text-text-light bg-transparent border-none hover:text-red-600"
              >
                {t('chart.clearCount', { count: quantidade })}
              </button>
            )}
          </div>
        )}
      </div>

      <div
        id={id}
        role="listbox"
        aria-label={t('chart.options')}
        aria-multiselectable={multiple ? true : undefined}
        className="max-h-[240px] overflow-y-auto mt-1"
      >
        {filtered.length === 0 ? (
          <p className="px-3 py-3 text-xs text-text-light" role="status">
            {options.length === 0 ? t('chart.noOptions') : t('chart.noResults', { search })}
          </p>
        ) : (
          filtered.map((option) => (
            <SensorSelectOption
              key={option.id}
              option={option}
              selected={multiple ? value.includes(option.id) : option.id === value}
              multiple={multiple}
              onToggle={() => onToggle(option.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
