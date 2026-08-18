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
