import { Platform } from 'react-native';

const normalizeBaseUrl = (url?: string): string => {
  if (!url) {
    return '';
  }

  return url.trim().replace(/\/$/, '');
};

export const getApiBaseUrl = (): string => {
  const configuredBaseUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2'
    : 'http://localhost';
};
