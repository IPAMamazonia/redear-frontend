import { SensorSelect } from '@/components/sensor-select';
import { SegmentedControl } from '@/components/segmented-control';
import { useTranslation } from '@/i18n';

import { EXPORT_MODE, createInitialSelection } from '../utils/build-export-payload';

const MODES = [
  { value: EXPORT_MODE.SENSORS, labelKey: 'exportData.modeSensors' },
  { value: EXPORT_MODE.MUNICIPALITY, labelKey: 'exportData.modeMunicipality' },
  { value: EXPORT_MODE.STATE, labelKey: 'exportData.modeState' },
];

const INPUT_CLASS =
  'w-full px-3 py-2 border border-black/10 rounded-[10px] text-sm text-text-dark bg-card backdrop-blur focus:outline-none focus:border-laranja transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

/**
 * Formulário de filtros da exportação.
 *
 * @param {object} props
 * @param {object} props.selecao - Modo e seleção atual.
 * @param {(selecao: object) => void} props.onSelectionChange
 * @param {{ startDate: string, endDate: string }} props.range
 * @param {(range: { startDate: string, endDate: string }) => void} props.onRangeChange
 * @param {number} props.precision
 * @param {(precision: number) => void} props.onPrecisionChange
 * @param {Array<{id: number, label: string, sublabel?: string}>} props.sensorOptions
 * @param {Record<string, Array<{id: number, label: string, sublabel?: string}>>} props.locationOptions
 * @param {string} props.today
 * @param {boolean} props.disabled
 */
export function ExportFilters({
  selecao,
  onSelectionChange,
  range,
  onRangeChange,
  precision,
  onPrecisionChange,
  sensorOptions,
  locationOptions,
  today,
  disabled,
}) {
  const { t } = useTranslation();

  const modeConfig = {
    [EXPORT_MODE.SENSORS]: {
      multiple: true,
      icon: 'fa-microchip',
      placeholderKey: 'exportData.placeholderSensors',
      options: sensorOptions,
      value: selecao.sensores,
      onChange: (sensores) => onSelectionChange({ ...selecao, sensores }),
    },
    [EXPORT_MODE.MUNICIPALITY]: {
      icon: 'fa-map-marker-alt',
      placeholderKey: 'exportData.placeholderMunicipality',
      options: locationOptions.municipio,
      value: selecao.municipioId,
      onChange: (municipioId) => onSelectionChange({ ...selecao, municipioId }),
    },
    [EXPORT_MODE.STATE]: {
      icon: 'fa-flag',
      placeholderKey: 'exportData.placeholderState',
      options: locationOptions.estado,
      value: selecao.estadoId,
      onChange: (estadoId) => onSelectionChange({ ...selecao, estadoId }),
    },
  };

  const config = modeConfig[selecao.modo] ?? modeConfig[EXPORT_MODE.SENSORS];

  const handleModeChange = (modo) => {
    // Trocar de abrangência descarta a seleção anterior para não misturar
    // sensores/localidades de modos diferentes no próximo export.
    if (modo === selecao.modo) return;
    onSelectionChange(createInitialSelection(modo));
  };

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-light uppercase tracking-wide">
          {t('exportData.period')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs font-semibold text-text-light">
            {t('exportData.from')}
            <input
              type="date"
              value={range.startDate}
              max={today}
              disabled={disabled}
              onChange={(event) => onRangeChange({ ...range, startDate: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-text-light">
            {t('exportData.to')}
            <input
              type="date"
              value={range.endDate}
              max={today}
              disabled={disabled}
              onChange={(event) => onRangeChange({ ...range, endDate: event.target.value })}
              className={INPUT_CLASS}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-light uppercase tracking-wide">
          {t('exportData.mode')}
        </span>
        <SegmentedControl
          options={MODES.map((mode) => ({ value: mode.value, label: t(mode.labelKey) }))}
          value={selecao.modo}
          onChange={handleModeChange}
          className={disabled ? 'pointer-events-none opacity-60' : ''}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-text-light uppercase tracking-wide">
          {t('exportData.selection')}
        </span>
        <SensorSelect
          key={selecao.modo}
          {...config}
          placeholder={t(config.placeholderKey)}
          disabled={disabled}
          itemWord="sensor"
          selectedSingularKey="exportData.selectedSingular"
          selectedPluralKey="exportData.selectedPlural"
        />
        {selecao.modo !== EXPORT_MODE.SENSORS && (
          <p className="text-xs text-text-light">{t('exportData.locationHint')}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="export-precision"
          className="text-xs font-semibold text-text-light uppercase tracking-wide"
        >
          {t('exportData.precision')}
        </label>
        <select
          id="export-precision"
          value={precision}
          disabled={disabled}
          onChange={(event) => onPrecisionChange(Number(event.target.value))}
          className={INPUT_CLASS}
        >
          {Array.from({ length: 11 }, (_, value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <p className="text-xs text-text-light">{t('exportData.precisionHint')}</p>
      </div>
    </div>
  );
}
