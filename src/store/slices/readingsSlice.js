import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';
import { normalizeReading } from '@/helpers/readings';

const api = new APIService();

export const fetchReadings = createAsyncThunk('readings/fetchReadings', async ({ _sig, ...params }) => {
  const data = await api.fetchSensorReadings(params);
  const items = (data?.readings ?? []).map((reading) => normalizeReading(reading, reading.source)).filter(Boolean);
  return { items, _sig };
});

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
        state.error = action.error.message ?? 'errors.fetchReadings';
      });
  },
});

export const selectReadings = (state) => state.readings.items;
export const selectReadingsLoading = (state) => state.readings.loading;
export const selectReadingsError = (state) => state.readings.error;

export default readingsSlice.reducer;
