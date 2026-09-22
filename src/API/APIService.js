import { baseBackEnd } from './baseBackend';

class APIService {
  /**
   * @param {Object}        [config]                Configuration object for APIService
   * @param {string}        [config.token='']       Authorization token (when implemented)
   *
   */
  constructor({ token = '' } = {}) {
    this.token = token;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /**
   * Builds Headers with optional Content-Type and optional Authorization.
   * @param {string} [contentType]
   * @returns {Headers}
   */
  _headers(contentType) {
    const headers = new Headers();
    if (this.token) headers.append('Authorization', this.token);
    if (contentType) headers.append('Content-Type', contentType);
    return headers;
  }

  /**
   * Lightweight fetch wrapper that parses JSON and swallows network errors.
   * @param {string}  url
   * @param {Object}  [options]
   * @returns {Promise<Object|undefined>}
   */
  async _fetchJson(url, options = {}) {
    return fetch(url, options)
      .then((r) => r.json())
      .catch((e) => console.error(e));
  }

  /**
   * Fetch que lança erro com `code` e `message` na falha (formato da API).
   * @param {string}  url
   * @param {Object}  [options]
   * @returns {Promise<Object>}
   */
  async _request(url, options = {}) {
    const res = await fetch(url, options);
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const erro = body?.error ?? {};
      throw new Error(`${erro.code ?? 'ERRO'}: ${erro.message ?? 'Falha na requisição'}`);
    }
    return body;
  }

  // ─── Sensor Methods ──────────────────────────────────────────────────────

  async fetchSensors() {
    return this._fetchJson(`${baseBackEnd}/v1/sensors`, {
      method: 'GET',
      headers: this._headers('application/json'),
    });
  }

  /**
   * Consulta leituras brutas de sensores em `GET /v1/sensor-readings`.
   *
   * O filtro deve ter exatamente uma chave de `sensorIds`, `municipio` ou
   * `estado`; `startDate`/`endDate` são opcionais (e devem vir juntos).
   *
   * @param {Object}                    params
   * @param {number[]}  [params.sensorIds] - Ids dos sensores.
   * @param {number}    [params.municipio] - Geocode IBGE do município.
   * @param {number}    [params.estado]    - Geocode IBGE do estado (UF).
   * @param {string}    [params.startDate] - Início do intervalo (ISO).
   * @param {string}    [params.endDate]   - Fim do intervalo (ISO).
   * @returns {Promise<Object>} Resposta `{ filter, period, count, readings }`.
   */
  async fetchSensorReadings(params) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value == null || value === '') return;
      if (Array.isArray(value)) {
        if (value.length) query.append(key, value.join(','));
        return;
      }
      query.append(key, String(value));
    });

    const url = `${baseBackEnd}/v1/sensor-readings?${query.toString()}`;
    return this._request(url, {
      method: 'GET',
      headers: this._headers('application/json'),
    });
  }
}

export { APIService };
