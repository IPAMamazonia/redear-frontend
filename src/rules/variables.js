function avg(v1, v2) {
  const a = v1 ?? null;
  const b = v2 ?? null;
  if (a == null && b == null) return null;
  if (a == null) return Number(b);
  if (b == null) return Number(a);
  return Number(((a + b) / 2).toFixed(1));
}

function lerpColor(low, high, t) {
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${r},${g},${b})`;
}

function gradientColor(value, stops) {
  if (value == null) return { color: '#9e9e9e', textColor: '#ffffff', label: 'Sem dados' };
  for (let i = 0; i < stops.length - 1; i++) {
    if (value <= stops[i + 1].min) {
      const t = (value - stops[i].min) / (stops[i + 1].min - stops[i].min);
      return {
        color: lerpColor(stops[i].rgb, stops[i + 1].rgb, t),
        textColor: stops[i].textColor ?? '#000000',
        label: stops[i].label,
      };
    }
  }
  const last = stops[stops.length - 1];
  return { color: lerpColor(last.rgb, last.rgb, 1), textColor: last.textColor ?? '#000000', label: last.label };
}

const PM1_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 10, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 25, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 50, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 75, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

const PM25_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 15, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 50, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 75, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 125, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

const PM10_STOPS = [
  { min: 0, rgb: [82, 159, 43], label: 'Boa' },
  { min: 45, rgb: [247, 212, 0], label: 'Moderada' },
  { min: 100, rgb: [228, 139, 39], label: 'Ruim' },
  { min: 150, rgb: [203, 9, 18], label: 'Muito Ruim', textColor: '#ffffff' },
  { min: 250, rgb: [139, 0, 0], label: 'Péssima', textColor: '#ffffff' },
];

const TEMP_STOPS = [
  { min: 0, rgb: [33, 150, 243], label: 'Frio' },
  { min: 15, rgb: [0, 200, 83], label: 'Agradável' },
  { min: 25, rgb: [255, 235, 59], label: 'Quente' },
  { min: 35, rgb: [255, 87, 34], label: 'Muito quente', textColor: '#ffffff' },
  { min: 42, rgb: [183, 28, 28], label: 'Extremo', textColor: '#ffffff' },
];

const HUMIDITY_STOPS = [
  { min: 0, rgb: [183, 28, 28], label: 'Muito seco', textColor: '#ffffff' },
  { min: 20, rgb: [255, 152, 0], label: 'Seco' },
  { min: 40, rgb: [255, 235, 59], label: 'Confortável' },
  { min: 60, rgb: [0, 200, 83], label: 'Úmido' },
  { min: 80, rgb: [33, 150, 243], label: 'Muito úmido' },
];

const PRESSURE_STOPS = [
  { min: 990, rgb: [255, 152, 0], label: 'Baixa' },
  { min: 1005, rgb: [255, 235, 59], label: 'Normal' },
  { min: 1015, rgb: [0, 200, 83], label: 'Estável' },
  { min: 1025, rgb: [33, 150, 243], label: 'Alta' },
];

const P03_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 1000, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 3000, rgb: [255, 152, 0], label: 'Alta' },
  { min: 6000, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

const P10_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 200, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 600, rgb: [255, 152, 0], label: 'Alta' },
  { min: 1500, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

const P25_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 100, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 300, rgb: [255, 152, 0], label: 'Alta' },
  { min: 800, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

const P100_STOPS = [
  { min: 0, rgb: [0, 200, 83], label: 'Baixa' },
  { min: 30, rgb: [255, 235, 59], label: 'Moderada' },
  { min: 100, rgb: [255, 152, 0], label: 'Alta' },
  { min: 300, rgb: [255, 0, 0], label: 'Muito alta', textColor: '#ffffff' },
];

function buildGradientScale(stops) {
  return (value) => gradientColor(value, stops);
}

export const MAP_VARIABLES = [
  {
    key: 'pm1',
    label: 'PM1.0',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm1_0_env, r.pms2_pm1_0_env),
    getColor: buildGradientScale(PM1_STOPS),
    legend: PM1_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'pm25',
    label: 'PM2.5',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm2_5_env, r.pms2_pm2_5_env),
    getColor: buildGradientScale(PM25_STOPS),
    legend: PM25_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'pm10',
    label: 'PM10',
    unit: 'µg/m³',
    extract: (r) => avg(r.pms1_pm10_env, r.pms2_pm10_env),
    getColor: buildGradientScale(PM10_STOPS),
    legend: PM10_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    unit: '°C',
    extract: (r) => r.bme_temperature ?? null,
    getColor: buildGradientScale(TEMP_STOPS),
    legend: TEMP_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'humidity',
    label: 'Umidade',
    unit: '%',
    extract: (r) => r.bme_humidity ?? null,
    getColor: buildGradientScale(HUMIDITY_STOPS),
    legend: HUMIDITY_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'pressure',
    label: 'Pressão',
    unit: 'hPa',
    extract: (r) => r.bme_pressure ?? null,
    getColor: buildGradientScale(PRESSURE_STOPS),
    legend: PRESSURE_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'p03um',
    label: 'P ≥ 0.3µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p03um, r.pms2_p03um),
    getColor: buildGradientScale(P03_STOPS),
    legend: P03_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'p10um',
    label: 'P ≥ 1.0µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p10um, r.pms2_p10um),
    getColor: buildGradientScale(P10_STOPS),
    legend: P10_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'p25um',
    label: 'P ≥ 2.5µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p25um, r.pms2_p25um),
    getColor: buildGradientScale(P25_STOPS),
    legend: P25_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
  {
    key: 'p100um',
    label: 'P ≥ 10µm',
    unit: 'p/0.1L',
    extract: (r) => avg(r.pms1_p100um, r.pms2_p100um),
    getColor: buildGradientScale(P100_STOPS),
    legend: P100_STOPS.map((s) => ({ color: `rgb(${s.rgb.join(',')})`, label: s.label, textColor: s.textColor })),
  },
];

export function getVariableByKey(key) {
  return MAP_VARIABLES.find((v) => v.key === key) || MAP_VARIABLES[0];
}

export function getSensorValue(sensor, variable) {
  const reading = sensor.readings?.[0];
  if (!reading) return null;
  return variable.extract(reading);
}
