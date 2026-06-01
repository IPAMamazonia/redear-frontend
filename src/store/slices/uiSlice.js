import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    activeFaqIndex: null,
    scrolled: false,
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
  },
});

export const { toggleMobileMenu, closeMobileMenu, setActiveFaq, setScrolled } = uiSlice.actions;
export default uiSlice.reducer;
