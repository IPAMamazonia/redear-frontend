/**
 * Converte o período pré-definido em intervalo de datas (ISO UTC).
 *
 * @param {string} periodo - '1D' | '7D' | '14D' | '1M' | '2M' | '3M' | '6M'.
 * @returns {{ startDate: string, endDate: string }}
 */
export function periodoParaIntervalo(periodo) {
  const fim = new Date();
  const inicio = new Date(fim);

  switch (periodo) {
    case '1D':
      inicio.setDate(fim.getDate() - 1);
      break;
    case '7D':
      inicio.setDate(fim.getDate() - 7);
      break;
    case '14D':
      inicio.setDate(fim.getDate() - 14);
      break;
    case '2M':
      inicio.setMonth(fim.getMonth() - 2);
      break;
    case '3M':
      inicio.setMonth(fim.getMonth() - 3);
      break;
    case '6M':
      inicio.setMonth(fim.getMonth() - 6);
      break;
    case '1M':
    default:
      inicio.setMonth(fim.getMonth() - 1);
  }

  return {
    startDate: inicio.toISOString(),
    endDate: fim.toISOString(),
  };
}

/**
 * Soma meses preservando o dia do mês quando possível (evita overflow).
 *
 * @param {Date} data
 * @param {number} meses
 * @returns {Date}
 */
export function adicionarMeses(data, meses) {
  const d = new Date(data);
  const dia = d.getDate();

  d.setDate(1);
  d.setMonth(d.getMonth() + meses);

  const ultimoDia = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(dia, ultimoDia));

  return d;
}

function parseDataLocal(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

/**
 * Valida um intervalo manual de datas (formato 'YYYY-MM-DD').
 * Regras: datas passadas, fim >= início e intervalo máximo de 6 meses.
 *
 * @param {string} de - Data inicial.
 * @param {string} ate - Data final.
 * @returns {{ ok: false, mensagem: string } | { ok: true, startDate: string, endDate: string }}
 */
export function validarIntervaloManual(de, ate) {
  if (!de || !ate) return { ok: false, mensagem: 'Informe as datas inicial e final.' };

  const inicio = parseDataLocal(de);
  const fim = parseDataLocal(ate);
  const hoje = new Date();
  hoje.setHours(23, 59, 59, 999);

  if (inicio > hoje || fim > hoje) {
    return { ok: false, mensagem: 'As datas não podem ser futuras.' };
  }
  if (fim < inicio) {
    return { ok: false, mensagem: 'A data final deve ser posterior à inicial.' };
  }
  if (adicionarMeses(inicio, 6) < fim) {
    return { ok: false, mensagem: 'O intervalo máximo permitido é de 6 meses.' };
  }

  return {
    ok: true,
    startDate: `${de}T00:00:00.000Z`,
    endDate: `${ate}T23:59:59.999Z`,
  };
}