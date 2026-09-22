import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import sensorsReducer from './slices/sensorsSlice';
import readingsReducer from './slices/readingsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    sensors: sensorsReducer,
    readings: readingsReducer,
  },
});
