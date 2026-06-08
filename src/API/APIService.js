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

  // ─── Sensor Methods ──────────────────────────────────────────────────────

  async fetchSensores() {
    return this._fetchJson(`${baseBackEnd}/sensores`, {
      method: 'GET',
      headers: this._headers('application/json'),
    });
  }

  async fetchHistoricData(sensorId, periodo) {
    return this._fetchJson(`${baseBackEnd}/sensores/${sensorId}/historico?periodo=${periodo}`, {
      method: 'GET',
      headers: this._headers('application/json'),
    });
  }
}

export { APIService };
