import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import api from '../../services/api';

export const fetchInstructors = createAsyncThunk(
  'instructors/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/instructors', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'instructors/featured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/instructors/featured');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load instructors');
    }
  }
);

export const fetchInstructor = createAsyncThunk(
  'instructors/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/instructors/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'instructors/recommendations',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/instructors/recommendations/personalized');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const instructorSlice = createSlice({
  name: 'instructors',
  initialState: {
    list: [],
    featured: [],
    current: null,
    reviews: [],
    recommendations: [],
    total: 0,
    pages: 1,
    page: 1,
    loading: false,
    featuredLoading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
      state.reviews = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => { state.loading = true; })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload?.data) ? action.payload.data : [];
        state.total = action.payload?.total || 0;
        state.pages = action.payload?.pages || 1;
        state.page = action.payload?.page || 1;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload;
      })
      .addCase(fetchFeatured.pending, (state) => {
        state.featuredLoading = true;
      })
      .addCase(fetchFeatured.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featured = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFeatured.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featured = [];
        state.error = action.payload;
      })
      .addCase(fetchInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload.data;
        state.reviews = action.payload.reviews || [];
        state.error = null;
      })
      .addCase(fetchInstructor.rejected, (state, action) => {
        state.loading = false;
        state.current = null;
        state.error = action.payload || 'Instructor not found';
        toast.error(state.error);
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.recommendations = [];
      });
  },
});

export const { clearCurrent } = instructorSlice.actions;
export default instructorSlice.reducer;
