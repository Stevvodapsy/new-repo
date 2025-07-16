import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  propertyType: "",
  filters: {},
  sortBy: "newest",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setPropertyType: (state, action) => {
      state.propertyType = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setSearchTerm,
  setPropertyType,
  setFilters,
  setSortBy,
  resetFilters,
} = appSlice.actions;
export default appSlice.reducer;
