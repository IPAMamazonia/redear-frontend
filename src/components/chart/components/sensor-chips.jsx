/**
 * Chips dos sensores selecionados, com botão de remoção individual.
 *
 * @param {Array<{id: string, name: string}>} props.sensors - Sensores selecionados.
 * @param {(id: string) => void} props.onRemove - Callback chamado ao remover.
 */
export function SensorChips({ sensors, onRemove }) {
  if (!sensors.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 max-w-[1280px] mx-auto mb-6">
      {sensors.map((sensor) => (
        <span
          key={sensor.id}
          className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-[#FF6D00] bg-[#FF6D00]/10 rounded-full border border-[#FF6D00]/20"
        >
          {sensor.name}
          <button
            type="button"
            onClick={() => onRemove(sensor.id)}
            aria-label={`Remover ${sensor.name}`}
            className="cursor-pointer border-none bg-transparent text-[#FF6D00] hover:text-red-600"
          >
            <i className="fas fa-times" />
          </button>
        </span>
      ))}
    </div>
  );
}