import { getLocale } from '@/i18n/translate';

import { validateDateRange } from './date-range';

export const EXPORT_MODE = {
  SENSORS: 'sensores',
  MUNICIPALITY: 'municipio',
  STATE: 'estado',
};

const REDEAR_SOURCE = 'RedeAr';
const PURPLEAIR_SOURCE = 'purpleAir';

/**
 * Seleção inicial do formulário de exportação.
 *
 * @param {string} [modo] - Abrangência inicial (padrão: sensores).
 */
export function createInitialSelection(modo = EXPORT_MODE.SENSORS) {
  return {
    modo,
    sensores: [],
    municipioId: null,
    estadoId: null,
  };
}

/** Indica se há uma seleção válida para o modo atual. */
export function hasExportSelection(selecao) {
  if (selecao.modo === EXPORT_MODE.SENSORS) return (selecao.sensores || []).length > 0;
  if (selecao.modo === EXPORT_MODE.MUNICIPALITY) return selecao.municipioId != null;
  return selecao.estadoId != null;
}

/** Opções do dropdown de sensores, com município/UF como sublabel. */
export function buildSensorOptions(sensors) {
  return sensors
    .map((sensor) => ({
      id: sensor.id,
      label: sensor.name || `#${sensor.id}`,
      sublabel: [sensor.municipio, sensor.estado].filter(Boolean).join(' — '),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, getLocale()));
}

/**
 * Opções de município/UF usando o geocode IBGE como id.
 *
 * Diferente de usar o nome, o geocode evita ambiguidade entre municípios
 * homônimos em estados diferentes.
 */
export function buildLocationOptions(sensors, mode) {
  const isMunicipality = mode === EXPORT_MODE.MUNICIPALITY;
  const geocodeField = isMunicipality ? 'geocode_mun' : 'geocode_uf';
  const labelField = isMunicipality ? 'municipio' : 'estado';
  const options = new Map();

  sensors.forEach((sensor) => {
    const id = Number(sensor[geocodeField]);
    const label = sensor[labelField];

    if (!Number.isInteger(id) || id <= 0 || !label || options.has(id)) return;

    options.set(id, {
      id,
      label,
      sublabel: isMunicipality ? sensor.estado : undefined,
    });
  });

  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, getLocale()));
}

/** Resolve os sensores efetivamente selecionados pelo modo atual. */
export function resolveSelectedSensors(sensors, selecao) {
  if (selecao.modo === EXPORT_MODE.SENSORS) {
    const ids = new Set((selecao.sensores || []).map(Number));
    return sensors.filter((sensor) => ids.has(Number(sensor.id)));
  }

  const isMunicipality = selecao.modo === EXPORT_MODE.MUNICIPALITY;
  const geocode = isMunicipality ? selecao.municipioId : selecao.estadoId;

  if (geocode == null) return [];

  const geocodeField = isMunicipality ? 'geocode_mun' : 'geocode_uf';
  return sensors.filter((sensor) => Number(sensor[geocodeField]) === Number(geocode));
}

/**
 * Monta o body da exportação.
 *
 * Em modos de localidade, o body leva apenas `municipioId` ou `estadoId`: os
 * sensores são resolvidos pelo backend a partir do geocode. A lista local é
 * usada somente para montar as opções e o resumo da UI.
 *
 * No modo por sensores, arrays vazios nunca entram no body — `[]` significa
 * "não exportar esta fonte" e faria o backend responder `SENSOR_REQUIRED`.
 */
export function buildExportPayload({ sensors, selecao, startDate, endDate, precision }) {
  const selected = resolveSelectedSensors(sensors, selecao);
  const payload = {
    startDate,
    endDate,
    precision: Number(precision),
  };

  if (selecao.modo === EXPORT_MODE.MUNICIPALITY) {
    if (selecao.municipioId != null) payload.municipioId = Number(selecao.municipioId);
    return { payload, selected, redeArIds: [], purpleAirIds: [], unsupportedSources: [] };
  }

  if (selecao.modo === EXPORT_MODE.STATE) {
    if (selecao.estadoId != null) payload.estadoId = Number(selecao.estadoId);
    return { payload, selected, redeArIds: [], purpleAirIds: [], unsupportedSources: [] };
  }

  const unsupportedSources = selected.filter(
    (sensor) => sensor.source !== REDEAR_SOURCE && sensor.source !== PURPLEAIR_SOURCE
  );

  const redeArIds = [
    ...new Set(
      selected
        .filter((sensor) => sensor.source === REDEAR_SOURCE)
        .map((sensor) => Number(sensor.id))
        .filter((id) => Number.isInteger(id) && id > 0)
    ),
  ];

  const purpleAirIds = [
    ...new Set(
      selected
        .filter((sensor) => sensor.source === PURPLEAIR_SOURCE)
        .map((sensor) => Number(sensor.id))
        .filter((id) => Number.isInteger(id) && id > 0)
    ),
  ];

  if (redeArIds.length > 0) payload.redeArIds = redeArIds;
  if (purpleAirIds.length > 0) payload.purpleAirIds = purpleAirIds;

  return { payload, selected, redeArIds, purpleAirIds, unsupportedSources };
}

/**
 * Valida o formulário e devolve o payload já montado.
 * As mensagens são chaves i18n para o componente traduzir.
 */
export function prepareExportRequest({ sensors, selecao, startDate, endDate, precision, today }) {
  const errors = validateDateRange(startDate, endDate, today);

  if (!Number.isInteger(precision) || precision < 0 || precision > 10) {
    errors.push('exportData.validation.precision');
  }

  const built = buildExportPayload({ sensors, selecao, startDate, endDate, precision });

  if (selecao.modo === EXPORT_MODE.SENSORS) {
    if (built.unsupportedSources.length > 0) {
      errors.push('exportData.validation.unsupportedSource');
    }
    if (built.selected.length === 0) {
      errors.push('exportData.validation.sensorRequired');
    }
  } else {
    const locationId =
      selecao.modo === EXPORT_MODE.MUNICIPALITY ? selecao.municipioId : selecao.estadoId;

    if (locationId == null) {
      errors.push('exportData.validation.locationRequired');
    }
  }

  return { errors, ...built };
}
