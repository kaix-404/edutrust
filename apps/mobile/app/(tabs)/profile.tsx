import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
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
  danger:    '#C0392B',
  dangerDim: '#C0392B08',
};

const R = 14;

function Divider() {
  return <View style={s.divider} />;
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={s.metricRow}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={s.metricValue}>{value}</Text>
    </View>
  );
}

function SkillTag({ name }: { name: string }) {
  return (
    <View style={s.skillTag}>
      <Text style={s.skillTagText}>{name}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout, loading: authLoading } = useAuth();

  const [skills,         setSkills]         = useState<string[]>([]);
  const [trustScore,     setTrustScore]     = useState(0);
  const [endorsements,   setEndorsements]   = useState(0);
  const [influenceScore, setInfluenceScore] = useState(0);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    load();
  }, [user, authLoading]);

  const load = async () => {
    if (!user?.name) return;
    
    try {
      const [skillsRes, endorseRes, influenceRes] = await Promise.all([
        api.get(`/users/${encodeURIComponent(user.name)}/skills`),
        api.get(`/endorsements/${encodeURIComponent(user.name)}`),
        api.get('/endorsements/influence'),
      ]);

      setSkills(skillsRes.data.skills || []);
      setTrustScore(endorseRes.data.trustScore || 0);
      setEndorsements(endorseRes.data.endorsements || 0);

      const rankings = Array.isArray(
        influenceRes.data
      )
        ? influenceRes.data
        : [];

      const me = rankings.find(
        (item: any) =>
          item.user === user.name
      );
      setInfluenceScore(me?.influenceScore || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.dismissAll();
          router.replace('/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.loadingBlock}>
          <ActivityIndicator color={T.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user?.name
    ?.split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Page header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Account</Text>
          <Text style={s.title}>My Profile</Text>
        </View>

        {/* Identity card */}
        <View style={s.card}>
          <View style={s.identityRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{user?.name}</Text>
              <Text style={s.email}>{user?.email}</Text>
            </View>
          </View>

          <Divider />

          <MetricRow label="Trust score"   value={trustScore}     />
          <MetricRow label="Endorsements"  value={endorsements}   />
          <MetricRow label="Influence"     value={influenceScore} />
          <MetricRow label="Skills"        value={skills.length}  />
        </View>

        {/* Skills card */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Verified skills</Text>
          {skills.length > 0 ? (
            <View style={s.pillsRow}>
              {skills.map((skill, i) => (
                <SkillTag key={i} name={skill} />
              ))}
            </View>
          ) : (
            <Text style={s.empty}>No skills on record yet.</Text>
          )}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={confirmLogout}
          activeOpacity={0.85}
          style={s.signOutBtn}
        >
          <Text style={s.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 24, paddingBottom: 60 },

  loadingBlock: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  pageHeader: { marginBottom: 28 },
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
    padding: 22,
    marginBottom: 14,
  },

  // Identity
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 4,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accent + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: T.accent,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 3,
  },
  email: {
    fontSize: 13,
    color: T.inkGhost,
  },

  divider: {
    height: 1,
    backgroundColor: T.rule,
    marginVertical: 18,
  },

  // Metric rows
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  metricLabel: { fontSize: 15, color: T.ink, fontWeight: '400' },
  metricValue: { fontSize: 18, fontWeight: '600', color: T.ink },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // Skills
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: T.canvas,
    borderWidth: 1,
    borderColor: T.rule,
  },
  skillTagText: { fontSize: 13, color: T.inkSub, fontWeight: '500' },

  empty: { fontSize: 14, color: T.inkGhost },

  // Sign out
  signOutBtn: {
    marginTop: 8,
    backgroundColor: T.dangerDim,
    borderWidth: 1,
    borderColor: T.danger + '28',
    borderRadius: R,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: T.danger,
    fontWeight: '600',
    fontSize: 15,
  },
});