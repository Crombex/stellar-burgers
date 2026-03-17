import { configureStore, combineReducers } from '@reduxjs/toolkit';
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

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  feed: feedSlice.reducer,
  user: userSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer
});
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
