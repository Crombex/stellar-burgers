import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  burgerConstructorSlice,
  burgerConstructorInitialState,
  createOrder
} from '@slices';

const burgerConstructorReducer = burgerConstructorSlice.reducer;
const mockIngredientsData = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react/code/meat-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
  }
];

describe('Проверка burgerConstructorSlice', () => {
  describe('Изменение бургер - конструктора', () => {
    test('Добавить ингредиент', () => {
      const newState = burgerConstructorReducer(
        burgerConstructorInitialState,
        addIngredient(mockIngredientsData[0])
      );

      const { ingredients } = newState;
      expect(ingredients).toHaveLength(1);
      expect(ingredients[0]).toEqual({
        ...mockIngredientsData[0],
        id: expect.any(String)
      });
    });

    test('Удалить ингредиент', () => {
      const newState = burgerConstructorReducer(
        {
          ...burgerConstructorInitialState,
          ingredients: [
            {
              ...mockIngredientsData[0],
              id: '12345678912345678'
            }
          ]
        },
        removeIngredient('12345678912345678')
      );

      const { ingredients } = newState;
      expect(ingredients).toHaveLength(0);
    });
    test('Переместить ингредиент', () => {
      const newState = burgerConstructorReducer(
        {
          ...burgerConstructorInitialState,
          ingredients: [
            { ...mockIngredientsData[0], id: '09817645263998612' },
            { ...mockIngredientsData[1], id: '12345678901234567' }
          ]
        },
        moveIngredient({ direction: 1, id: '09817645263998612' })
      );

      const { ingredients } = newState;
      expect(ingredients).toEqual([
        { ...mockIngredientsData[1], id: '12345678901234567' },
        { ...mockIngredientsData[0], id: '09817645263998612' }
      ]);
    });
  });

  describe('Отправка заказа', () => {
    test('Экшен Pending', () => {
      const state = burgerConstructorReducer(
        burgerConstructorInitialState,
        createOrder.pending('', [])
      );

      expect(state.isOrderSending).toBe(true);
      expect(state.error).toBe(null);
    });

    test('Экшен Fulfilled', () => {
      const fulfilledData = {
        success: true,
        name: 'Люминесцентный краторный бургер',
        order: {
          ingredients: mockIngredientsData,
          _id: '69b714c6a64177001b32fc2a',
          owner: {
            name: 'test user',
            email: 'test@test.ru',
            createdAt: '2026-02-26T19:29:35.857Z',
            updatedAt: '2026-02-27T18:09:08.334Z'
          },
          status: 'done',
          name: 'Люминесцентный краторный бургер',
          createdAt: '2026-03-15T20:21:26.762Z',
          updatedAt: '2026-03-15T20:21:27.007Z',
          number: 102907,
          price: 3988
        }
      };

      const state = burgerConstructorReducer(
        burgerConstructorInitialState,
        createOrder.fulfilled(fulfilledData, '', [])
      );

      expect(state.isOrderSending).toBe(false);
      expect(state.orderResponse).toEqual(fulfilledData.order);
      expect(state.ingredients).toEqual([]);
      expect(state.bun).toBeNull();
    });

    test('Экшен Rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: { message: 'Ошибка при отправке заказа' }
      };
      const state = burgerConstructorReducer(
        burgerConstructorInitialState,
        action
      );

      expect(state.error).toBe(action.payload.message);
      expect(state.isOrderSending).toBe(false);
    });
  });
});
