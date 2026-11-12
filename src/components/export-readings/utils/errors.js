import { ExportApiError } from '@/API/APIService';

const ERROR_KEYS = {
  BODY_REQUIRED: 'exportData.errors.BODY_REQUIRED',
  INVALID_JSON: 'exportData.errors.INVALID_JSON',
  SENSOR_REQUIRED: 'exportData.errors.SENSOR_REQUIRED',
  INVALID_DATE: 'exportData.errors.INVALID_DATE',
  INVALID_DATE_RANGE: 'exportData.errors.INVALID_DATE_RANGE',
  INVALID_REDEAR_IDS: 'exportData.errors.INVALID_REDEAR_IDS',
  INVALID_PURPLEAIR_IDS: 'exportData.errors.INVALID_PURPLEAIR_IDS',
  INVALID_ESTADO_ID: 'exportData.errors.INVALID_ESTADO_ID',
  INVALID_MUNICIPIO_ID: 'exportData.errors.INVALID_MUNICIPIO_ID',
  INVALID_PRECISION: 'exportData.errors.INVALID_PRECISION',
  INTERNAL_ERROR: 'exportData.errors.INTERNAL_ERROR',
  NETWORK: 'exportData.errors.NETWORK',
  TRUNCATED: 'exportData.errors.TRUNCATED',
  METADATA_MISSING: 'exportData.errors.METADATA_MISSING',
  METADATA_MISMATCH: 'exportData.errors.METADATA_MISMATCH',
  CANCELLED: 'exportData.errors.CANCELLED',
  UNKNOWN: 'exportData.errors.UNKNOWN',
};

/** Converte erros de fetch/API em um objeto consumível pela UI. */
export function toExportError(error) {
  if (error?.name === 'AbortError') {
    return { code: 'CANCELLED', messageKey: ERROR_KEYS.CANCELLED };
  }

  if (error instanceof ExportApiError) {
    return {
      code: error.code,
      messageKey: ERROR_KEYS[error.code] ?? ERROR_KEYS.UNKNOWN,
      status: error.status,
      details: error.details,
    };
  }

  if (error instanceof TypeError) {
    return { code: 'NETWORK', messageKey: ERROR_KEYS.NETWORK };
  }

  return {
    code: 'UNKNOWN',
    messageKey: ERROR_KEYS.UNKNOWN,
    details: error?.message ?? null,
  };
}
