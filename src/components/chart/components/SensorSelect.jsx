import { useMemo, useRef, useState } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';
import { useTranslation } from '@/i18n';
import {
  alternarSelecao,
  alternarVisiveisSelecionados,
  filtrarOpcoes,
  tituloSelecao,
  todosVisiveisSelecionados,
} from '../utils/sensor-select';
import { SensorSelectPanel } from './sensor-select-panel';

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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [busca, setBusca] = useState('');
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false), open);

  const filtrados = useMemo(() => filtrarOpcoes(options, busca), [options, busca]);

  const quantidade = multiple ? value.length : 0;
  const opcaoAtiva = multiple ? null : options.find((option) => option.id === value);
  const temValor = multiple ? quantidade > 0 : Boolean(opcaoAtiva);

  const tituloBotao = () =>
    tituloSelecao({ multiple, quantidade, opcaoAtiva, placeholder, itemWord, t });

  const toggle = (id) => {
    if (multiple) {
      onChange(alternarSelecao(value, id));
    } else {
      onChange(id);
      setOpen(false);
    }
  };

  const todosVisiveis = multiple && todosVisiveisSelecionados(filtrados, value);

  const alternarVisiveis = () => {
    if (!multiple || !filtrados.length) return;
    onChange(alternarVisiveisSelecionados(value, filtrados, todosVisiveis));
  };

  return (
    <div className="SensorSelectComponent relative min-w-[220px] max-md:w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
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
        <SensorSelectPanel
          options={options}
          filtered={filtrados}
          multiple={multiple}
          value={value}
          search={busca}
          onSearchChange={setBusca}
          onToggle={toggle}
          onToggleVisible={alternarVisiveis}
          onClear={() => onChange([])}
          allVisible={todosVisiveis}
        />
      )}
    </div>
  );
}
