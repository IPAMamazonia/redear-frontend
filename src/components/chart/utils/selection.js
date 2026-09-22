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

export function montarLocalId(selecao) {
  const { modo, sensores, municipio, estado } = selecao;

  if (modo === MODO.MUNICIPIO && municipio) return `municipio:${municipio}`;
  if (modo === MODO.ESTADO && estado) return `estado:${estado}`;
  if (modo === MODO.SENSORES && sensores?.length === 1) return `sensor:${sensores[0]}`;
  if (modo === MODO.SENSORES && sensores?.length > 1) return `sensores:${sensores.length}`;

  return null;
}