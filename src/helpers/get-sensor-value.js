/**
 * Extrai o valor exibível de um sensor para uma determinada variável.
 *
 * Usa a leitura mais recente do sensor (primeiro item de `readings`) e delega
 * para o `extract` da variável. Se não houver leituras, retorna `null`.
 *
 * @param {{readings?: Array<object>}} sensor - Objeto do sensor.
 * @param {{extract: (reading: object) => number|null}} variable - Variável que
 *   define como extrair o valor.
 * @returns {number|null} O valor extraído, ou `null` se não houver leitura.
 */
export function getSensorValue(sensor, variable) {
  const reading = sensor.readings?.[0];
  if (!reading) return null;
  return variable.extract(reading);
}
