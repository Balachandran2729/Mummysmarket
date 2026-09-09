import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

const DEFAULT_API_BASE_URL = `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}`;
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
const CART_GET_URL = `${API_BASE_URL}/drupal/web/api/user-crud/get-cart-apps-data`;

export type CartApiItem = {
  id: number;
  title: string;
  image: string;
  count: number;
};

export type CartApiResponse = {
  cart: CartApiItem[];
};

export const queryClient = new QueryClient();

export const cartQueryKeys = {
  all: ['cart'],
  list: () => [...cartQueryKeys.all, 'list'],
};

export const fetchCartApi = async (): Promise<CartApiResponse> => {
  const accessToken = await AsyncStorage.getItem('access_token');

  const response = await axios.get<CartApiResponse>(CART_GET_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const useCartQuery = () =>
  useQuery({
    queryKey: cartQueryKeys.list(),
    queryFn: fetchCartApi,
    staleTime: 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    retry: 1,
  });
