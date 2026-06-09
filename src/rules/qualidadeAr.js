export const FAIXAS_PM25 = [
  { max: 15, cor: '#00E400', label: 'DQA – OMS', texto: '#000000' },
  { max: 25, cor: '#00A4FF', label: 'Bom', texto: '#000000' },
  { max: 50, cor: '#FFFF00', label: 'Moderada', texto: '#000000' },
  { max: 75, cor: '#FF7E00', label: 'Ruim', texto: '#000000' },
  { max: 125, cor: '#FF0000', label: 'Muito Ruim', texto: '#FFFFFF' },
  { max: Infinity, cor: '#8B0000', label: 'Péssima', texto: '#FFFFFF' },
];

export function getPM25Color(pm25) {
  if (pm25 == null || pm25 < 0) return { cor: '#9e9e9e', texto: '#ffffff', label: 'Sem dados' };
  for (const f of FAIXAS_PM25) if (pm25 <= f.max) return f;
  return FAIXAS_PM25[FAIXAS_PM25.length - 1];
}

export function getLabelPM25(pm25) {
  if (pm25 == null || pm25 < 0) return 'Sem dados';
  for (const f of FAIXAS_PM25) if (pm25 <= f.max) return f.label;
  return FAIXAS_PM25[FAIXAS_PM25.length - 1].label;
}
