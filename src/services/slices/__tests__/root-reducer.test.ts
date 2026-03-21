import { rootReducer } from '@services/store';

import {
  feedInitialState,
  userInitialState,
  ingredientsInitialState,
  burgerConstructorInitialState
} from '@slices';

test('Проверка rootReducer', () => {
  const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

  expect(state).toEqual({
    user: userInitialState,
    ingredients: ingredientsInitialState,
    feed: feedInitialState,
    burgerConstructor: burgerConstructorInitialState
  });
});
