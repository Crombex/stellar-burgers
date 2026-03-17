import {
  requestUser,
  userSlice,
  userInitialState,
  requestUserOrders
} from '@slices';
const userReducer = userSlice.reducer;

describe('Проверка userSlice', () => {
  describe('Запрос пользователя', () => {
    test('Экшен Pending', () => {
      const state = userReducer(userInitialState, requestUser.pending(''));

      expect(state.userPending).toBe(true);
      expect(state.userError).toBe(null);
      expect(state.isAuthChecked).toBe(false);
    });

    test('Экшен Fulfilled', () => {
      const fulfilledData = {
        email: 'test@test.ru',
        name: 'test user'
      };

      const state = userReducer(
        userInitialState,
        requestUser.fulfilled(fulfilledData, '')
      );

      expect(state.userPending).toBe(false);
      expect(state.user).toEqual(fulfilledData);
      expect(state.isAuthChecked).toBe(true);
    });

    test('Экшен Rejected', () => {
      const action = {
        type: requestUser.rejected.type,
        payload: { message: 'Ошибка получения данных пользователя' }
      };
      const state = userReducer(userInitialState, action);

      expect(state.userError).toBe(action.payload.message);
      expect(state.userPending).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Запрос заказов пользователя', () => {
    test('Экшен Pending', () => {
      const state = userReducer(
        userInitialState,
        requestUserOrders.pending('')
      );

      expect(state.ordersPending).toBe(true);
      expect(state.ordersError).toBe(null);
    });

    test('Экшен Fulfilled', () => {
      const fulfilledData = [
        {
          _id: '69a09f29a64177001b32dba0',
          ingredients: [
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Био-марсианский люминесцентный краторный бургер',
          createdAt: '2026-02-26T19:29:45.776Z',
          updatedAt: '2026-02-26T19:29:45.990Z',
          number: 101920
        },
        {
          _id: '69a0a1b8a64177001b32dbc6',
          ingredients: [
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa0947',
            '643d69a5c3f7b9001cfa0942',
            '643d69a5c3f7b9001cfa0943',
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Space spicy фалленианский флюоресцентный люминесцентный бургер',
          createdAt: '2026-02-26T19:40:40.382Z',
          updatedAt: '2026-02-26T19:40:40.583Z',
          number: 101923
        }
      ];

      const state = userReducer(
        userInitialState,
        requestUserOrders.fulfilled(fulfilledData, '')
      );

      expect(state.ordersPending).toBe(false);
      expect(state.orders).toEqual(fulfilledData);
    });

    test('Экшен Rejected', () => {
      const action = {
        type: requestUserOrders.rejected.type,
        payload: { message: 'Ошибка получения заказов пользователя' }
      };
      const state = userReducer(userInitialState, action);

      expect(state.ordersError).toBe(action.payload.message);
      expect(state.ordersPending).toBe(false);
      expect(state.orders).toEqual([]);
    });
  });
});
