import { useEffect, useMemo, useRef, useState } from 'react';

function pluralDe(palavra, quantidade) {
  if (palavra === 'sensor') return quantidade === 1 ? 'sensor' : 'sensores';
  return quantidade === 1 ? palavra : `${palavra}s`;
}

/**
 * Dropdown estilizado dos filtros do gráfico. Suporta multi- ou single-select.
 * Formato visual sempre o mesmo (botão + painel com busca), conforme usados
 * em sensores, municípios e estados.
 *
 * @param {Array<{id: string, label: string, sublabel?: string}>} props.options   - Opções.
 * @param {string[] | string} props.value - Lista de ids (multi) ou id único (single).
 * @param {(value: string[] | string) => void} props.onChange - Callback com a nova seleção.
 * @param {string} props.placeholder - Texto quando nada selecionado.
 * @param {string} [props.icon]      - Ícone (Font Awesome) exibido no botão.
 * @param {boolean} [props.multiple] - Se true, permite multi-seleção com checkboxes.
 * @param {string} [props.itemWord]  - Substantivo usado no resumo do multi-select.
 */
export function SensorSelect({
  options,
  value,
  onChange,
  placeholder,
  icon = 'fa-microchip',
  multiple = false,
  itemWord = 'sensor',
}) {
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return options;
    return options.filter((o) => {
      const rotulo = (o.label || '').toLowerCase();
      const sub = (o.sublabel || '').toLowerCase();
      return rotulo.includes(termo) || sub.includes(termo);
    });
  }, [options, busca]);

  const quantidade = multiple ? value.length : 0;
  const opcaoAtiva = multiple ? null : options.find((o) => o.id === value);
  const temValor = multiple ? quantidade > 0 : Boolean(opcaoAtiva);

  const tituloBotao = () => {
    if (multiple) {
      if (!quantidade) return placeholder;
      return `${quantidade} ${pluralDe(itemWord, quantidade)} selecionado${
        quantidade === 1 ? '' : 's'
      }`;
    }
    return opcaoAtiva ? opcaoAtiva.label : placeholder;
  };

  const toggle = (id) => {
    if (multiple) {
      const atual = value;
      const novo = atual.includes(id)
        ? atual.filter((x) => x !== id)
        : [...atual, id];
      onChange(novo);
    } else {
      onChange(id);
      setOpen(false);
    }
  };

  const todosVisiveis =
    multiple && filtrados.length > 0 && filtrados.every((o) => value.includes(o.id));

  const alternarVisiveis = () => {
    if (!filtrados.length || !multiple) return;
    const ids = new Set(value);
    const visiveis = new Set(filtrados.map((o) => o.id));
    if (todosVisiveis) visiveis.forEach((id) => ids.delete(id));
    else visiveis.forEach((id) => ids.add(id));
    onChange([...ids]);
  };

  return (
    <div
      className="SensorSelectComponent relative min-w-[220px] max-md:w-full"
      ref={ref}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border border-black/10 rounded-[10px] text-sm bg-card backdrop-blur cursor-pointer focus:outline-none focus:border-[#FF6D00] transition-colors duration-[0.35s] ${
          temValor ? 'text-text-dark' : 'text-text-light'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <i className={`fas ${icon} text-[12px] text-verde-escuro`} />
          <span className="truncate">{tituloBotao()}</span>
        </span>
        <i
          className={`fas fa-chevron-down text-[10px] text-text-light transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable={multiple}
          className="absolute left-0 top-full z-30 mt-1 w-[340px] max-w-[calc(100vw-2rem)] bg-card backdrop-blur-xl border border-white/35 rounded-lg shadow-glass py-2"
        >
          <div className="px-3 pb-2 border-b border-black/5">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/60 border border-black/10 focus-within:border-[#FF6D00]">
              <i className="fas fa-search text-[11px] text-text-light" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-text-light"
              />
            </div>
            {multiple && filtrados.length > 0 && (
              <div className="flex justify-between mt-2 text-xs">
                <button
                  type="button"
                  onClick={alternarVisiveis}
                  className="cursor-pointer text-[#FF6D00] font-semibold bg-transparent border-none hover:underline"
                >
                  {todosVisiveis ? 'Desmarcar visíveis' : 'Marcar visíveis'}
                </button>
                {quantidade > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="cursor-pointer text-text-light bg-transparent border-none hover:text-red-600"
                  >
                    Limpar ({quantidade})
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="max-h-[240px] overflow-y-auto mt-1" role="group">
            {filtrados.length === 0 ? (
              <p className="px-3 py-3 text-xs text-text-light">
                {options.length === 0
                  ? 'Nenhuma opção disponível.'
                  : `Nenhum resultado para "${busca}".`}
              </p>
            ) : (
              filtrados.map((o) => (
                <label
                  key={o.id}
                  className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
                    multiple ? 'hover:bg-black/5' : ''
                  } ${!multiple && o.id === value ? 'bg-black/5' : ''}`}
                >
                  {multiple ? (
                    <input
                      type="checkbox"
                      checked={value.includes(o.id)}
                      onChange={() => toggle(o.id)}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF6D00]"
                    />
                  ) : (
                    <span className="block w-[14px]">
                      {o.id === value && (
                        <i className="fas fa-check text-[11px] text-[#FF6D00]" />
                      )}
                    </span>
                  )}
                  <span
                    className="flex-1 min-w-0"
                    onClick={() => !multiple && toggle(o.id)}
                  >
                    <span className="block text-sm font-medium text-text-dark truncate">
                      {o.label}
                    </span>
                    {o.sublabel && (
                      <span className="block text-[11px] text-text-light truncate">
                        {o.sublabel}
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}