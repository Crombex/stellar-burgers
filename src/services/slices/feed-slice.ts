import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

export const requestFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось получить информацию с ленты заказов';
      return rejectWithValue(message);
    }
  }
);

type TFeedState = TOrdersData & {
  isPending: boolean;
  error: string;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isPending: false,
  error: ''
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestFeed.pending, (state) => {
        state.error = '';
        state.isPending = true;
      })
      .addCase(
        requestFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isPending = false;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.orders = action.payload.orders;
        }
      )
      .addCase(requestFeed.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  }
});
