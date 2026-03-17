import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient, TServerResponseError } from '@utils-types';

export const requestIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: TServerResponseError }
>('ingredients/requestIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Ошибка при загрузке ингредиентов' };
    return rejectWithValue(message);
  }
});

type TIngredientsState = {
  items: TIngredient[];
  isPending: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isPending: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestIngredients.pending, (state) => {
        state.error = null;
        state.isPending = true;
      })
      .addCase(requestIngredients.fulfilled, (state, action) => {
        state.isPending = false;
        state.items = action.payload;
      })
      .addCase(requestIngredients.rejected, (state, action) => {
        state.isPending = false;
        state.error =
          action.payload?.message ?? 'Ошибка при загрузке ингредиентов';
      });
  }
});

export { initialState as ingredientsInitialState };
