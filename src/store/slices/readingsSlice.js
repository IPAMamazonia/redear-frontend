import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';
import { purpleAirTempParaCelsius } from '@/helpers/readings';

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

function normalizeReading(r) {
  if (!r || typeof r !== 'object') return null;

  const reading = { ...r, datetime: parseReadingDatetime(r.datetime) };
  if (r.source === 'purpleAir') {
    reading.bme_temperature = purpleAirTempParaCelsius(r.bme_temperature);
  }
  return reading;
}

export const fetchReadings = createAsyncThunk(
  'readings/fetchReadings',
  async ({ _sig, ...params }) => {
    const data = await api.fetchSensorReadings(params);
    const items = (data?.readings ?? [])?.map(normalizeReading).filter(Boolean) ?? [];
    return { items, _sig };
  },
);

const readingsSlice = createSlice({
  name: 'readings',
  initialState: {
    items: [],
    loading: false,
    error: null,
    signature: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadings.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.signature = action.meta.arg._sig ?? null;
      })
      .addCase(fetchReadings.fulfilled, (state, action) => {
        if (action.payload._sig !== state.signature) return;
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchReadings.rejected, (state, action) => {
        if (action.meta.arg._sig !== state.signature) return;
        state.loading = false;
        state.error = action.error.message ?? 'Erro ao buscar leituras';
      });
  },
});

export const selectReadings = (state) => state.readings.items;
export const selectReadingsLoading = (state) => state.readings.loading;
export const selectReadingsError = (state) => state.readings.error;

export default readingsSlice.reducer;