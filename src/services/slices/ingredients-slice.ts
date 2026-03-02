import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const requestIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/requestIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Ошибка при загрузке ингридиентов';
    return rejectWithValue(message);
  }
});

type TIngredientsState = {
  items: TIngredient[];
  isPending: boolean;
  error: string;
};

const initialState: TIngredientsState = {
  items: [],
  isPending: false,
  error: ''
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestIngredients.pending, (state) => {
        state.error = '';
        state.isPending = true;
      })
      .addCase(requestIngredients.fulfilled, (state, action) => {
        state.isPending = false;
        state.items = action.payload;
      })
      .addCase(requestIngredients.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string;
      });
  }
});
