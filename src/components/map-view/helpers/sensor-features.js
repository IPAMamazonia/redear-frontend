import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { getSensorValue } from '@/helpers/get-sensor-value.js';
import { OFFLINE } from '@/rules/faixas';

/**
 * Converte a lista de sensores em features do OpenLayers.
 *
 * Sensores sem coordenadas válidas são ignorados. A cor de cada feature é
 * derivada da variável selecionada ou do estado offline.
 *
 * @param {MapSensor[]} sensors - Sensores normalizados.
 * @param {MapVariable} variable - Variável selecionada.
 * @returns {import('ol/Feature').default[]} Features prontas para o `VectorSource`.
 */
export function createSensorFeatures(sensors, variable) {
  return sensors
    .filter((sensor) => sensor.gps?.coordinates?.[0] != null && sensor.gps?.coordinates?.[1] != null)
    .map((sensor) => {
      const value = getSensorValue(sensor, variable);
      const online = sensor.is_online ?? false;
      const range = online ? variable.getColor(value) : OFFLINE;

      return new Feature({
        geometry: new Point(fromLonLat([sensor.gps.coordinates[0], sensor.gps.coordinates[1]])),
        sensor_id: sensor.id,
        source: sensor.source,
        nome: sensor.name,
        isOnline: online,
        isTrustworthy: sensor.is_trustworthy,
        value,
        latestReading: sensor.latest_reading,
        oldestReading: sensor.oldest_reading,
        color: range.color,
        textColor: range.textColor,
        label: range.label,
      });
    });
}
