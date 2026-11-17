import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';
import { normalizeReadings } from '@/helpers/readings';

const api = new APIService();

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

  const isTrustworthy = absDiff <= 10 || relDiff < 0.4;

  return {
    id: s.sensor_id,
    source: s.source,
    name: s.name,
    gps: coordinates ? { coordinates } : null,
    municipio: s.municipio,
    estado: s.estado,
    geocode_mun: s.geocode_mun ?? null,
    geocode_uf: s.geocode_uf ?? null,
    regiao: s.regiao,
    bioma: s.bioma,
    readings,
    is_online: latestTimestamp != null && latestTimestamp >= Date.now() - onlineWindow,
    is_trustworthy: isTrustworthy,
    latest_reading: latestTimestamp != null ? new Date(latestTimestamp).toISOString() : null,
    oldest_reading: oldestTimestamp != null ? new Date(oldestTimestamp).toISOString() : null,
  };
}

export const fetchSensors = createAsyncThunk(
  'sensors/fetchSensors',
  async () => {
    const data = await api.fetchSensors();
    // `_fetchJson` devolve `undefined` em falha de rede e o corpo de erro em
    // respostas HTTP inválidas; nenhum dos dois é uma lista de sensores.
    if (!Array.isArray(data)) throw new Error('errors.fetchSensors');
    return data.map(normalizeSensor).filter(Boolean);
  },
  {
    // Mapa, gráfico e exportação montam juntos e podem solicitar a lista ao
    // mesmo tempo; evita três requisições concorrentes idênticas.
    condition: (_, { getState }) => !getState().sensors.loading,
  }
);

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
        state.error = action.error.message ?? 'errors.fetchSensors';
      });
  },
});

export const selectSensors = (state) => state.sensors.items;
export const selectSensorsLoading = (state) => state.sensors.loading;
export const selectSensorsError = (state) => state.sensors.error;

export default sensorsSlice.reducer;
