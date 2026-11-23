import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const checkAvailability = createAsyncThunk(
  'bookings/availability',
  async ({ instructorId, date }) => {
    const { data } = await api.get('/bookings/availability', {
      params: { instructorId, date },
    });
    return data;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/bookings', bookingData);
      toast.success('Session booked successfully!');
      return data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk('bookings/my', async () => {
  const { data } = await api.get('/bookings/my');
  return data.data;
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id) => {
  const { data } = await api.put(`/bookings/${id}/cancel`);
  toast.success('Booking cancelled');
  return data.data;
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    myBookings: [],
    availability: { slots: [], date: null },
    loading: false,
    bookingLoading: false,
  },
  reducers: {
    clearAvailability: (state) => {
      state.availability = { slots: [], date: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      })
      .addCase(createBooking.pending, (state) => { state.bookingLoading = true; })
      .addCase(createBooking.fulfilled, (state) => { state.bookingLoading = false; })
      .addCase(createBooking.rejected, (state) => { state.bookingLoading = false; })
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.myBookings.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.myBookings[idx] = action.payload;
      });
  },
});

export const { clearAvailability } = bookingSlice.actions;
export default bookingSlice.reducer;
