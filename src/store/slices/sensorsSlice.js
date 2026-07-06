import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';

const api = new APIService();

function normalizeSensor(s) {
  const readings = s.readings || [];
  const firstReading = readings[0];
  const lastReading = readings[readings.length - 1];

  let coordinates = null;
  if (s.gps?.type === 'Point' && Array.isArray(s.gps.coordinates)) {
    coordinates = s.gps.coordinates;
  }

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
    is_online: readings.length > 0,
    latest_reading: firstReading?.datetime ?? null,
    oldest_reading: lastReading?.datetime ?? null,
  };
}

export const fetchSensors = createAsyncThunk('sensors/fetchSensors', async () => {
  const data = await api.fetchSensors();
  return (data || []).map(normalizeSensor);
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
