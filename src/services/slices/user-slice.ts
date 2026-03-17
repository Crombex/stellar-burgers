import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData,
  getOrdersApi,
  refreshToken
} from '@api';
import { TOrder, TUser, TServerResponseError } from '@utils-types';
import { saveTokens, clearTokens, getCookie } from '@utils/cookie';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: TServerResponseError }
>('user/register', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при регистрации' };
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: TServerResponseError }
>('user/login', async (data: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при входе в аккаунт' };
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: TServerResponseError }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    clearTokens();
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при выходе из аккаунта' };
    return rejectWithValue(message);
  }
});

export const requestUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: TServerResponseError }
>('user/requestOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при получении истории заказов' };
    return rejectWithValue(message);
  }
});

export const requestUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: TServerResponseError }
>('user/request', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in error
        ? (error as TServerResponseError)
        : { message: 'Ошибка при получении информации о пользователе' };
    return rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: TServerResponseError }
>('user/update', async (data: Partial<TRegisterData>, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при обновлении информации о пользователе' };
    return rejectWithValue(message);
  }
});

type TUserState = {
  isAuthChecked: boolean;
  ordersPending: boolean;
  userPending: boolean;
  user: TUser | null;
  userError: string | null;
  orders: TOrder[];
  ordersError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  ordersPending: false,
  userPending: true,
  user: null,
  userError: null,
  orders: [],
  ordersError: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userPending = true;
        state.userError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userPending = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userPending = false;
        state.userError = action.payload?.message ?? 'Ошибка при регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.userPending = true;
        state.userError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userPending = false;
        state.userError =
          action.payload?.message ?? 'Ошибка при входе в аккаунт';
      })
      .addCase(logoutUser.pending, (state) => {
        state.userPending = true;
        state.userError = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userPending = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userPending = false;
        state.userError =
          action.payload?.message ?? 'Ошибка при выходе из аккаунта';
      })
      .addCase(requestUser.pending, (state) => {
        state.userPending = true;
        state.userError = null;
        state.isAuthChecked = false;
      })
      .addCase(requestUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(requestUser.rejected, (state, action) => {
        state.userPending = false;
        state.isAuthChecked = true;
        state.user = null;
        state.userError =
          action.payload?.message ?? 'Ошибка при получении истории заказов';
      })
      .addCase(updateUser.pending, (state) => {
        state.userPending = true;
        state.userError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userError =
          action.payload?.message ??
          'Ошибка при получении информации о пользователе';
        state.userPending = false;
      })
      .addCase(requestUserOrders.pending, (state) => {
        state.ordersPending = true;
        state.ordersError = null;
      })
      .addCase(requestUserOrders.fulfilled, (state, action) => {
        state.ordersPending = false;
        state.orders = action.payload;
      })
      .addCase(requestUserOrders.rejected, (state, action) => {
        state.ordersPending = false;
        state.ordersError =
          action.payload?.message ??
          'Ошибка при обновлении информации о пользователе';
        state.orders = [];
      });
  }
});

export { initialState as userInitialState };
