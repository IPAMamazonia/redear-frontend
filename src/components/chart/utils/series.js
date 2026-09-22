/**
 * Monta as séries do gráfico a partir das leituras reais.
 * Uma linha por sensor, com os dados crus (sem agregação temporal);
 * o valor de cada ponto é `variable.extract(reading)`.
 *
 * @param {Array<object>} readings - Leituras normalizadas do redux (sensor_id, datetime, ...).
 * @param {Array<object>} sensors - Camada de sensores (id, name).
 * @param {object} variable - Variável selecionada (key, unit, extract).
 * @returns {{ datasets: Array<{ sensorId: string, name: string, data: Array<{ x: number, y: number }> }>, yMax: number }}
 */
export function montarSeries(readings, sensors, variable) {
  const porSensor = new Map();
  const nomePorId = new Map(sensors.map((s) => [String(s.id), s.name]));

  for (const r of readings) {
    if (r.datetime == null) continue;
    const chave = String(r.sensor_id);
    if (!porSensor.has(chave)) porSensor.set(chave, []);
    porSensor.get(chave).push(r);
  }

  const datasets = [];
  let yMax = 0;

  for (const [id, lista] of porSensor) {
    lista.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    const data = lista.map((r) => ({
      x: new Date(r.datetime).getTime(),
      y: variable.extract(r),
    }));

    for (const p of data) {
      if (p.y != null && p.y > yMax) yMax = p.y;
    }

    datasets.push({
      sensorId: id,
      name: nomePorId.get(id) ?? `Sensor ${id}`,
      data,
    });
  }

  datasets.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  yMax = Math.ceil(Math.max(yMax * 1.15, 50) / 25) * 25;

  return { datasets, yMax };
}