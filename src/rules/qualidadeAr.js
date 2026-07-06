export const FAIXAS_PM25 = [
  { max: 15, color: '#00E400', label: 'DQA – OMS', textColor: '#000000' },
  { max: 25, color: '#00A4FF', label: 'Bom', textColor: '#000000' },
  { max: 50, color: '#FFFF00', label: 'Moderada', textColor: '#000000' },
  { max: 75, color: '#FF7E00', label: 'Ruim', textColor: '#000000' },
  { max: 125, color: '#FF0000', label: 'Muito Ruim', textColor: '#FFFFFF' },
  { max: Infinity, color: '#8B0000', label: 'Péssima', textColor: '#FFFFFF' },
];

export function getPM25Color(pm25) {
  if (pm25 == null || pm25 < 0) return { color: '#9e9e9e', textColor: '#ffffff', label: 'Sem dados' };
  for (const f of FAIXAS_PM25) if (pm25 <= f.max) return f;
  return FAIXAS_PM25[FAIXAS_PM25.length - 1];
}

export function getLabelPM25(pm25) {
  if (pm25 == null || pm25 < 0) return 'Sem dados';
  for (const f of FAIXAS_PM25) if (pm25 <= f.max) return f.label;
  return FAIXAS_PM25[FAIXAS_PM25.length - 1].label;
}
