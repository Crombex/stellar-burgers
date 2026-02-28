import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { nanoid } from '@utils/nanoid';
import { orderBurgerApi } from '@utils/burger-api';

export const createOrder = createAsyncThunk(
  'burgerConstructor/order',
  async (data: TIngredient['_id'][]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

type TBurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: Omit<TConstructorIngredient, 'id'> | null;
  isOrderSending: boolean;
  error: string;
  orderResponse: Omit<TOrder, 'ingredients'> | null;
};

const initialState: TBurgerConstructorState = {
  ingredients: [],
  bun: null,
  error: '',
  isOrderSending: false,
  orderResponse: null
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const constructorIngredient = { ...action.payload, id: nanoid() };
      state.ingredients.push(constructorIngredient);
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
        state.error = '';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrderSending = false;
        state.orderResponse = action.payload.order;
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при отправке заказа';
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
