import { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { router } from 'expo-router';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const T = {
  canvas:    '#F7F5F2',
  paper:     '#FFFFFF',
  ink:       '#1A1714',
  inkSub:    '#6B6560',
  inkGhost:  '#B0AAA4',
  rule:      '#E8E4DF',
  accent:    '#2D5BE3',
  accentDim: '#2D5BE308',
};

const R = 14;

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

function Divider() {
  return <View style={s.divider} />;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.data.token, response.data.user);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Sign in failed', error?.response?.data?.error || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.inner}>

          {/* Wordmark */}
          <View style={s.wordmarkBlock}>
            <Text style={s.wordmark}>EduTrust</Text>
            <Text style={s.tagline}>Verified credentials, trusted network</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Label>Email address</Label>
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor={T.inkGhost}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              style={s.input}
            />

            <View style={{ height: 20 }} />

            <Label>Password</Label>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={T.inkGhost}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              style={s.input}
            />

            <Divider />

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              style={[s.btn, loading && s.btnDisabled]}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <TouchableOpacity
            onPress={() => router.push('/register')}
            activeOpacity={0.6}
            style={s.linkRow}
          >
            <Text style={s.linkText}>
              New to EduTrust?{'  '}
              <Text style={s.linkAccent}>Create an account</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.canvas },
  kav:  { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },

  wordmarkBlock: {
    marginBottom: 40,
  },
  wordmark: {
    fontSize: 36,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: T.inkGhost,
    fontWeight: '400',
  },

  card: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 24,
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: T.inkSub,
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: T.ink,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
  },
  divider: {
    height: 1,
    backgroundColor: T.rule,
    marginVertical: 22,
  },

  btn: {
    backgroundColor: T.accent,
    borderRadius: R,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  linkRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    color: T.inkSub,
  },
  linkAccent: {
    color: T.accent,
    fontWeight: '500',
  },
});