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

export default function RegisterScreen() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      Alert.alert('Account created', 'You can now sign in with your credentials.', [
        { text: 'Sign in', onPress: () => router.replace('/login') },
      ]);
    } catch (error: any) {
      Alert.alert('Registration failed', error?.response?.data?.error || 'Please try again.');
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
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
              style={s.input}
            />

            <View style={{ height: 22 }} />
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

            <View style={{ height: 22 }} />
            <Label>Password</Label>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={T.inkGhost}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={register}
              style={s.input}
            />

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

  linkRow: { alignItems: 'center', paddingVertical: 4 },
  linkText: { fontSize: 14, color: T.inkSub },
  linkAccent: { color: T.accent, fontWeight: '500' },
});