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
  ActivityIndicator,
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
  winner:   '#B07D2E',
  winnerDim:'#B07D2E0C',
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

export default function RankingScreen() {
  const [role,    setRole]    = useState('');
  const [rankings,setRankings]= useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched,setSearched]= useState(false);

  const load = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/roles/rank/${encodeURIComponent(role)}`);
      setRankings(res.data || []);
    } catch (err) {
      console.log(err);
      setRankings([]);
    } finally {
      setLoading(false);
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
          <Text style={s.eyebrow}>Hiring</Text>
          <Text style={s.title}>Candidate Ranking</Text>
        </View>

        {/* Search */}
        <View style={s.card}>
          <Text style={s.label}>Role name</Text>
          <TextInput
            placeholder="e.g. Frontend Engineer"
            placeholderTextColor={T.inkGhost}
            value={role}
            onChangeText={setRole}
            returnKeyType="search"
            onSubmitEditing={load}
            style={s.input}
          />
          <Divider />
          <TouchableOpacity
            onPress={load}
            activeOpacity={0.85}
            style={[s.btn, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Ranking…' : 'Rank candidates'}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        )}

        {/* Winner spotlight */}
        {!loading && rankings.length > 0 && (
          <View style={s.winnerCard}>
            <Text style={s.winnerEyebrow}>Top candidate</Text>
            <Text style={s.winnerName}>{rankings[0].user}</Text>
            <Text style={s.winnerDetail}>Final score · {rankings[0].finalScore}</Text>
          </View>
        )}

        {/* Ranked list */}
        {!loading && rankings.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>All candidates</Text>
            {rankings.map((c, i) => (
              <View key={c.user}>
                <View style={s.rankRow}>
                  <Text style={[s.rankPos, i < 3 && s.rankPosTop]}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.rankName, i < 3 && s.rankNameTop]}>{c.user}</Text>
                    <View style={s.rankMeta}>
                      <Text style={s.rankChip}>Match {c.matchScore}%</Text>
                      <Text style={s.rankChip}>Trust {c.trustScore}</Text>
                      <Text style={s.rankChip}>Influence {c.influenceScore}</Text>
                    </View>
                  </View>
                  <Text style={[s.rankScore, i < 3 && s.rankScoreTop]}>
                    {c.finalScore}
                  </Text>
                </View>
                {i < rankings.length - 1 && (
                  <View style={s.rowRule} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Empty */}
        {!loading && searched && rankings.length === 0 && (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>No candidates found</Text>
            <Text style={s.emptySub}>
              No users have been matched against "{role}" yet.
            </Text>
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
    marginBottom: 8,
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  metricLabel: { fontSize: 15, color: T.ink },
  metricValue: { fontSize: 17, fontWeight: '600', color: T.ink },

  loadingBlock: { paddingVertical: 40, alignItems: 'center' },

  // Winner
  winnerCard: {
    backgroundColor: T.winnerDim,
    borderWidth: 1,
    borderColor: T.winner + '28',
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 14,
  },
  winnerEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.winner,
    marginBottom: 6,
  },
  winnerName: {
    fontSize: 26,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  winnerDetail: { fontSize: 13, color: T.inkSub },

  // Rank list
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  rankPos: {
    fontSize: 12,
    fontWeight: '500',
    color: T.inkGhost,
    width: 22,
    fontVariant: ['tabular-nums'],
  },
  rankPosTop: { color: T.winner, fontWeight: '700' },
  rankName: { fontSize: 15, color: T.ink, fontWeight: '500', marginBottom: 6 },
  rankNameTop: { fontWeight: '700' },
  rankMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  rankChip: {
    fontSize: 11,
    color: T.inkGhost,
    backgroundColor: T.canvas,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  rankScore: {
    fontSize: 17,
    fontWeight: '600',
    color: T.inkSub,
    fontVariant: ['tabular-nums'],
  },
  rankScoreTop: { color: T.winner },
  rowRule: {
    height: 1,
    backgroundColor: T.rule,
    marginLeft: 36,
  },

  emptyCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: T.inkSub, marginBottom: 6 },
  emptySub: { fontSize: 14, color: T.inkGhost, textAlign: 'center', lineHeight: 22 },
});