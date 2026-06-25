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
  ScrollView,
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
};

const R = 14;

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const T_DANGER = '#C0392B';

export default function RegisterScreen() {
  const { login } = useAuth();
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [nameError,  setNameError]  = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError,  setPassError]  = useState('');

  const validateFields = () => {
    let valid = true;
    setNameError('');
    setEmailError('');
    setPassError('');

    if (!name.trim()) {
      setNameError('Full name is required');
      valid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      valid = false;
    }

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPassError('Password must contain uppercase and lowercase letters');
      valid = false;
    }

    return valid;
  };

  const register = async () => {
    if (!validateFields()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.token && response.data.user) {
        await login(response.data.token, response.data.user);
        router.replace('/(tabs)/profile');
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Please try again.';
      if (errorMsg.toLowerCase().includes('email') || errorMsg.toLowerCase().includes('already')) {
        setEmailError('Email already in use');
      } else {
        Alert.alert('Registration failed', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={s.header}>
            <Text style={s.eyebrow}>EduTrust</Text>
            <Text style={s.title}>Create account</Text>
            <Text style={s.sub}>Join the verified professional network</Text>
          </View>

          {/* Form */}
          <View style={s.card}>
            <Label>Full name</Label>
            <TextInput
              placeholder="Jordan Lee"
              placeholderTextColor={T.inkGhost}
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (nameError) setNameError('');
              }}
              autoCapitalize="words"
              returnKeyType="next"
              style={[s.input, nameError && s.inputError]}
            />
            {nameError ? <Text style={s.errorText}>{nameError}</Text> : <View style={{ height: 22 }} />}

            <View style={{ height: 10 }} />
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
            {emailError ? <Text style={s.errorText}>{emailError}</Text> : <View style={{ height: 22 }} />}

            <View style={{ height: 10 }} />
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
              onSubmitEditing={register}
              style={[s.input, passError && s.inputError]}
            />
            {passError ? <Text style={s.errorText}>{passError}</Text> : <View style={{ height: 22 }} />}

            <View style={s.divider} />

            <TouchableOpacity
              onPress={register}
              activeOpacity={0.85}
              style={[s.btn, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Creating account…' : 'Create account'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sign in link */}
          <TouchableOpacity
            onPress={() => router.replace('/login')}
            activeOpacity={0.6}
            style={s.linkRow}
          >
            <Text style={s.linkText}>
              Already have an account?{'  '}
              <Text style={s.linkAccent}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 28, paddingBottom: 48, flexGrow: 1, justifyContent: 'center' },

  header: { marginBottom: 36 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.inkGhost,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: T.inkSub,
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
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  inputError: {
    borderBottomColor: T_DANGER,
  },
  errorText: {
    fontSize: 12,
    color: T_DANGER,
    marginTop: 6,
    marginBottom: 16,
    fontWeight: '500',
  },

  linkRow: { alignItems: 'center', paddingVertical: 4 },
  linkText: { fontSize: 14, color: T.inkSub },
  linkAccent: { color: T.accent, fontWeight: '500' },
});