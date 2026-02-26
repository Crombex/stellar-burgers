import { RootState } from '@services/store';

export const getBurgerConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const getBurgerConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const getBurgerConstructorOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const getOrderResponse = (state: RootState) =>
  state.burgerConstructor.orderResponse;
