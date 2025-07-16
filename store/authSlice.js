import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: {
    id: null,
    name: "",
    email: "",
    phone: "",
    profileType: "", // 'tenant', 'landlord', or 'dual'
    verified: false,
    photo: "",
    bio: "",
    ratings: [], // [{ value, reviewer, comment }]
    reviews: [], // [{ reviewer, comment, date }]
    transactions: [], // [{ id, date, type, details }]
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = { ...state.user, ...action.payload };
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setProfileType: (state, action) => {
      state.user.profileType = action.payload;
    },
    setVerification: (state, action) => {
      state.user.verified = action.payload;
    },
    addRating: (state, action) => {
      state.user.ratings.push(action.payload);
    },
    addReview: (state, action) => {
      state.user.reviews.push(action.payload);
    },
    addTransaction: (state, action) => {
      state.user.transactions.push(action.payload);
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  setProfileType,
  setVerification,
  addRating,
  addReview,
  addTransaction,
} = authSlice.actions;
export default authSlice.reducer;
