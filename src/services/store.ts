import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/user-slice';
import { ingredientsSlice } from './slices/ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { ordersSlice } from './slices/orders-slice';

const rootReducer = combineSlices(
  userSlice,
  ingredientsSlice,
  constructorSlice,
  ordersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () => dispatchHook();
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
