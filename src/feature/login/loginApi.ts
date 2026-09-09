import axios from 'axios';
import { getApiBaseUrl } from '../../core/common/api';

const API_BASE_URL = getApiBaseUrl();
const LOGIN_URL = `${API_BASE_URL}/drupal/web/api/user-crud/user-login`;

export type LoginResponse = {
  message?: string;
  error?: string;
  access_token: string;
  refresh_token: string;
};

export const login = async (name: string, password: string): Promise<LoginResponse> => {
  console.log('[LoginAPI] Requesting URL:', LOGIN_URL);

  const response = await axios.post<LoginResponse>(
    LOGIN_URL,
    {
      name,
      password,
    },
    { timeout: 10000 },
  );

  if (!response.data?.access_token || !response.data?.refresh_token) {
    const apiMessage =
      response.data?.message ||
      response.data?.error ||
      'Login response did not contain access and refresh tokens.';

    throw new Error(apiMessage);
  }

  return response.data;
};