import { RootState } from '@services/store';

export const getIngredients = (state: RootState) => state.ingredients.items;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const getIngredientsIsPending = (state: RootState) =>
  state.ingredients.isPending;
export const getIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id);
