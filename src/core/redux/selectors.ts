import { RootState } from './store';
import type { Product } from './datatype';

const EMPTY_PRODUCTS: Product[] = [];

export const selectProducts = (state: RootState) =>
  state.products.data?.products ?? EMPTY_PRODUCTS;

export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsData = (state: RootState) => state.products.data;
export const selectProductsTotal = (state: RootState) => state.products.data?.total ?? 0;
export const selectProductsSkip = (state: RootState) => state.products.data?.skip ?? 0;
export const selectProductsLimit = (state: RootState) => state.products.data?.limit ?? 10;

// Favorites
export const selectIsFavorite = (id: number) => (state: RootState) =>
  state.favorites.items.some((p) => p.id === id);
export const selectFavoriteCount = (state: RootState) => state.favorites.items.length;

// Cart
export const selectCartQuantity = (id: number) => (state: RootState) =>
  state.cart.items.find((i) => i.product.id === id)?.quantity ?? 0;
export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);