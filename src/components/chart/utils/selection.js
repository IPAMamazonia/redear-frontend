export const MODO = {
  SENSORES: 'sensores',
  MUNICIPIO: 'municipio',
  ESTADO: 'estado',
};

export const SELECAO_INICIAL = () => ({
  modo: MODO.SENSORES,
  sensores: [],
  municipio: '',
  estado: '',
});

export function opcoesDistintas(sensors, campo) {
  const set = new Set(sensors.map((s) => s[campo]).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function resolverIds(sensors, selecao) {
  const { modo, sensores, municipio, estado } = selecao;

  if (modo === MODO.SENSORES) return sensores;
  if (modo === MODO.MUNICIPIO && municipio) {
    return sensors.filter((s) => s.municipio === municipio).map((s) => s.id);
  }
  if (modo === MODO.ESTADO && estado) {
    return sensors.filter((s) => s.estado === estado).map((s) => s.id);
  }

  return [];
}

function obterGeocode(sensor, campo) {
  const geocode = sensor?.[campo];
  const numero = Number(geocode);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

/**
 * Monta o filtro da API de leituras a partir da seleção.
 * A API aceita exatamente um dos filtros: sensorIds, municipio ou estado.
 *
 * @param {Array<object>} sensors - Camada de sensores.
 * @param {object} selecao - Seleção do gráfico (sensores/municipio/estado).
 * @returns {{ sensorIds: number[] } | { municipio: number } | { estado: number } | null}
 */
export function montarFiltro(sensors, selecao) {
  const { modo, sensores, municipio, estado } = selecao;

  if (modo === MODO.SENSORES) {
    const sensorIds = (sensores || [])
      .map(Number)
      .filter((id) => Number.isFinite(id) && id > 0);

    return sensorIds.length ? { sensorIds } : null;
  }

  if (modo === MODO.MUNICIPIO && municipio) {
    const codigo = obterGeocode(sensors.find((s) => s.municipio === municipio), 'geocode_mun');
    return codigo ? { municipio: codigo } : null;
  }

  if (modo === MODO.ESTADO && estado) {
    const alvo = sensors.find((s) => s.estado === estado);
    const codigo = obterGeocode(alvo, 'geocode_uf');
    return codigo ? { estado: codigo } : null;
  }

  return null;
}

export function montarLocalId(selecao) {
  const { modo, sensores, municipio, estado } = selecao;

  if (modo === MODO.MUNICIPIO && municipio) return `municipio:${municipio}`;
  if (modo === MODO.ESTADO && estado) return `estado:${estado}`;
  if (modo === MODO.SENSORES && sensores?.length === 1) return `sensor:${sensores[0]}`;
  if (modo === MODO.SENSORES && sensores?.length > 1) return `sensores:${sensores.length}`;

  return null;
}