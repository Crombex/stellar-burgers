import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData,
  getOrdersApi
} from '@api';
import { TOrder, TUser } from '@utils-types';
import { saveTokens, clearTokens } from '@utils/cookie';

type TUserError = {
  message: string;
  code: number;
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data: TRegisterData, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TUserError)
        ? (error as TUserError).message
        : 'Ошибка при регистрации';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data: TLoginData, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TUserError)
        ? (error as TUserError).message
        : 'Ошибка при входе в аккаунт';
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearTokens();
    } catch (error) {
      const message =
        error instanceof Object && 'message' in (error as TUserError)
          ? (error as TUserError).message
          : 'Ошибка при выходе из аккаунта';
      return rejectWithValue(message);
    }
  }
);

export const requestUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('user/requestOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TUserError)
        ? (error as TUserError).message
        : 'Ошибка при получении истории заказов';
    return rejectWithValue(message);
  }
});

export const requestUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/request', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data: Partial<TRegisterData>, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response.user;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TUserError)
        ? (error as TUserError).message
        : 'Ошибка при обновлении информации о пользователе';
    return rejectWithValue(message);
  }
});

type TUserState = {
  isAuthChecked: boolean;
  ordersPending: boolean;
  userPending: boolean;
  user: TUser | null;
  error: string;
  orders: TOrder[];
};

const initialState: TUserState = {
  isAuthChecked: false,
  ordersPending: false,
  userPending: true,
  user: null,
  error: '',
  orders: []
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userPending = true;
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userPending = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userPending = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.userPending = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userPending = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.userPending = true;
        state.error = '';
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userPending = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userPending = false;
        state.error = action.payload as string;
      })
      .addCase(requestUser.pending, (state) => {
        state.userPending = true;
        state.error = '';
        state.isAuthChecked = false;
      })
      .addCase(requestUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(requestUser.rejected, (state) => {
        state.userPending = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.userPending = true;
        state.error = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userPending = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.userPending = false;
      })
      .addCase(requestUserOrders.pending, (state) => {
        state.ordersPending = true;
        state.error = '';
      })
      .addCase(requestUserOrders.fulfilled, (state, action) => {
        state.ordersPending = false;
        state.orders = action.payload;
      })
      .addCase(requestUserOrders.rejected, (state, action) => {
        state.ordersPending = false;
        state.error = action.payload as string;
        state.orders = [];
      });
  }
});
