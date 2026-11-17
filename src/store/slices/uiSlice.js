import { createSlice } from '@reduxjs/toolkit';
import { getLanguage } from '@/i18n/translate';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedVariable: 'pm25',
    language: getLanguage(),
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setSelectedVariable: (state, action) => {
      state.selectedVariable = action.payload;
    },
  },
});

export const { setSelectedVariable, setLanguage } = uiSlice.actions;

export const selectSelectedVariable = (state) => state.ui.selectedVariable;
export const selectLanguage = (state) => state.ui.language;

export default uiSlice.reducer;
