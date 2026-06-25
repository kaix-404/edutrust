import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  danger:   '#C0392B',
  dangerDim:'#C0392B08',
};

const R = 14;

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

  // Logged-in-as strip
  sessionCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionLabel: {
    fontSize: 12,
    color: T.inkGhost,
    fontWeight: '500',
  },
  sessionName: {
    fontSize: 15,
    color: T.ink,
    fontWeight: '600',
  },
  sessionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: T.green,
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

  errorCard: {
    backgroundColor: T.dangerDim,
    borderWidth: 1,
    borderColor: T.danger + '28',
    borderRadius: R,
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: T.danger,
    lineHeight: 20,
  },
});

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

export default function AddSkillScreen() {
  const { user } = useAuth();

  const [skill,     setSkill]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [lastAdded, setLastAdded] = useState('');
  const [error,     setError]     = useState('');

  const addSkill = async () => {
    if (!skill.trim()) return;
    if (!user?.name) {
      setError('No active session found. Please sign in again.');
      return;
    }

    setLoading(true);
    setLastAdded('');
    setError('');

    try {
      await api.post(`/users/${encodeURIComponent(user.name)}/skills`, { skill: skill.trim() });
      setLastAdded(skill.trim());
      setSkill('');
    } catch {
      setError('Failed to add skill. Please try again.');
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

          {/* Session indicator — shows who the skill will be added for */}
          <View style={s.sessionCard}>
            <View style={s.sessionDot} />
            <View>
              <Text style={s.sessionLabel}>Adding skill for</Text>
              <Text style={s.sessionName}>{user?.name ?? '—'}</Text>
            </View>
          </View>

          {/* Form — username field removed, pulled from session */}
          <View style={s.card}>
            <Label>Skill name</Label>
            <TextInput
              placeholder="e.g. TypeScript"
              placeholderTextColor={T.inkGhost}
              value={skill}
              onChangeText={v => { setSkill(v); setError(''); setLastAdded(''); }}
              returnKeyType="done"
              onSubmitEditing={addSkill}
              autoFocus
              style={s.input}
            />

            <View style={s.divider} />

            <TouchableOpacity
              onPress={addSkill}
              activeOpacity={0.85}
              style={[s.btn, (loading || !skill.trim()) && { opacity: 0.5 }]}
              disabled={loading || !skill.trim()}
            >
              <Text style={s.btnText}>{loading ? 'Adding…' : 'Add skill'}</Text>
            </TouchableOpacity>
          </View>

          {/* Success notice */}
          {lastAdded ? (
            <View style={s.successCard}>
              <Text style={s.successText}>
                <Text style={s.successBold}>{lastAdded}</Text>
                {' '}was added to your profile.
              </Text>
            </View>
          ) : null}

          {/* Error notice */}
          {error ? (
            <View style={s.errorCard}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}