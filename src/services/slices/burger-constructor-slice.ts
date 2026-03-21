import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TServerResponseError
} from '@utils-types';
import { nanoid } from '@utils/nanoid';
import { orderBurgerApi, TNewOrderResponse } from '@utils/burger-api';

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  TIngredient['_id'][],
  { rejectValue: TServerResponseError }
>('burgerConstructor/order', async (data, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(data);
    return response;
  } catch (error) {
    const message =
      error instanceof Object && 'message' in (error as TServerResponseError)
        ? (error as TServerResponseError)
        : { message: 'Не удалось создать заказ' };
    return rejectWithValue(message);
  }
});

type TBurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: Omit<TConstructorIngredient, 'id'> | null;
  isOrderSending: boolean;
  error: string | null;
  orderResponse: Omit<TOrder, 'ingredients'> | null;
};

const initialState: TBurgerConstructorState = {
  ingredients: [],
  bun: null,
  error: null,
  isOrderSending: false,
  orderResponse: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    removeIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 1 | -1 }>
    ) => {
      const index = state.ingredients.findIndex(
        (elem) => elem.id === action.payload.id
      );
      const removedItem = state.ingredients.splice(index, 1)[0];
      state.ingredients.splice(
        index + action.payload.direction,
        0,
        removedItem
      );
    },
    clearOrderResponse: (state) => {
      state.orderResponse = null;
      state.isOrderSending = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isOrderSending = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrderSending = false;
        state.orderResponse = action.payload.order;
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload?.message ?? 'Не удалось создать заказ';
        state.isOrderSending = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  moveIngredient,
  clearOrderResponse
} = burgerConstructorSlice.actions;

export { initialState as burgerConstructorInitialState };
