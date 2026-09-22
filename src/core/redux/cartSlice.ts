import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../common/api';
import type { Product } from './datatype';
import type { AppDispatch, RootState } from './store';
import { fetchProducts } from './productSlice';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartApiBaseUrl = `${getApiBaseUrl()}/drupal/web/api/user-crud`;

// Shape of one product entry inside GET get-cart-apps-data
interface CartApiProduct {
  id: number;
  title: string;
  image: string[];
  count: number;
  offer: number;
  offer_price: number;
  Real_price: number;
  'Total amount': number;
}

interface CartApiResponse {
  cart: {
    products: CartApiProduct[];
    'total prodects': number;
    'total prodects Items': number;
    total_amount: number;
  };
}

const buildFallbackProduct = (item: CartApiProduct): Product => ({
  id: String(item.id),
  title: item.title,
  description: '',
  category: '',
  manufacturer: '',
  photos: JSON.stringify(item.image ?? []),
  quantity: '0',
  available: '0',
  sales: '0',
  offer: String(item.offer ?? 0),
  amount: String(item.Real_price ?? item.offer_price ?? 0),
  offer_price: String(item.offer_price ?? 0),
  created_at: '',
  updated_at: '',
});

const mapCartItem = (item: CartApiProduct, products: Product[] = []): CartItem => {
  const matchingProduct = products.find((product) => product.id === String(item.id));

  return {
    product: matchingProduct
      ? {
          ...matchingProduct,
          title: item.title,
          offer: String(item.offer ?? matchingProduct.offer),
          offer_price: String(item.offer_price ?? matchingProduct.offer_price),
          amount: String(item.Real_price ?? matchingProduct.amount),
        }
      : buildFallbackProduct(item),
    quantity: item.count,
  };
};

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
    decreaseQuantityInState(state, action: PayloadAction<string>) {
      const existing = state.items.find((i) => i.product.id === action.payload);
      if (!existing) return;
      if (existing.quantity <= 1) {
        state.items = state.items.filter((i) => i.product.id !== action.payload);
      } else {
        existing.quantity -= 1;
      }
    },
    removeFromCartInState(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
  },
});

export const { setCart, addToCartInState, decreaseQuantityInState, removeFromCartInState } =
  cartSlice.actions;
export default cartSlice.reducer;

const getAuthHeaders = async () => {
  const accessToken = await AsyncStorage.getItem('access_token');

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

export const loadCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get<CartApiResponse>(
      `${cartApiBaseUrl}/get-cart-apps-data`,
      { headers }
    );

    let products = getState().products.data?.products ?? [];

    if (products.length === 0) {
      const productResponse = await dispatch(fetchProducts({ limit: 1000, skip: 0 })).unwrap();
      products = productResponse.products ?? [];
    }

    const mappedItems = (response.data.cart?.products ?? []).map((item) =>
      mapCartItem(item, products)
    );

    dispatch(setCart(mappedItems));
  } catch (e) {
    console.log('Failed to load cart from API', e);
  }
};

const syncCartAfterMutation = async (dispatch: AppDispatch) => {
  await dispatch(loadCart());
};

export const addToCart =
  (product: Product) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const headers = await getAuthHeaders();
      const existingItem = getState().cart.items.find((item) => item.product.id === product.id);

      if (existingItem) {
        await axios.patch(
          `${cartApiBaseUrl}/update-cart-apps-data/${product.id}`,
          { count: existingItem.quantity + 1 },
          { headers }
        );
      } else {
        await axios.post(
          `${cartApiBaseUrl}/create-cart-apps-data`,
          { id: Number(product.id), count: 1 },
          { headers }
        );
      }

      await syncCartAfterMutation(dispatch);
    } catch (e) {
      console.log('Failed to add cart item to API', e);
    }
  };

export const decreaseQuantity =
  (productId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const currentItem = getState().cart.items.find((item) => item.product.id === productId);

      if (!currentItem) {
        return;
      }

      const headers = await getAuthHeaders();

      if (currentItem.quantity <= 1) {
        await axios.delete(`${cartApiBaseUrl}/delete-cart-apps-data/${productId}`, { headers });
      } else {
        await axios.patch(
          `${cartApiBaseUrl}/update-cart-apps-data/${productId}`,
          { count: currentItem.quantity - 1 },
          { headers }
        );
      }

      await syncCartAfterMutation(dispatch);
    } catch (e) {
      console.log('Failed to decrease cart item quantity', e);
    }
  };

export const removeFromCart =
  (productId: string) => async (dispatch: AppDispatch) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${cartApiBaseUrl}/delete-cart-apps-data/${productId}`, { headers });

      await syncCartAfterMutation(dispatch);
    } catch (e) {
      console.log('Failed to remove cart item from API', e);
    }
  };