import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    activeFaqIndex: null,
    scrolled: false,
    selectedVariable: 'pm25',
  },
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    setActiveFaq: (state, action) => {
      state.activeFaqIndex = action.payload;
    },
    setScrolled: (state, action) => {
      state.scrolled = action.payload;
    },
    setSelectedVariable: (state, action) => {
      state.selectedVariable = action.payload;
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, setActiveFaq, setScrolled, setSelectedVariable } = uiSlice.actions;
export default uiSlice.reducer;
