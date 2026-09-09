import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from '../common/api';
import type { Product } from './datatype';
import type { AppDispatch, RootState } from './store';
import { fetchProducts } from './productSlice';
import {
  cartQueryKeys,
  queryClient,
  type CartApiItem,
  fetchCartApi,
} from '../react-query/cartQuery';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartApiBaseUrl = `${getApiBaseUrl()}/drupal/web/api/user-crud`;

const buildFallbackProduct = (item: CartApiItem): Product => ({
  id: item.id,
  title: item.title,
  description: '',
  category: '',
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  tags: [],
  brand: '',
  sku: '',
  weight: 0,
  dimensions: { width: 0, height: 0, depth: 0 },
  reviews: [],
  thumbnail: item.image,
  images: [item.image],
});

const mapCartItem = (item: CartApiItem, products: Product[] = []): CartItem => {
  const matchingProduct = products.find((product) => product.id === item.id);

  return {
    product: {
      ...(matchingProduct ?? buildFallbackProduct(item)),
      title: item.title,
      thumbnail: item.image || matchingProduct?.thumbnail || '',
      images: matchingProduct?.images ?? [item.image],
    },
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
    decreaseQuantityInState(state, action: PayloadAction<number>) {
      const existing = state.items.find((i) => i.product.id === action.payload);
      if (!existing) return;
      if (existing.quantity <= 1) {
        state.items = state.items.filter((i) => i.product.id !== action.payload);
      } else {
        existing.quantity -= 1;
      }
    },
    removeFromCartInState(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
    },
  },
});

export const { setCart, addToCartInState, decreaseQuantityInState, removeFromCartInState } =
  cartSlice.actions;
export default cartSlice.reducer;

export const loadCart = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const response = await queryClient.fetchQuery({
      queryKey: cartQueryKeys.list(),
      queryFn: fetchCartApi,
    });

    let products = getState().products.data?.products ?? [];

    if (products.length === 0) {
      const productResponse = await dispatch(fetchProducts({ limit: 1000, skip: 0 })).unwrap();
      products = productResponse.products ?? [];
    }

    const mappedItems = response.cart.map((item) => mapCartItem(item, products));

    dispatch(setCart(mappedItems));
  } catch (e) {
    console.log('Failed to load cart from API', e);
  }
};

const getAuthHeaders = async () => {
  const accessToken = await AsyncStorage.getItem('access_token');

  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const createCartItemPayload = (product: Product) => ({
  id: product.id,
  title: product.title,
  image: product.thumbnail ?? product.images?.[0] ?? '',
});

const syncCartAfterMutation = async (dispatch: AppDispatch) => {
  await queryClient.invalidateQueries({ queryKey: cartQueryKeys.list() });
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
          createCartItemPayload(product),
          { headers }
        );
      }

      await syncCartAfterMutation(dispatch);
    } catch (e) {
      console.log('Failed to add cart item to API', e);
    }
  };

export const decreaseQuantity =
  (productId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
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
  (productId: number) => async (dispatch: AppDispatch) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${cartApiBaseUrl}/delete-cart-apps-data/${productId}`, { headers });

      await syncCartAfterMutation(dispatch);
    } catch (e) {
      console.log('Failed to remove cart item from API', e);
    }
  };