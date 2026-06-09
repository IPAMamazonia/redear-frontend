import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { APIService } from '@/API/APIService';

const api = new APIService();

export const fetchSensors = createAsyncThunk('sensors/fetchSensors', async () => {
  const data = await api.fetchSensors();
  return data;
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
