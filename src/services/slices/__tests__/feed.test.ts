import { requestFeed, feedSlice, feedInitialState } from '@slices';
const feedReducer = feedSlice.reducer;

describe('Получение ленты заказов (feedSlice)', () => {
  test('Экшен Pending', () => {
    const state = feedReducer(feedInitialState, requestFeed.pending(''));

    expect(state.isPending).toBe(true);
    expect(state.error).toBe(null);
  });

  test('Экшен Fulfilled', () => {
    const fulfilledData = {
      success: true,
      orders: [
        {
          _id: '69b855daa64177001b32fdab',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Био-марсианский люминесцентный краторный бургер',
          createdAt: '2026-03-16T19:11:22.577Z',
          updatedAt: '2026-03-16T19:11:22.853Z',
          number: 102932
        },
        {
          _id: '69b85546a64177001b32fdaa',
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
          status: 'done',
          name: 'Краторный бургер',
          createdAt: '2026-03-16T19:08:54.801Z',
          updatedAt: '2026-03-16T19:08:55.026Z',
          number: 102931
        }
      ],
      total: 100000,
      totalToday: 40
    };

    const state = feedReducer(
      feedInitialState,
      requestFeed.fulfilled(fulfilledData, '')
    );

    expect(state.isPending).toBe(false);
    expect(state.orders).toEqual(fulfilledData.orders);
    expect(state.total).toBe(fulfilledData.total);
    expect(state.totalToday).toBe(fulfilledData.totalToday);
  });

  test('Экшен Rejected', () => {
    const action = {
      type: requestFeed.rejected.type,
      payload: { message: 'Ошибка получения ленты заказов' }
    };
    const state = feedReducer(feedInitialState, action);

    expect(state.error).toBe(action.payload.message);
    expect(state.isPending).toBe(false);
  });
});
