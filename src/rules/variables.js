import { avg, buildGradientScale, computePM25AQI, aqiColor } from '@/helpers';

export const EPA_PM25_BREAKPOINTS = [
  { iLow: 0, iHigh: 50, cLow: 0.0, cHigh: 9.0 },
  { iLow: 51, iHigh: 100, cLow: 9.1, cHigh: 35.4 },
  { iLow: 101, iHigh: 150, cLow: 35.5, cHigh: 55.4 },
  { iLow: 151, iHigh: 200, cLow: 55.5, cHigh: 125.4 },
  { iLow: 201, iHigh: 300, cLow: 125.5, cHigh: 225.4 },
  { iLow: 301, iHigh: 500, cLow: 225.5, cHigh: 325.4 },
];

export const AQI_STOPS = [
  { max: 50, rgb: [0, 228, 0], label: 'Bom' },
  { max: 100, rgb: [255, 255, 0], label: 'Moderado' },
  { max: 150, rgb: [255, 126, 0], label: 'Insalubre' },
  { max: 200, rgb: [255, 0, 0], label: 'Muito insalubre', textColor: '#ffffff' },
  { max: 300, rgb: [143, 63, 151], label: 'Perigoso', textColor: '#ffffff' },
  { max: 500, rgb: [126, 0, 35], label: 'Muito perigoso', textColor: '#ffffff' },
];

export const PM1_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 10, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 25, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 50, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 75, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

export const PM25_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 15, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 50, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 75, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 125, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

export const PM10_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 45, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 100, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 150, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 250, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

export const TEMP_STOPS = [
  { min: 0, rgb: [33, 150, 243], label: 'Frio' },
  { min: 15, rgb: [0, 200, 83], label: 'Agradável' },
  { min: 25, rgb: [255, 235, 59], label: 'Quente' },
  { min: 35, rgb: [255, 87, 34], label: 'Muito quente', textColor: '#ffffff' },
  { min: 42, rgb: [183, 28, 28], label: 'Extremo', textColor: '#ffffff' },
];

export const HUMIDITY_STOPS = [
  { min: 0, rgb: [183, 28, 28], label: 'Muito seco', textColor: '#ffffff' },
  { min: 20, rgb: [255, 152, 0], label: 'Seco' },
  { min: 40, rgb: [255, 235, 59], label: 'Confortável' },
  { min: 60, rgb: [0, 200, 83], label: 'Úmido' },
  { min: 80, rgb: [33, 150, 243], label: 'Muito úmido' },
];

export const PRESSURE_STOPS = [
  { min: 990, rgb: [255, 152, 0], label: 'Baixa' },
  { min: 1005, rgb: [255, 235, 59], label: 'Normal' },
  { min: 1015, rgb: [0, 200, 83], label: 'Estável' },
  { min: 1025, rgb: [33, 150, 243], label: 'Alta' },
];

export const P03_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 1000, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 3000, rgb: [255, 152, 0], label: 'Alta' },
  { min: 6000, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

export const P10_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 200, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 600, rgb: [255, 152, 0], label: 'Alta' },
  { min: 1500, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

export const P25_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 100, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 300, rgb: [255, 152, 0], label: 'Alta' },
  { min: 800, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

export const P100_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 30, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 100, rgb: [255, 152, 0], label: 'Alta' },
  { min: 300, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

function buildLegend(stops) {
  return stops.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor }));
}

export const MAP_VARIABLES = [
  {
    key: 'pm25',
    label: 'PM2.5',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm2_5_env, r.pms2_pm2_5_env),
    getColor: buildGradientScale(PM25_STOPS),
    legend: buildLegend(PM25_STOPS),
  },
  {
    key: 'aqi',
    label: 'US EPA PM2.5',
    unit: 'AQI',
    extract: (r) => computePM25AQI(avg(r.pms1_pm2_5_env, r.pms2_pm2_5_env), EPA_PM25_BREAKPOINTS),
    getColor: (aqi) => aqiColor(aqi, AQI_STOPS),
    legend: buildLegend(AQI_STOPS),
  },
  {
    key: 'pm1',
    label: 'PM1.0',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm1_0_env, r.pms2_pm1_0_env),
    getColor: buildGradientScale(PM1_STOPS),
    legend: buildLegend(PM1_STOPS),
  },
  {
    key: 'pm10',
    label: 'PM10',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm10_env, r.pms2_pm10_env),
    getColor: buildGradientScale(PM10_STOPS),
    legend: buildLegend(PM10_STOPS),
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    unit: '°C',
    extract: (r) => r.bme_temperature ?? null,
    getColor: buildGradientScale(TEMP_STOPS),
    legend: buildLegend(TEMP_STOPS),
  },
  {
    key: 'humidity',
    label: 'Umidade',
    unit: '%',
    extract: (r) => r.bme_humidity ?? null,
    getColor: buildGradientScale(HUMIDITY_STOPS),
    legend: buildLegend(HUMIDITY_STOPS),
  },
  {
    key: 'pressure',
    label: 'Pressão',
    unit: 'hPa',
    extract: (r) => r.bme_pressure ?? null,
    getColor: buildGradientScale(PRESSURE_STOPS),
    legend: buildLegend(PRESSURE_STOPS),
  },
  {
    key: 'p03um',
    label: 'P ≥ 0.3µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p03um, r.pms2_p03um),
    getColor: buildGradientScale(P03_STOPS),
    legend: buildLegend(P03_STOPS),
  },
  {
    key: 'p10um',
    label: 'P ≥ 1.0µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p10um, r.pms2_p10um),
    getColor: buildGradientScale(P10_STOPS),
    legend: buildLegend(P10_STOPS),
  },
  {
    key: 'p25um',
    label: 'P ≥ 2.5µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p25um, r.pms2_p25um),
    getColor: buildGradientScale(P25_STOPS),
    legend: buildLegend(P25_STOPS),
  },
  {
    key: 'p100um',
    label: 'P ≥ 10µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p100um, r.pms2_p100um),
    getColor: buildGradientScale(P100_STOPS),
    legend: buildLegend(P100_STOPS),
  },
];
