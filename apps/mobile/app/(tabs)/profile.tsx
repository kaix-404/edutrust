import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
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

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: T.canvas },
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

  signOutBtn: {
    marginTop: 8,
    backgroundColor: T.dangerDim,
    borderWidth: 1,
    borderColor: T.danger + '28',
    borderRadius: R,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutBtnDisabled: { opacity: 0.5 },
  signOutText: {
    color: T.danger,
    fontWeight: '600',
    fontSize: 15,
  },

  // ── Confirm modal ──────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#1A171488',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalBox: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 28,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  modalBody: {
    fontSize: 14,
    color: T.inkSub,
    lineHeight: 22,
    marginBottom: 28,
  },
  modalRule: {
    height: 1,
    backgroundColor: T.rule,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: R,
    borderWidth: 1,
    borderColor: T.rule,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: T.inkSub,
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: R,
    backgroundColor: T.danger,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

// ── Sub-components ────────────────────────────────────────────────────────────

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

function SignOutModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={s.modalBackdrop} onPress={onCancel}>
        <Pressable style={s.modalBox} onPress={e => e.stopPropagation()}>
          <Text style={s.modalTitle}>Sign out</Text>
          <Text style={s.modalBody}>
            Are you sure you want to sign out? You'll need to sign in again to access your profile.
          </Text>
          <View style={s.modalRule} />
          <View style={s.modalActions}>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.7}
              style={s.modalCancel}
            >
              <Text style={s.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.85}
              style={s.modalConfirm}
            >
              <Text style={s.modalConfirmText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, logout, loading: authLoading } = useAuth();

  const [skills,         setSkills]         = useState<string[]>([]);
  const [trustScore,     setTrustScore]     = useState(0);
  const [endorsements,   setEndorsements]   = useState(0);
  const [influenceScore, setInfluenceScore] = useState(0);
  const [badges,         setBadges]         = useState<any[]>([]);
  const [loading,        setLoading]        = useState(false);
  const [modalVisible,   setModalVisible]   = useState(false);
  const [signingOut,     setSigningOut]     = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user?.name) load();
  }, [authLoading]);

  const load = async () => {
    if (!user?.name) return;
    setLoading(true);
    try {
      const [skillsRes, endorseRes, influenceRes, badgeRes] = await Promise.all([
        api.get(`/users/${encodeURIComponent(user.name)}/skills`),
        api.get(`/endorsements/${encodeURIComponent(user.name)}`),
        api.get('/endorsements/influence'),
        api.get(`/badges/${encodeURIComponent(user.name)}`),
      ]);

      // Normalize skills response: API returns an array of { skill } objects
      const skillsPayload = skillsRes.data;
      let skillsList: string[] = [];
      if (Array.isArray(skillsPayload)) {
        skillsList = skillsPayload.map((s: any) => s.skill || s.name || String(s));
      } else {
        skillsList = skillsPayload?.skills || [];
      }
      setSkills(skillsList);
      setTrustScore(endorseRes.data.trustScore || 0);
      setEndorsements(endorseRes.data.endorsements || 0);
      setBadges(badgeRes.data || []);

      const rankings = Array.isArray(influenceRes.data) ? influenceRes.data : [];
      const me = rankings.find((item: any) => item.user === user.name);
      setInfluenceScore(me?.influenceScore || 0);

    } catch (err) {
      console.log('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (signingOut) return;
    setSigningOut(true);
    setModalVisible(false);
    delete api.defaults.headers.common['Authorization'];
    logout();
    router.replace('/login');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (authLoading || loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.loadingBlock}>
          <ActivityIndicator color={T.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  const initials = user.name
    ?.split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <SafeAreaView style={s.safe}>
      <SignOutModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleLogout}
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Account</Text>
          <Text style={s.title}>My Profile</Text>
        </View>

        <View style={s.card}>
          <View style={s.identityRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{user.name}</Text>
              <Text style={s.email}>{user.email}</Text>
            </View>
          </View>

          <Divider />

          <MetricRow label="Trust score"  value={trustScore}     />
          <MetricRow label="Endorsements" value={endorsements}   />
          <MetricRow label="Influence"    value={influenceScore} />
          <MetricRow label="Skills"       value={skills.length}  />
          <MetricRow label="Badges"       value={badges.length}  />
        </View>

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

        <View style={s.card}>
          <Text style={s.sectionTitle}>
            Earned Badges
          </Text>

          {badges.length > 0 ? (
            badges.map(
              (badge, index) => (
                <View
                  key={index}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor:
                      '#E8E4DF',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    🏅 {badge.badge}
                  </Text>

                  <Text
                    style={{
                      color: '#666',
                      marginTop: 4,
                    }}
                  >
                    {badge.score >= 90
                      ? `🌟 Elite Score: ${badge.score}`
                      : `Score: ${badge.score}`}
                  </Text>
                </View>
              )
            )
          ) : (
            <Text style={s.empty}>
              No badges earned yet.
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
          disabled={signingOut}
          style={[s.signOutBtn, signingOut && s.signOutBtnDisabled]}
        >
          <Text style={s.signOutText}>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}