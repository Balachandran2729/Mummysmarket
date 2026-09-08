import axios from 'axios';
import { Platform } from 'react-native';

const DEFAULT_API_BASE_URL = `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}`;
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
const LOGIN_URL = `${API_BASE_URL}/drupal/web/api/user-crud/user-login`;

export type LoginResponse = {
  message: string;
  access_token: string;
  refresh_token: string;
};

export const login = async (name: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    LOGIN_URL,
    {
      name,
      password,
    },
    { timeout: 10000 },
  );

  if (!response.data?.access_token || !response.data?.refresh_token) {
    throw new Error('Login response did not contain access and refresh tokens.');
  }

  return response.data;
};