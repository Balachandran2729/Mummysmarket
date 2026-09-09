import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getApiBaseUrl } from '../common/api';

const USER_NAME_KEY = 'user_name';
const USER_ID_KEY = 'user_id';
const API_BASE_URL = getApiBaseUrl();
const REGISTER_TOKEN_URL = `${API_BASE_URL}/drupal/web/api/notifications/register-token`;

export async function registerForPushNotificationsAsync() {
  try {
    // 1. Make sure it is a physical device
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // 2. Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // 3. Check current permission
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // 4. Ask permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    // 5. User denied permission
    if (finalStatus !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // 6. Get Expo project ID
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error('Expo projectId not found');
    }

    // 7. Get Expo Push Token
    const token =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    console.log('Expo Push Token:', token.data);

    return token.data;
  } catch (error) {
    console.log('Push notification registration unavailable:', error);
    return null;
  }
}

export async function registerDeviceToken(token: string) {
  if (!token) {
    return false;
  }

  const storedName = await AsyncStorage.getItem(USER_NAME_KEY);
  const storedId = await AsyncStorage.getItem(USER_ID_KEY);
  const accessToken = await AsyncStorage.getItem('access_token');

  if (!storedName && !storedId) {
    console.log('Skipping notification token registration because no logged-in user is available.');
    return false;
  }

  if (!accessToken) {
    console.log('Skipping notification token registration because no JWT token is available.');
    return false;
  }

  const device = Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Unknown';
  const payload = {
    name: storedName ?? storedId ?? '',
    id: storedId ?? storedName ?? '',
    device,
    token,
  };

  try {
    const response = await axios.post(REGISTER_TOKEN_URL, payload, {
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Notification token registered successfully:', response.status);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.log('Notification token registration failed:', error);
    return false;
  }
}