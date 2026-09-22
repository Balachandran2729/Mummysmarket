import { RootState } from './store';
import type { Product } from './datatype';

const EMPTY_PRODUCTS: Product[] = [];

export const selectProducts = (state: RootState) =>
  state.products.data?.products ?? EMPTY_PRODUCTS;

export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsData = (state: RootState) => state.products.data;
export const selectProductsTotal = (state: RootState) =>
  state.products.data?.total_products ?? 0;

// Favorites
export const selectIsFavorite = (id: string) => (state: RootState) =>
  state.favorites.items.some((p) => p.id === id);
export const selectFavoriteCount = (state: RootState) => state.favorites.items.length;

// Cart
export const selectCartQuantity = (id: string) => (state: RootState) =>
  state.cart.items.find((i) => i.product.id === id)?.quantity ?? 0;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

// ...keep everything already there, add:

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (sum, i) => sum + parseFloat(i.product.offer_price) * i.quantity,
    0
  );

export const selectFavoriteItems = (state: RootState) => state.favorites.items;