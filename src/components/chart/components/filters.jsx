import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { SegmentedControl } from '@/components/segmented-control';
import { selectSensors } from '@/store/slices/sensorsSlice';

import { opcoesDistintas } from '../utils/selection';
import { SensorSelect } from './SensorSelect';
import { useTranslation } from '@/i18n';

const MODOS = [
  { value: 'sensores', labelKey: 'chart.modeSensors' },
  { value: 'municipio', labelKey: 'chart.modeMunicipality' },
  { value: 'estado', labelKey: 'chart.modeState' },
];

const CONFIG_SELECT = {
  sensores: {
    multiple: true,
    itemWord: 'sensor',
    icon: 'fa-microchip',
    placeholderKey: 'chart.placeholderSensors',
  },
  municipio: {
    icon: 'fa-map-marker-alt',
    placeholderKey: 'chart.placeholderMunicipality',
  },
  estado: {
    icon: 'fa-flag',
    placeholderKey: 'chart.placeholderState',
  },
};

/**
 * Filtros de escolha do gráfico: sensores (um ou vários), município ou estado.
 * As opções são derivadas da camada de sensores no redux. Componente controlado:
 * o estado de seleção vive no pai (AQIChart).
 *
 * @param {{ modo: string, sensores: string[], municipio: string, estado: string }} props.selecao - Seleção atual.
 * @param {(selecao: object) => void} props.onChange - Callback com a nova seleção.
 */
export function ChartFilters({ selecao, onChange }) {
  const sensors = useSelector(selectSensors);
  const { t } = useTranslation();

  const municipios = useMemo(() => opcoesDistintas(sensors, 'municipio'), [sensors]);
  const estados = useMemo(() => opcoesDistintas(sensors, 'estado'), [sensors]);

  const options = useMemo(
    () => ({
      sensores: sensors.map((s) => ({
        id: s.id,
        label: s.name,
        sublabel: [s.municipio, s.estado].filter(Boolean).join(' — '),
      })),
      municipio: municipios.map((m) => ({ id: m, label: m })),
      estado: estados.map((e) => ({ id: e, label: e })),
    }),
    [sensors, municipios, estados],
  );

  const { modo } = selecao;
  const config = CONFIG_SELECT[modo];

  return (
    <div className="ChartFiltersComponent flex items-center gap-3 flex-wrap max-md:flex-col max-md:items-stretch">
      <SegmentedControl
        options={MODOS.map((m) => ({ value: m.value, label: t(m.labelKey) }))}
        value={modo}
        onChange={(m) => onChange({ ...selecao, modo: m })}
      />

      <SensorSelect
        {...config}
        placeholder={t(config.placeholderKey)}
        options={options[modo]}
        value={selecao[modo]}
        onChange={(v) => onChange({ ...selecao, [modo]: v })}
      />
    </div>
  );
}