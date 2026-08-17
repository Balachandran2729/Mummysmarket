import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/core/redux';
import { AppNavigator } from './src/core/navigation/TabNavigation';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
