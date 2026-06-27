import { useEffect, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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
  winner:    '#B07D2E',
  winnerDim: '#B07D2E0C',
};

const R = 14;

function Divider() {
  return <View style={s.divider} />;
}

function MatchBar({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? T.green :
    pct >= 40 ? T.winner : T.accent;
  return (
    <View style={s.barBg}>
      <View style={[s.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function RoleRecommendScreen() {
  const { user } = useAuth();
  const [recs,     setRecs]           = useState<any[]>([]);
  const [loading,  setLoading]        = useState(false);
  const [searched, setSearched]       = useState(false);

  const activeUserName = (user?.name || '').trim();

  useEffect(() => {
    if (!activeUserName) return;

    const load = async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await api.get(`/roles/recommend/${encodeURIComponent(activeUserName)}`);
        setRecs(
          Array.isArray(res.data)
            ? res.data
            : res.data.recommendations || []
        );
      } catch (err) {
        console.log(err);
        setRecs([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [activeUserName]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Career</Text>
          <Text style={s.title}>Role Recommendations</Text>
        </View>

        <View style={s.sessionCard}>
          <View style={s.sessionDot} />
          <View>
            <Text style={s.sessionLabel}>Recommendations for</Text>
            <Text style={s.sessionName}>{user?.name ?? '—'}</Text>
          </View>
        </View>

        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        )}

        {/* Best match spotlight */}
        {!loading && recs.length > 0 && (
          <View style={s.winnerCard}>
            <Text style={s.winnerEyebrow}>Best match</Text>
            <Text style={s.winnerName}>{recs[0].role}</Text>
            <Text style={s.winnerDetail}>Match score · {recs[0].matchScore}%</Text>
          </View>
        )}

        {/* All recommendations */}
        {!loading && recs.map((item, i) => (
          <View key={item.role} style={s.recCard}>
            {/* Role header */}
            <View style={s.recHeader}>
              <Text style={s.recPos}>{String(i + 1).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.recRole}>{item.role}</Text>
                <Text style={s.recScore}>{item.matchScore}% match</Text>
              </View>
            </View>

            <MatchBar pct={item.matchScore} />

            {/* Matched skills */}
            {item.matchedSkills?.length > 0 && (
              <>
                <Divider />
                <Text style={s.subTitle}>Matched skills</Text>
                <View style={s.pillsRow}>
                  {item.matchedSkills.map((sk: string, j: number) => (
                    <View key={j} style={s.pillGreen}>
                      <Text style={s.pillGreenText}>{sk}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Missing skills */}
            {item.missingSkills?.length > 0 && (
              <>
                <Divider />
                <Text style={s.subTitle}>Missing skills</Text>
                <View style={s.pillsRow}>
                  {item.missingSkills.map((sk: string, j: number) => (
                    <View key={j} style={s.pillGhost}>
                      <Text style={s.pillGhostText}>{sk}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        ))}

        {/* Empty */}
        {!loading && searched && recs.length === 0 && (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>No matches found</Text>
            <Text style={s.emptySub}>
              Add skills to your profile to receive role recommendations.
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
    fontSize: 18,
    color: T.ink,
    fontWeight: '600',
  },
  sessionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: T.green,
  },
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
    marginVertical: 16,
  },
  btn: {
    backgroundColor: T.accent,
    borderRadius: R,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  loadingBlock: { paddingVertical: 40, alignItems: 'center' },

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
    fontSize: 24,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  winnerDetail: { fontSize: 13, color: T.inkSub },

  // Rec cards
  recCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 12,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  recPos: {
    fontSize: 13,
    fontWeight: '500',
    color: T.inkGhost,
    width: 22,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  recRole: {
    fontSize: 18,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 2,
  },
  recScore: { fontSize: 13, color: T.inkSub },

  // Match bar
  barBg: {
    height: 5,
    backgroundColor: T.rule,
    borderRadius: 100,
    overflow: 'hidden',
  },
  barFill: { height: 5, borderRadius: 100 },

  subTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: T.inkGhost,
    marginBottom: 10,
  },

  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  pillGreen: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: T.green + '12',
    borderWidth: 1,
    borderColor: T.green + '30',
  },
  pillGreenText: { fontSize: 12, color: T.green, fontWeight: '500' },
  pillGhost: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: T.canvas,
    borderWidth: 1,
    borderColor: T.rule,
  },
  pillGhostText: { fontSize: 12, color: T.inkGhost, fontWeight: '400' },

  emptyCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: T.inkSub, marginBottom: 6 },
  emptySub: { fontSize: 14, color: T.inkGhost, textAlign: 'center', lineHeight: 22, maxWidth: 280 },
});