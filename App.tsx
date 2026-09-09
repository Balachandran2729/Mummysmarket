import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/core/redux';
import { AppNavigator } from './src/core/navigation/TabNavigation';
import { PostHogProvider } from 'posthog-react-native';
import { queryClient } from './src/core/react-query/cartQuery';

export default function App() {
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
