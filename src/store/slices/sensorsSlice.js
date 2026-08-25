import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';

const api = new APIService();

function parseReadingDatetime(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(trimmed);
  const candidate = hasTimezone ? trimmed : `${trimmed.replace(/\s+/g, 'T')}Z`;
  const date = new Date(candidate);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeReadings(readings, source) {
  if (!Array.isArray(readings)) return [];

  return readings
    .filter((r) => r && typeof r === 'object')
    .map((r) => {
      const normalized = { ...r, datetime: parseReadingDatetime(r.datetime) };
      if (source === 'purpleAir' && normalized.bme_temperature != null) {
        normalized.bme_temperature = Number(((normalized.bme_temperature - 32) * 5 / 9).toFixed(1));
      }
      return normalized;
    });
}

function normalizeSensor(s) {
  if (!s || typeof s !== 'object') return null;

  const readings = normalizeReadings(s.readings, s.source);
  const timestamps = readings
    .map((r) => r.datetime)
    .filter(Boolean)
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t));

  const latestTimestamp = timestamps.length ? Math.max(...timestamps) : null;
  const oldestTimestamp = timestamps.length ? Math.min(...timestamps) : null;

  let coordinates = null;
  if (s.gps?.type === 'Point' && Array.isArray(s.gps.coordinates)) {
    coordinates = s.gps.coordinates;
  }

  const minutesInMs = 60 * 1000;
  const onlineWindow = 15 * minutesInMs; // 15 minutes in milliseconds

  const latestReading = readings[0];
  const v1 = latestReading?.pms1_pm2_5_env;
  const v2 = latestReading?.pms2_pm2_5_env;
  const maxVal = Math.max(v1 ?? 0, v2 ?? 0);
  const absDiff = Math.abs((v1 ?? 0) - (v2 ?? 0));
  const relDiff = maxVal === 0 ? 0 : absDiff / maxVal;

  const isTrustworthy = absDiff <= 10 || relDiff < 0.40;

  return {
    id: s.sensor_id,
    source: s.source,
    name: s.name,
    gps: coordinates ? { coordinates } : null,
    municipio: s.municipio,
    estado: s.estado,
    regiao: s.regiao,
    bioma: s.bioma,
    readings,
    is_online: latestTimestamp != null && latestTimestamp >= Date.now() - onlineWindow,
    is_trustworthy: isTrustworthy,
    latest_reading: latestTimestamp != null ? new Date(latestTimestamp).toISOString() : null,
    oldest_reading: oldestTimestamp != null ? new Date(oldestTimestamp).toISOString() : null,
  };
}

export const fetchSensors = createAsyncThunk('sensors/fetchSensors', async () => {
  const data = await api.fetchSensors();
  if (!Array.isArray(data)) return [];
  return data.map(normalizeSensor).filter(Boolean);
});

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Erro ao buscar sensores';
      });
  },
});

export const selectSensors = (state) => state.sensors.items;
export const selectSensorsLoading = (state) => state.sensors.loading;
export const selectSensorsError = (state) => state.sensors.error;

export default sensorsSlice.reducer;
