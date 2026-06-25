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

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [emailError,  setEmailError]  = useState('');
  const [passError,   setPassError]   = useState('');

  const validateFields = () => {
    let valid = true;
    setEmailError('');
    setPassError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password.trim()) {
      setPassError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPassError('Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.data.token, response.data.user);
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Please check your credentials and try again.';
      if (errorMsg.toLowerCase().includes('not found') || errorMsg.toLowerCase().includes('no user')) {
        setEmailError('No account found with this email');
      } else if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('invalid')) {
        setPassError('Incorrect password');
      } else {
        Alert.alert('Sign in failed', errorMsg);
      }
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
              onChangeText={(val) => {
                setEmail(val);
                if (emailError) setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              style={[s.input, emailError && s.inputError]}
            />
            {emailError ? <Text style={s.errorText}>{emailError}</Text> : <View style={{ height: 20 }} />}

            <View style={{ height: 12 }} />

            <Label>Password</Label>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={T.inkGhost}
              secureTextEntry
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (passError) setPassError('');
              }}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              style={[s.input, passError && s.inputError]}
            />
            {passError ? <Text style={s.errorText}>{passError}</Text> : <View style={{ height: 20 }} />}

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
  inputError: {
    borderBottomColor: '#C0392B',
  },
  errorText: {
    fontSize: 12,
    color: '#C0392B',
    marginTop: 6,
    marginBottom: 14,
    fontWeight: '500',
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