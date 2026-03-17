import {
  addIngredient,
  removeIngredient,
  moveIngredient,
  burgerConstructorSlice,
  burgerConstructorInitialState,
  createOrder
} from '@slices';

const burgerConstructorReducer = burgerConstructorSlice.reducer;

describe('Проверка burgerConstructorSlice', () => {
  describe('Изменение бургер - конструктора', () => {
    test('Добавить ингредиент', () => {
      const newState = burgerConstructorReducer(
        burgerConstructorInitialState,
        addIngredient({
          _id: '643d69a5c3f7b9001cfa0940',
          name: 'Говяжий метеорит (отбивная)',
          type: 'main',
          proteins: 800,
          fat: 800,
          carbohydrates: 300,
          calories: 2674,
          price: 3000,
          image: 'https://code.s3.yandex.net/react/code/meat-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
        })
      );

      const { ingredients } = newState;
      expect(ingredients).toHaveLength(1);
      expect(ingredients[0]).toEqual(
        expect.objectContaining({
          _id: '643d69a5c3f7b9001cfa0940',
          name: 'Говяжий метеорит (отбивная)',
          type: 'main',
          proteins: 800,
          fat: 800,
          carbohydrates: 300,
          calories: 2674,
          price: 3000,
          image: 'https://code.s3.yandex.net/react/code/meat-04.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/meat-04-large.png',
          id: expect.any(String)
        })
      );
    });

    test('Удалить ингредиент', () => {
      const newState = burgerConstructorReducer(
        {
          ...burgerConstructorInitialState,
          ingredients: [
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
              image_mobile:
                'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/meat-04-large.png',
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
            {
              _id: '643d69a5c3f7b9001cfa093e',
              id: '09817645263998612',
              name: 'Филе Люминесцентного тетраодонтимформа',
              type: 'main',
              proteins: 44,
              fat: 26,
              carbohydrates: 85,
              calories: 643,
              price: 988,
              image: 'https://code.s3.yandex.net/react/code/meat-03.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/meat-03-large.png'
            },
            {
              _id: '643d69a5c3f7b9001cfa0942',
              id: '15075627516556152',
              name: 'Соус Spicy-X',
              type: 'sauce',
              proteins: 30,
              fat: 20,
              carbohydrates: 40,
              calories: 30,
              price: 90,
              image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
              image_mobile:
                'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/sauce-02-large.png'
            }
          ]
        },
        moveIngredient({ direction: 1, id: '09817645263998612' })
      );

      const { ingredients } = newState;
      expect(ingredients).toEqual([
        {
          _id: '643d69a5c3f7b9001cfa0942',
          id: '15075627516556152',
          name: 'Соус Spicy-X',
          type: 'sauce',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png'
        },
        {
          _id: '643d69a5c3f7b9001cfa093e',
          id: '09817645263998612',
          name: 'Филе Люминесцентного тетраодонтимформа',
          type: 'main',
          proteins: 44,
          fat: 26,
          carbohydrates: 85,
          calories: 643,
          price: 988,
          image: 'https://code.s3.yandex.net/react/code/meat-03.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
        }
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
          ingredients: [
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
              image_mobile:
                'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/meat-03-large.png',
              __v: 0
            },
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
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              __v: 0
            },
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
              image_mobile:
                'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
              image_large:
                'https://code.s3.yandex.net/react/code/bun-02-large.png',
              __v: 0
            }
          ],
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
          price: 3498
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
