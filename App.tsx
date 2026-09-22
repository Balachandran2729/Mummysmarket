import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/core/redux';
import { AppNavigator } from './src/core/navigation/TabNavigation';
import { PostHogProvider } from 'posthog-react-native';
import { queryClient } from './src/core/react-query/cartQuery';
import {
  registerDeviceToken,
  registerForPushNotificationsAsync,
} from './src/core/services/notificationService';
import * as Notifications from 'expo-notifications';

export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async token => {
        if (token) {
          await registerDeviceToken(token);
        }
      })
      .catch(error => {
        console.log('Notification registration error:', error);
      });
  }, []);

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
      }}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </Provider>
    </PostHogProvider>
  );
}
