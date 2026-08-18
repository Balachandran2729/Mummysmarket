import type { Product } from '../redux';

export type AppStackParamList = {
  MainTabs: undefined;
  ProductDetails: { product: Product };
  SaveProduct: undefined;
};

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
};