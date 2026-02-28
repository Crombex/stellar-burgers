import { RootState } from '@services/store';

export const getBurgerConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const getBurgerConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const getOrderIsSending = (state: RootState) =>
  state.burgerConstructor.isOrderSending;
export const getOrderResponse = (state: RootState) =>
  state.burgerConstructor.orderResponse;
