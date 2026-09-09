import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePostHog } from 'posthog-react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { AppStackParamList } from '../../core/navigation/types';
import { COLORS } from '../../core/common/colour';
import { login } from './loginApi';
import { registerDeviceToken, registerForPushNotificationsAsync } from '../../core/services/notificationService';

type LoginProps = StackScreenProps<AppStackParamList, 'Login'>;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_NAME_KEY = 'user_name';
const USER_ID_KEY = 'user_id';

const Login = ({ navigation }: LoginProps) => {
  const posthog = usePostHog();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await login(username.trim(), password);

      const normalizedUsername = username.trim();

      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, response.access_token],
        [REFRESH_TOKEN_KEY, response.refresh_token],
        [USER_NAME_KEY, normalizedUsername],
        [USER_ID_KEY, normalizedUsername],
      ]);

      try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
          await registerDeviceToken(token);
        }
      } catch (notificationError) {
        console.log('Push notification registration skipped:', notificationError);
      }

      posthog.identify(normalizedUsername);
      posthog.capture('User_logged_in', { user_id: normalizedUsername });
      navigation.replace('MainTabs');
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const apiMessage = requestError.response?.data?.message || requestError.response?.data?.error;

        setError(
          apiMessage ||
            (requestError.code === 'ERR_NETWORK'
              ? 'Cannot reach the login server. Check that Drupal is running and the device is on the same network.'
              : 'Unable to log in. Check your credentials and try again.'),
        );
      } else if (requestError instanceof Error && requestError.message) {
        setError(requestError.message);
      } else {
        setError('Unable to log in. Check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          className="rounded-2xl p-6"
          style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }}
        >
          <Text className="text-2xl font-bold" style={{ color: COLORS.text }}>
            Welcome back
          </Text>
          <Text className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
            Sign in to continue to MummysMarket.
          </Text>

          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            className="mt-6 rounded-xl px-4 py-3"
            style={{ color: COLORS.text, borderWidth: 1, borderColor: COLORS.border }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            className="mt-3 rounded-xl px-4 py-3"
            style={{ color: COLORS.text, borderWidth: 1, borderColor: COLORS.border }}
          />

          {error ? (
            <Text className="mt-3 text-sm" style={{ color: COLORS.error }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="mt-6 items-center rounded-xl py-3"
            style={{ backgroundColor: COLORS.primary, opacity: isLoading ? 0.7 : 1 }}
          >
            <Text className="font-semibold text-white">{isLoading ? 'Logging in...' : 'Log in'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
