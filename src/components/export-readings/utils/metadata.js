import { ExportApiError } from '@/API/APIService';

function sameIdSet(sent = [], received = []) {
  if (!Array.isArray(sent) || !Array.isArray(received)) return false;
  if (sent.length !== received.length) return false;

  const sentSet = new Set(sent.map(Number));
  return received.every((id) => sentSet.has(Number(id)));
}

function nullableNumber(value) {
  return value == null ? null : Number(value);
}

/**
 * Compara o body enviado com o `X-Export-Metadata` retornado pelo backend.
 *
 * O backend ignora chaves desconhecidas silenciosamente. Se o metadata não
 * corresponder ao enviado, o arquivo pode estar sem o filtro esperado e não
 * deve ser entregue ao usuário.
 */
export function assertMetadataMatches(sent, received) {
  const problems = [];

  if (!received || typeof received !== 'object') {
    throw new ExportApiError('METADATA_MISMATCH', 'Missing or invalid export metadata.', 200);
  }

  if (String(sent.startDate) !== String(received.startDate)) problems.push('startDate');
  if (String(sent.endDate) !== String(received.endDate)) problems.push('endDate');
  if (Number(sent.precision) !== Number(received.precision)) problems.push('precision');

  if (!sameIdSet(sent.redeArIds ?? [], received.redeArIds ?? [])) problems.push('redeArIds');
  if (!sameIdSet(sent.purpleAirIds ?? [], received.purpleAirIds ?? [])) problems.push('purpleAirIds');

  if (nullableNumber(sent.estadoId) !== nullableNumber(received.estadoId)) problems.push('estadoId');
  if (nullableNumber(sent.municipioId) !== nullableNumber(received.municipioId)) {
    problems.push('municipioId');
  }

  if (problems.length > 0) {
    throw new ExportApiError('METADATA_MISMATCH', 'Export metadata does not match request.', 200, {
      fields: problems,
      sent,
      received,
    });
  }
}
