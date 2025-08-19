import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

export const fetchFeed = createAsyncThunk(
  'orders/fetchFeed',
  async function () {
    const data = await getFeedsApi();
    return data;
  }
);

type TOrdersState = {
  loading: boolean;
  error: string | undefined;
} & TOrdersData;

const initialState: TOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: undefined
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
