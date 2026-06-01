const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchSensores() {
  const res = await fetch(`${API_URL}/sensores`);
  if (!res.ok) throw new Error('Erro ao buscar sensores');
  return res.json();
}

export async function fetchDadosHistorico(sensorId, periodo) {
  const res = await fetch(`${API_URL}/sensores/${sensorId}/historico?periodo=${periodo}`);
  if (!res.ok) throw new Error('Erro ao buscar dados históricos');
  return res.json();
}
