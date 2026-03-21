import { RootState } from '@services/store';

export const getUserInfo = (state: RootState) => state.user.user;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getIsUserPending = (state: RootState) => state.user.userPending;
export const getIsUserOrdersPending = (state: RootState) =>
  state.user.ordersPending;
export const getUserError = (state: RootState) => state.user.userError;
export const getUserOrdersError = (state: RootState) => state.user.ordersError;
export const getUserOrders = (state: RootState) => state.user.orders;
export const getUserOrderByNumber = (number: number) => (state: RootState) =>
  state.user.orders.find((order) => order.number === number);
