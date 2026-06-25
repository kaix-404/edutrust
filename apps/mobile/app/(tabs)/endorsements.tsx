import { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';

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
  green:     '#2E7D52',
  greenDim:  '#2E7D520C',
  danger:    '#C0392B',
  dangerDim: '#C0392B08',
};

const R = 14;

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

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

export default function EndorsementsScreen() {
  const { user } = useAuth();

  // Create endorsement
  const [toUser,   setToUser]   = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'ok' | 'err' | 'notfound'>('idle');
  const [sendLoading, setSendLoading] = useState(false);

  // Check trust
  const [searchUser,   setSearchUser]   = useState('');
  const [endorsers,    setEndorsers]    = useState<string[]>([]);
  const [trustScore,   setTrustScore]   = useState<number | null>(null);
  const [numEndorse,   setNumEndorse]   = useState<number | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetched,      setFetched]      = useState(false);
  const [fetchStatus,  setFetchStatus]  = useState<'idle' | 'ok' | 'err' | 'notfound'>('idle');

  const endorseUser = async () => {
    if (!user?.name || !toUser.trim()) return;
    setSendLoading(true);
    setSendStatus('idle');
    try {
      await api.post('/endorsements', { endorser: user.name, endorsee: toUser });
      setSendStatus('ok');
      setToUser('');
    } catch (error: any) {
        if (error?.response?.status === 404 || error?.response?.data?.error?.includes('not found')) {
        setSendStatus('notfound');
      } else {
        setSendStatus('err');
      }
    } finally {
      setSendLoading(false);
    }
  };

  const fetchTrust = async () => {
    if (!searchUser.trim()) return;
    setFetchLoading(true);
    setFetched(false);
    setFetchStatus('idle');
    try {
      const res = await api.get(`/endorsements/${encodeURIComponent(searchUser)}`);
      setEndorsers(res.data.endorsedBy || []);
      setTrustScore(res.data.trustScore ?? 0);
      setNumEndorse(res.data.endorsements ?? 0);
      setFetched(true);
      setFetchStatus('ok');
    } catch (error: any) {
      const msg = error?.response?.data?.error || '';
      if (error?.response?.status === 404 || String(msg).toLowerCase().includes('not found')) {
        setFetchStatus('notfound');
        setEndorsers([]);
        setTrustScore(null);
        setNumEndorse(null);
      } else {
        setFetchStatus('err');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Trust network</Text>
          <Text style={s.title}>Endorsements</Text>
        </View>

        {/* ── Create endorsement ─────────────────────────────────────────── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Create endorsement</Text>

          {/* Session indicator — shows who the endorsement will be from */}
          <View style={s.sessionCard}>
            <View style={s.sessionDot} />
            <View>
              <Text style={s.sessionLabel}>Endorser</Text>
              <Text style={s.sessionName}>{user?.name ?? '—'}</Text>
            </View>
          </View>

          <View style={{ height: 14 }} />

          <Label>To</Label>
          <TextInput
            placeholder="Endorsee username"
            placeholderTextColor={T.inkGhost}
            value={toUser}
            onChangeText={setToUser}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={endorseUser}
            style={s.input}
          />

          <Divider />

          <TouchableOpacity
            onPress={endorseUser}
            activeOpacity={0.85}
            style={[s.btn, (sendLoading || !toUser.trim()) && { opacity: 0.5 }]}
            disabled={sendLoading || !toUser.trim()}
          >
            <Text style={s.btnText}>{sendLoading ? 'Sending…' : 'Endorse'}</Text>
          </TouchableOpacity>

          {sendStatus === 'ok' && (
            <View style={[s.notice, s.noticeGreen]}>
              <Text style={[s.noticeText, { color: T.green }]}>
                Endorsement created successfully.
              </Text>
            </View>
          )}
          {sendStatus === 'notfound' && (
            <View style={[s.notice, s.noticeRed]}>
              <Text style={[s.noticeText, { color: '#C0392B' }]}>
                User not found.
              </Text>
            </View>
          )}
          {sendStatus === 'err' && (
            <View style={[s.notice, s.noticeRed]}>
              <Text style={[s.noticeText, { color: '#C0392B' }]}>
                Failed to create endorsement.
              </Text>
            </View>
          )}
        </View>

        {/* ── Check trust profile ────────────────────────────────────────── */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Check trust profile</Text>

          <Label>Username</Label>
          <TextInput
            placeholder="e.g. Jordan Lee"
            placeholderTextColor={T.inkGhost}
            value={searchUser}
            onChangeText={(t) => { setSearchUser(t); setFetched(false); }}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={fetchTrust}
            style={s.input}
          />

          <Divider />

          <TouchableOpacity
            onPress={fetchTrust}
            activeOpacity={0.85}
            style={[s.btnGhost, fetchLoading && { opacity: 0.6 }]}
            disabled={fetchLoading}
          >
            <Text style={s.btnGhostText}>{fetchLoading ? 'Looking up…' : 'View trust profile'}</Text>
          </TouchableOpacity>
          {fetchStatus === 'notfound' && (
            <View style={[s.notice, s.noticeRed]}>
              <Text style={[s.noticeText, { color: '#C0392B' }]}>User not found.</Text>
            </View>
          )}
          {fetchStatus === 'err' && (
            <View style={[s.notice, s.noticeRed]}>
              <Text style={[s.noticeText, { color: '#C0392B' }]}>Could not fetch trust data for this user.</Text>
            </View>
          )}
        </View>

        {/* ── Results ────────────────────────────────────────────────────── */}
        {fetched && trustScore !== null && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>{searchUser}</Text>
            <MetricRow label="Trust score"    value={trustScore} />
            <MetricRow label="Endorsements"   value={numEndorse ?? 0} />
          </View>
        )}

        {fetched && endorsers.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Endorsed by</Text>
            {endorsers.map((e, i) => (
              <View key={i} style={s.endorserRow}>
                <View style={s.endorserAvatar}>
                  <Text style={s.endorserInitial}>{e.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={s.endorserName}>{e}</Text>
              </View>
            ))}
          </View>
        )}

        {fetched && endorsers.length === 0 && (
          <View style={s.card}>
            <Text style={s.empty}>No endorsers found for this user.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 24, paddingBottom: 60 },

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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 18,
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
    marginVertical: 20,
  },
  btn: {
    backgroundColor: T.accent,
    borderRadius: R,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnGhost: {
    borderWidth: 1,
    borderColor: T.rule,
    borderRadius: R,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnGhostText: { color: T.inkSub, fontWeight: '500', fontSize: 15 },

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

  notice: {
    borderRadius: R - 2,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
  },
  noticeGreen: {
    backgroundColor: T.greenDim,
    borderColor: T.green + '28',
  },
  noticeRed: {
    backgroundColor: '#C0392B08',
    borderColor: '#C0392B28',
  },
  noticeText: { fontSize: 14, fontWeight: '500' },

  // Metric rows
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  metricLabel: { fontSize: 15, color: T.ink },
  metricValue: { fontSize: 18, fontWeight: '600', color: T.ink },

  // Endorser rows
  endorserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  endorserAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endorserInitial: { fontSize: 14, fontWeight: '600', color: T.inkSub },
  endorserName:    { fontSize: 15, color: T.ink, fontWeight: '400' },

  empty: { fontSize: 14, color: T.inkGhost },
});