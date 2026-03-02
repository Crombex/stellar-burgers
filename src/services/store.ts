import { configureStore, combineSlices } from '@reduxjs/toolkit';
import {
  feedSlice,
  ingredientsSlice,
  userSlice,
  burgerConstructorSlice
} from '@slices';
import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  userSlice,
  burgerConstructorSlice
);
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
