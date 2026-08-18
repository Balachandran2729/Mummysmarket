import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import favoritesReducer from './favoritesSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;