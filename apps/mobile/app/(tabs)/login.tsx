import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const handleLogin =
    async () => {
      try {
        const response =
          await api.post(
            '/auth/login',
            {
              email,
              password,
            }
          );

        await login(
          response.data.token,
          response.data.user
        );

        router.replace(
          '/(tabs)/home'
        );

      } catch (error: any) {
        Alert.alert(
          'Login Failed',
          error?.response?.data?.error ||
            'Something went wrong'
        );
      }
    };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F5F7FB',
      }}
    >
      <Text
        style={{
          fontSize: 34,
          fontWeight: 'bold',
          marginBottom: 24,
        }}
      >
        EduTrust Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#111827',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: '600',
          }}
        >
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          router.push('/register')
        }
      >
        <Text
          style={{
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}