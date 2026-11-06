const STATS_FIXAS = [
  { id: 'readings-daily', number: '10 mil+', labelKey: 'about.stats.readingsDaily' },
  { id: 'monitoring-continuous', number: '24h/7', labelKey: 'about.stats.monitoringContinuous' },
];

/**
 * Calcula os cards de estatísticas da seção "Sobre".
 *
 * @param {Array<object>|undefined} sensors - Sensores carregados no redux.
 * @returns {Array<{id: string, number: string, labelKey: string}>} Cards prontos para render.
 */
export function buildStats(sensors) {
  const lista = Array.isArray(sensors) ? sensors : [];
  const estados = new Set(lista.map((sensor) => sensor.estado).filter(Boolean));

  return [
    { id: 'sensors-total', number: String(lista.length), labelKey: 'about.stats.sensorsTotal' },
    { id: 'states-monitored', number: String(estados.size), labelKey: 'about.stats.statesMonitored' },
    {
      id: 'sensors-redear',
      number: String(lista.filter((sensor) => sensor.source === 'RedeAr').length),
      labelKey: 'about.stats.sensorsRedear',
    },
    {
      id: 'sensors-purpleair',
      number: String(lista.filter((sensor) => sensor.source === 'purpleAir').length),
      labelKey: 'about.stats.sensorsPurpleair',
    },
    ...STATS_FIXAS,
  ];
}
