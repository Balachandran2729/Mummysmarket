import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from './datatype';
import type { AppDispatch, RootState } from './store';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };
const CART_KEY = '@mummysmarket/cart';

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCartInState(state, action: PayloadAction<Product>) {
      const existing = state.items.find((i) => i.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCartInState(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
  },
});

export const { setCart, addToCartInState, removeFromCartInState } = cartSlice.actions;
export default cartSlice.reducer;

export const loadCart = () => async (dispatch: AppDispatch) => {
  try {
    const raw = await AsyncStorage.getItem(CART_KEY);
    if (raw) dispatch(setCart(JSON.parse(raw)));
  } catch (e) {
    console.log('Failed to load cart', e);
  }
};

const persistCart = async (getState: () => RootState) => {
  try {
    const { cart } = getState();
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart.items));
  } catch (e) {
    console.log('Failed to persist cart', e);
  }
};

export const addToCart =
  (product: Product) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(addToCartInState(product));
    await persistCart(getState);
  };

export const removeFromCart =
  (productId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(removeFromCartInState(productId));
    await persistCart(getState);
  };