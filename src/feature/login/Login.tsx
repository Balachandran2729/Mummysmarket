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

type LoginProps = StackScreenProps<AppStackParamList, 'Login'>;

const Login = ({ navigation }: LoginProps) => {
  const posthog = usePostHog();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username !== 'Admin123' || password !== 'Admin@123') {
      setError('Enter the test username and password.');
      return;
    }

    const user = {
      id: username,
      email: 'admin@mummysmarket.test',
      name: 'Admin',
    };

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
    });

    posthog.capture('User_logged_in', {
      user_id: user.id,
      email: user.email,
      name: user.name,
    });

    console.log('User logged in');

    navigation.replace('MainTabs');
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
            className="mt-6 items-center rounded-xl py-3"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="font-semibold text-white">Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
