import { avg } from '@/helpers/avg.js';
import { buildVariable } from '@/helpers/build-variable.js';
import { computePM25AQI } from '@/helpers/compute-pm25-aqi.js';

export const EPA_PM25_BREAKPOINTS = [
  { iLow: 0, iHigh: 50, cLow: 0.0, cHigh: 9.0 },
  { iLow: 51, iHigh: 100, cLow: 9.1, cHigh: 35.4 },
  { iLow: 101, iHigh: 150, cLow: 35.5, cHigh: 55.4 },
  { iLow: 151, iHigh: 200, cLow: 55.5, cHigh: 125.4 },
  { iLow: 201, iHigh: 300, cLow: 125.5, cHigh: 225.4 },
  { iLow: 301, iHigh: 500, cLow: 225.5, cHigh: 325.4 },
];

export const AQI_STOPS = [
  { max: 50, rgb: [0, 228, 0], label: 'Bom', labelKey: 'bands.good' },
  { max: 100, rgb: [255, 255, 0], label: 'Moderado', labelKey: 'bands.moderate' },
  { max: 150, rgb: [255, 126, 0], label: 'Insalubre', labelKey: 'bands.unhealthy' },
  { max: 200, rgb: [255, 0, 0], label: 'Muito insalubre', labelKey: 'bands.veryUnhealthy', textColor: '#ffffff' },
  { max: 300, rgb: [143, 63, 151], label: 'Perigoso', labelKey: 'bands.hazardous', textColor: '#ffffff' },
  { max: 500, rgb: [126, 0, 35], label: 'Muito perigoso', labelKey: 'bands.veryHazardous', textColor: '#ffffff' },
];

export const PM1_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa', labelKey: 'bands.goodFem' },
  { min: 10, rgb: [247, 212, 0], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 25, rgb: [228, 139, 39], label: 'Ruim', labelKey: 'bands.poor' },
  { min: 50, rgb: [203, 9, 18], label: 'Muito Ruim', labelKey: 'bands.veryPoor', textColor: '#ffffff' },
  { min: 75, rgb: [139, 0, 0], label: 'Péssima', labelKey: 'bands.veryBad', textColor: '#ffffff' },
];

export const PM25_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa', labelKey: 'bands.goodFem' },
  { min: 15, rgb: [247, 212, 0], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 50, rgb: [228, 139, 39], label: 'Ruim', labelKey: 'bands.poor' },
  { min: 75, rgb: [203, 9, 18], label: 'Muito Ruim', labelKey: 'bands.veryPoor', textColor: '#ffffff' },
  { min: 125, rgb: [139, 0, 0], label: 'Péssima', labelKey: 'bands.veryBad', textColor: '#ffffff' },
];

export const PM10_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa', labelKey: 'bands.goodFem' },
  { min: 45, rgb: [247, 212, 0], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 100, rgb: [228, 139, 39], label: 'Ruim', labelKey: 'bands.poor' },
  { min: 150, rgb: [203, 9, 18], label: 'Muito Ruim', labelKey: 'bands.veryPoor', textColor: '#ffffff' },
  { min: 250, rgb: [139, 0, 0], label: 'Péssima', labelKey: 'bands.veryBad', textColor: '#ffffff' },
];

export const TEMP_STOPS = [
  { min: 0, rgb: [33, 150, 243], label: 'Frio', labelKey: 'bands.cold' },
  { min: 15, rgb: [0, 200, 83], label: 'Agradável', labelKey: 'bands.pleasant' },
  { min: 25, rgb: [255, 235, 59], label: 'Quente', labelKey: 'bands.hot' },
  { min: 35, rgb: [255, 87, 34], label: 'Muito quente', labelKey: 'bands.veryHot', textColor: '#ffffff' },
  { min: 42, rgb: [183, 28, 28], label: 'Extremo', labelKey: 'bands.extreme', textColor: '#ffffff' },
];

export const HUMIDITY_STOPS = [
  { min: 0, rgb: [183, 28, 28], label: 'Muito seco', labelKey: 'bands.veryDry', textColor: '#ffffff' },
  { min: 20, rgb: [255, 152, 0], label: 'Seco', labelKey: 'bands.dry' },
  { min: 40, rgb: [255, 235, 59], label: 'Confortável', labelKey: 'bands.comfortable' },
  { min: 60, rgb: [0, 200, 83], label: 'Úmido', labelKey: 'bands.humid' },
  { min: 80, rgb: [33, 150, 243], label: 'Muito úmido', labelKey: 'bands.veryHumid' },
];

export const PRESSURE_STOPS = [
  { min: 990, rgb: [255, 152, 0], label: 'Baixa', labelKey: 'bands.low' },
  { min: 1005, rgb: [255, 235, 59], label: 'Normal', labelKey: 'bands.normal' },
  { min: 1015, rgb: [0, 200, 83], label: 'Estável', labelKey: 'bands.stable' },
  { min: 1025, rgb: [33, 150, 243], label: 'Alta', labelKey: 'bands.high' },
];

export const P03_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa', labelKey: 'bands.low' },
  { min: 1000, rgb: [255, 235, 59], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 3000, rgb: [255, 152, 0], label: 'Alta', labelKey: 'bands.high' },
  { min: 6000, rgb: [255, 0, 0], label: 'Muito alta', labelKey: 'bands.veryHigh', textColor: '#ffffff' },
];

export const P10_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa', labelKey: 'bands.low' },
  { min: 200, rgb: [255, 235, 59], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 600, rgb: [255, 152, 0], label: 'Alta', labelKey: 'bands.high' },
  { min: 1500, rgb: [255, 0, 0], label: 'Muito alta', labelKey: 'bands.veryHigh', textColor: '#ffffff' },
];

export const P25_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa', labelKey: 'bands.low' },
  { min: 100, rgb: [255, 235, 59], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 300, rgb: [255, 152, 0], label: 'Alta', labelKey: 'bands.high' },
  { min: 800, rgb: [255, 0, 0], label: 'Muito alta', labelKey: 'bands.veryHigh', textColor: '#ffffff' },
];

export const P100_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa', labelKey: 'bands.low' },
  { min: 30, rgb: [255, 235, 59], label: 'Moderada', labelKey: 'bands.moderateFem' },
  { min: 100, rgb: [255, 152, 0], label: 'Alta', labelKey: 'bands.high' },
  { min: 300, rgb: [255, 0, 0], label: 'Muito alta', labelKey: 'bands.veryHigh', textColor: '#ffffff' },
];

export const MAP_VARIABLES = [
  buildVariable({
    key: 'pm25',
    label: 'PM2.5',
    labelKey: 'variables.pm25',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm2_5_env, r.pms2_pm2_5_env),
    stops: PM25_STOPS,
  }),
  buildVariable({
    key: 'aqi',
    label: 'US EPA PM2.5',
    labelKey: 'variables.aqi',
    unit: 'AQI',
    extract: (r) => computePM25AQI(avg(r.pms1_pm2_5_env, r.pms2_pm2_5_env), EPA_PM25_BREAKPOINTS),
    stops: AQI_STOPS,
    mode: 'discrete',
  }),
  buildVariable({
    key: 'pm1',
    label: 'PM1.0',
    labelKey: 'variables.pm1',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm1_0_env, r.pms2_pm1_0_env),
    stops: PM1_STOPS,
  }),
  buildVariable({
    key: 'pm10',
    label: 'PM10',
    labelKey: 'variables.pm10',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm10_env, r.pms2_pm10_env),
    stops: PM10_STOPS,
  }),
  buildVariable({
    key: 'temperature',
    label: 'Temperatura',
    labelKey: 'variables.temperature',
    unit: '°C',
    extract: (r) => r.bme_temperature ?? null,
    stops: TEMP_STOPS,
  }),
  buildVariable({
    key: 'humidity',
    label: 'Umidade',
    labelKey: 'variables.humidity',
    unit: '%',
    extract: (r) => r.bme_humidity ?? null,
    stops: HUMIDITY_STOPS,
  }),
  buildVariable({
    key: 'pressure',
    label: 'Pressão',
    labelKey: 'variables.pressure',
    unit: 'hPa',
    extract: (r) => r.bme_pressure ?? null,
    stops: PRESSURE_STOPS,
  }),
  buildVariable({
    key: 'p03um',
    label: 'P ≥ 0.3µm',
    labelKey: 'variables.p03um',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p03um, r.pms2_p03um),
    stops: P03_STOPS,
  }),
  buildVariable({
    key: 'p10um',
    label: 'P ≥ 1.0µm',
    labelKey: 'variables.p10um',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p10um, r.pms2_p10um),
    stops: P10_STOPS,
  }),
  buildVariable({
    key: 'p25um',
    label: 'P ≥ 2.5µm',
    labelKey: 'variables.p25um',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p25um, r.pms2_p25um),
    stops: P25_STOPS,
  }),
  buildVariable({
    key: 'p100um',
    label: 'P ≥ 10µm',
    labelKey: 'variables.p100um',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p100um, r.pms2_p100um),
    stops: P100_STOPS,
  }),
];