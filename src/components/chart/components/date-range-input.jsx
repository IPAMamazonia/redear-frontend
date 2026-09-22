import { useEffect, useMemo, useState } from 'react';

import { validarIntervaloManual } from '../utils/intervalo';

function formatoYYYYMMDD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DEFAULT_DE = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return formatoYYYYMMDD(d);
};

/**
 * Intervalo de datas manual (início e fim) com validação local:
 * datas futuras bloqueadas e intervalo máximo de 6 meses.
 *
 * @param {(intervalo: { startDate: string, endDate: string } | null) => void} props.onChange - Intervalo válido ou null enquanto inválido.
 * @param {() => void} props.onReset - Volta ao modo de períodos pré-definidos.
 */
export function DateRangeInput({ onChange, onReset }) {
  const hoje = useMemo(() => new Date(), []);

  const [de, setDe] = useState(DEFAULT_DE);
  const [ate, setAte] = useState(() => formatoYYYYMMDD(hoje));

  const erro = useMemo(() => {
    if (!de || !ate) return null;
    const r = validarIntervaloManual(de, ate);
    return r.ok ? null : r.mensagem;
  }, [de, ate]);

  useEffect(() => {
    if (!de || !ate) {
      onChange(null);
      return;
    }
    const r = validarIntervaloManual(de, ate);
    onChange(r.ok ? { startDate: r.startDate, endDate: r.endDate } : null);
  }, [de, ate, onChange]);

  const inputClass =
    'px-3 py-1.5 border border-black/10 rounded-[10px] text-sm text-text-dark bg-card backdrop-blur focus:outline-none focus:border-[#FF6D00] transition-colors';

  return (
    <div className="DateRangeInputComponent flex flex-wrap items-center gap-2 text-sm">
      <label className="text-text-light text-xs font-semibold">De</label>
      <input
        type="date"
        value={de}
        max={formatoYYYYMMDD(hoje)}
        onChange={(e) => setDe(e.target.value)}
        className={inputClass}
      />
      <label className="text-text-light text-xs font-semibold">Até</label>
      <input
        type="date"
        value={ate}
        max={formatoYYYYMMDD(hoje)}
        onChange={(e) => setAte(e.target.value)}
        className={inputClass}
      />
      <button
        type="button"
        onClick={onReset}
        title="Voltar aos períodos pré-definidos"
        className="cursor-pointer border-none bg-transparent text-sm font-semibold text-[#FF6D00] hover:underline"
      >
        <i className="fas fa-rotate-left mr-1" />
        Períodos
      </button>

      {erro && <p className="w-full text-xs text-red-600">{erro}</p>}
    </div>
  );
}