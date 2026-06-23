import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import api from '../../services/api';

const T = {
  canvas:   '#F7F5F2',
  paper:    '#FFFFFF',
  ink:      '#1A1714',
  inkSub:   '#6B6560',
  inkGhost: '#B0AAA4',
  rule:     '#E8E4DF',
  accent:   '#2D5BE3',
  green:    '#2E7D52',
  greenDim: '#2E7D520C',
};

const R = 14;

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

export default function AddSkillScreen() {
  const [userName,  setUserName]  = useState('');
  const [skill,     setSkill]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [lastAdded, setLastAdded] = useState('');

  const addSkill = async () => {
    if (!userName.trim() || !skill.trim()) return;
    setLoading(true);
    try {
      await api.post(`/users/${encodeURIComponent(userName)}/skills`, { skill });
      setLastAdded(skill.trim());
      setSkill('');
    } catch {
      Alert.alert('Error', 'Failed to add skill. Please try again.');
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
        <View style={s.inner}>
          {/* Header */}
          <View style={s.pageHeader}>
            <Text style={s.eyebrow}>Skills</Text>
            <Text style={s.title}>Add a skill</Text>
          </View>

          {/* Form */}
          <View style={s.card}>
            <Label>Username</Label>
            <TextInput
              placeholder="Your username"
              placeholderTextColor={T.inkGhost}
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
              returnKeyType="next"
              style={s.input}
            />

            <View style={{ height: 22 }} />

            <Label>Skill name</Label>
            <TextInput
              placeholder="e.g. TypeScript"
              placeholderTextColor={T.inkGhost}
              value={skill}
              onChangeText={setSkill}
              returnKeyType="done"
              onSubmitEditing={addSkill}
              style={s.input}
            />

            <View style={s.divider} />

            <TouchableOpacity
              onPress={addSkill}
              activeOpacity={0.85}
              style={[s.btn, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              <Text style={s.btnText}>{loading ? 'Adding…' : 'Add skill'}</Text>
            </TouchableOpacity>
          </View>

          {/* Success notice */}
          {lastAdded ? (
            <View style={s.successCard}>
              <Text style={s.successText}>
                <Text style={s.successBold}>{lastAdded}</Text>
                {' '}was added successfully.
              </Text>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: T.canvas },
  inner: { flex: 1, padding: 24 },

  pageHeader: { marginBottom: 32 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.inkGhost,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.6,
  },

  card: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 24,
    marginBottom: 14,
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

  successCard: {
    backgroundColor: T.greenDim,
    borderWidth: 1,
    borderColor: T.green + '28',
    borderRadius: R,
    padding: 16,
  },
  successText: {
    fontSize: 14,
    color: T.green,
    lineHeight: 20,
  },
  successBold: { fontWeight: '600' },
});