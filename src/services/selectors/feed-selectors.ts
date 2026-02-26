import { RootState } from '@services/store';

export const getFeedOrders = (state: RootState) => state.feed.orders;
export const getFeedIsPending = (state: RootState) => state.feed.isPending;
export const getFeedError = (state: RootState) => state.feed.error;
export const getFeedTotal = (state: RootState) => state.feed.total;
export const getFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const getFeedOrderByNumber = (number: number) => (state: RootState) =>
  state.feed.orders.find((order) => order.number === number);
