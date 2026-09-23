import type { Product } from '../redux';

export type AppStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  ProductDetails: { product: Product };
  SaveProduct: undefined;
  CashbackDetails : undefined ; 
};

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
};