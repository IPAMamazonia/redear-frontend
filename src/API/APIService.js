import { baseBackEnd } from './baseBackend';
import { t } from '@/i18n/translate';

/**
 * Erro específico da exportação de leituras.
 *
 * O endpoint de exportação não responde no formato JSON de sucesso, então o
 * `_request` genérico não pode ser usado: os erros também chegam como JSON,
 * porém o sucesso é um stream CSV.
 */
class ExportApiError extends Error {
  constructor(code, message, status, details = null) {
    super(message);
    this.name = 'ExportApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** Extrai o filename de um header `Content-Disposition`. */
function parseExportFilename(disposition) {
  if (!disposition) return null;

  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1]);
    } catch {
      return utf8[1];
    }
  }

  const plain = /filename="?([^";]+)"?/i.exec(disposition);
  return plain?.[1] ?? null;
}

/**
 * Reconstrói o nome do arquivo a partir do `X-Export-Metadata`.
 *
 * Necessário em cross-origin, onde o navegador não expõe
 * `Content-Disposition` para o JavaScript.
 */
export function buildExportFilename(metadata) {
  const parts = ['readings', metadata.startDate, metadata.endDate];

  if (metadata.estadoId !== null && metadata.estadoId !== undefined) {
    parts.push(`estado-${metadata.estadoId}`);
  }
  if (metadata.municipioId !== null && metadata.municipioId !== undefined) {
    parts.push(`municipio-${metadata.municipioId}`);
  }
  if (metadata.redeArIds?.length > 0) {
    parts.push(`redear-${metadata.redeArIds.length}`);
  }
  if (metadata.purpleAirIds?.length > 0) {
    parts.push(`purpleair-${metadata.purpleAirIds.length}`);
  }

  return `${parts.join('_')}.csv`;
}

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
      const message = erro.message ?? t('errors.requestFailed');
      const prefix = erro.code ? `${erro.code}: ` : '';
      throw new Error(`${prefix}${message}`);
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

  /**
   * Exporta leituras de sensores em CSV via `POST /v1/sensor-readings/export`.
   *
   * Particularidades em relação aos outros métodos:
   * - o sucesso é um stream CSV, não JSON;
   * - o corpo é lido em chunks para permitir progresso e cancelamento;
   * - o header `X-Export-Metadata` é obrigatório;
   * - em cross-origin, `Content-Disposition` pode não estar exposto.
   *
   * @param {Object} filters - Body aceito pela rota de exportação.
   * @param {Object} [options]
   * @param {AbortSignal} [options.signal]
   * @param {(bytes: number) => void} [options.onProgress]
   * @returns {Promise<{
   *   blob: Blob,
   *   filename: string,
   *   metadata: Object,
   *   bytes: number,
   * }>}
   */
  async exportSensorReadings(filters, { signal, onProgress } = {}) {
    const res = await fetch(`${baseBackEnd}/v1/sensor-readings/export`, {
      method: 'POST',
      headers: this._headers('application/json'),
      body: JSON.stringify(filters),
      signal,
    });

    if (!res.ok) {
      let code = 'UNKNOWN';
      let message = `HTTP ${res.status}`;
      let details = null;

      try {
        const body = await res.json();
        code = body?.error?.code ?? code;
        message = body?.error?.message ?? message;
        details = body?.error?.details ?? null;
      } catch {
        // Resposta não-JSON (proxy, gateway, etc.): mantém a mensagem genérica.
      }

      throw new ExportApiError(code, message, res.status, details);
    }

    const metadataHeader = res.headers.get('X-Export-Metadata');
    if (!metadataHeader) {
      // Sem metadata não há como validar o arquivo; encerra o stream para não
      // deixar o backend gerando um CSV que será descartado.
      void res.body?.cancel().catch(() => {});
      throw new ExportApiError(
        'METADATA_MISSING',
        'Response is missing X-Export-Metadata; check CORS exposedHeaders.',
        res.status
      );
    }

    let metadata;
    try {
      metadata = JSON.parse(metadataHeader);
    } catch {
      void res.body?.cancel().catch(() => {});
      throw new ExportApiError('METADATA_MISSING', 'Invalid X-Export-Metadata header.', res.status);
    }

    const reader = res.body?.getReader();
    const chunks = [];
    let bytes = 0;

    if (reader) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            bytes += value.byteLength;
            onProgress?.(bytes);
          }
        }
      } catch (error) {
        if (error?.name === 'AbortError') throw error;

        throw new ExportApiError(
          'TRUNCATED',
          'The export stream was interrupted before completion.',
          res.status
        );
      }

      const blob = new Blob(chunks, { type: 'text/csv;charset=utf-8' });
      const filename =
        parseExportFilename(res.headers.get('Content-Disposition')) ?? buildExportFilename(metadata);

      return { blob, filename, metadata, bytes };
    }

    const blob = await res.blob();
    const filename =
      parseExportFilename(res.headers.get('Content-Disposition')) ?? buildExportFilename(metadata);

    return { blob, filename, metadata, bytes: blob.size };
  }
}

export { APIService, ExportApiError, parseExportFilename };
