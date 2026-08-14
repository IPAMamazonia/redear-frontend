import { AQI_CORES, ESTADOS, TIPOS_TERRITORIO } from '@/mocks/sensors';

export function getCorAQI(aqi) {
  for (const c of AQI_CORES) if (aqi <= c.max) return c;
  return AQI_CORES[AQI_CORES.length - 1];
}

export function getLabelAQI(aqi) {
  for (const c of AQI_CORES) if (aqi <= c.max) return c.label;
  return AQI_CORES[AQI_CORES.length - 1].label;
}

const EPA_BP_PM25 = [
  { cLow: 0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
];

const EPA_BP_PM10 = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
];

function concToAQI(conc, breakpoints) {
  if (conc == null || conc < 0) return null;
  for (const bp of breakpoints) {
    if (conc >= bp.cLow && conc <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (conc - bp.cLow) + bp.iLow
      );
    }
  }
  return 500;
}

export function calcAQI(pm25, pm10) {
  const aqi25 = pm25 != null ? concToAQI(pm25, EPA_BP_PM25) : 0;
  const aqi10 = pm10 != null ? concToAQI(pm10, EPA_BP_PM10) : 0;
  return Math.max(aqi25, aqi10);
}

export function getAQIBase(id) {
  if (!id) return 55;
  for (const e of ESTADOS) {
    if (e.id === id) return e.aqiBase;
    for (const m of e.municipios) if (m.id === id) return m.aqiBase;
  }
  for (const t of TIPOS_TERRITORIO) {
    if (t.id === id) return t.aqiBase;
    for (const ter of t.territorios) if (ter.id === id) return ter.aqiBase;
  }
  return 55;
}

export function gerarDadosHistorico(localId, periodo) {
  const baseAQI = getAQIBase(localId);
  const volatilidade = baseAQI * 0.4;

  let pontos;
  switch (periodo) {
    case '1D':
      pontos = 24;
      break;
    case '5D':
      pontos = 5;
      break;
    case '1M':
      pontos = 30;
      break;
    case '6M':
      pontos = 26;
      break;
    case 'YTD':
      pontos = new Date().getMonth() + 1;
      break;
    case '1A':
      pontos = 12;
      break;
    case '5A':
      pontos = 5;
      break;
    case 'Max':
      pontos = 10;
      break;
    default:
      pontos = 24;
  }

  const labels = [];
  const valores = [];
  const pm25 = [];
  const pm10 = [];
  let current = baseAQI;
  const hoje = new Date();

  for (let i = pontos - 1; i >= 0; i--) {
    current += (Math.random() - 0.47) * volatilidade;
    current = Math.max(10, Math.min(280, current));
    const val = Math.round(current);
    valores.push(val);
    pm25.push(Math.round(val * 0.32 * 10) / 10);
    pm10.push(Math.round(val * 0.58 * 10) / 10);

    switch (periodo) {
      case '1D': {
        const d = new Date(hoje);
        d.setHours(hoje.getHours() - i);
        labels.push(d.getHours().toString().padStart(2, '0') + ':00');
        break;
      }
      case '5D': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
        break;
      }
      case '1M': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i);
        labels.push(d.getDate() + '/' + (d.getMonth() + 1));
        break;
      }
      case '6M': {
        const d = new Date(hoje);
        d.setDate(hoje.getDate() - i * 7);
        labels.push(d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }));
        break;
      }
      case 'YTD':
      case '1A': {
        const d = new Date(hoje);
        d.setMonth(hoje.getMonth() - i);
        labels.push(d.toLocaleDateString('pt-BR', { month: 'short' }));
        break;
      }
      case '5A': {
        const d = new Date(hoje);
        d.setFullYear(hoje.getFullYear() - i);
        labels.push(d.getFullYear().toString());
        break;
      }
      case 'Max': {
        const d = new Date(hoje);
        d.setFullYear(hoje.getFullYear() - i);
        labels.push(d.getFullYear().toString().slice(-2) + "'");
        break;
      }
      default:
        labels.push(i.toString());
    }
  }

  return { labels, valores, pm25, pm10 };
}

export function formatNumberString(value, decimals = 0) {
  if (value == null || isNaN(value)) return '';

  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}