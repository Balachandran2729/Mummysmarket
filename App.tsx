import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/core/redux';
import { AppNavigator } from './src/core/navigation/TabNavigation';
import { PostHogProvider } from 'posthog-react-native';


export default function App() {
  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY}
      options={{
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
      }}
    >
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </PostHogProvider>
  );
}
