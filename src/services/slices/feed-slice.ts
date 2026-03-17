import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData, TServerResponseError } from '@utils-types';

export const requestFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: TServerResponseError }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Не удалось получить информацию с ленты заказов' };
    return rejectWithValue(message);
  }
});

type TFeedState = TOrdersData & {
  isPending: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isPending: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestFeed.pending, (state) => {
        state.error = null;
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
        state.error =
          action.payload?.message ??
          'Не удалось получить информацию с ленты заказов';
      });
  }
});

export { initialState as feedInitialState };
