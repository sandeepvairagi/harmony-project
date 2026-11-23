import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileMenuOpen: false,
    searchFilters: {
      keyword: '',
      yogaType: '',
      location: '',
      minPrice: '',
      maxPrice: '',
    },
  },
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    resetSearchFilters: (state) => {
      state.searchFilters = { keyword: '', yogaType: '', location: '', minPrice: '', maxPrice: '' };
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, setSearchFilters, resetSearchFilters } = uiSlice.actions;
export default uiSlice.reducer;
