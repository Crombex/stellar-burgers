import {
  requestIngredients,
  ingredientsSlice,
  ingredientsInitialState
} from '@slices';
const ingredientsReducer = ingredientsSlice.reducer;

describe('Тесты асинхронных экшенов каталога ингредиентов', () => {
  test('Экшен Pending', () => {
    const state = ingredientsReducer(
      ingredientsInitialState,
      requestIngredients.pending('')
    );

    expect(state.isPending).toBe(true);
    expect(state.error).toBe(null);
  });

  test('Экшен Fulfilled', () => {
    const fulfilledData = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      }
    ];

    const state = ingredientsReducer(
      ingredientsInitialState,
      requestIngredients.fulfilled(fulfilledData, '')
    );

    expect(state.isPending).toBe(false);
    expect(state.items).toEqual(fulfilledData);
  });

  test('Экшен Regected', () => {
    const action = {
      type: requestIngredients.rejected.type,
      payload: { message: 'Ошибка получения ингредиентов' }
    };
    const state = ingredientsReducer(ingredientsInitialState, action);

    expect(state.error).toBe(action.payload.message);
    expect(state.isPending).toBe(false);
  });
});
