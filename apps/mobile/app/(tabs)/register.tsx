import { useState } from 'react';

import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

import api from '../../services/api';

export default function RegisterScreen() {
  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const registerUser =
    async () => {
      try {
        await api.post(
          '/auth/register',
          {
            name,
            email,
            password,
          }
        );

        Alert.alert(
          'Success',
          'Account Created'
        );

        router.replace(
          '/login'
        );

      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.response?.data?.error ||
            'Registration Failed'
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
        Create Account
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

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
        onPress={registerUser}
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
          Register
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}