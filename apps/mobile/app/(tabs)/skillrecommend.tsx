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

function Divider() {
  return <View style={s.divider} />;
}

export default function SkillRecommendScreen() {
  const [userName, setUserName]   = useState('');
  const [recs,     setRecs]       = useState<any[]>([]);
  const [loading,  setLoading]    = useState(false);
  const [searched, setSearched]   = useState(false);

  const load = async () => {
    if (!userName.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/recommendations/skill/${encodeURIComponent(userName)}`);
      setRecs(res.data || []);
    } catch {
      setRecs([]);
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
          <Text style={s.eyebrow}>Learning</Text>
          <Text style={s.title}>Skill Recommendations</Text>
        </View>

        {/* Search */}
        <View style={s.card}>
          <Text style={s.label}>Username</Text>
          <TextInput
            placeholder="e.g. Jordan Lee"
            placeholderTextColor={T.inkGhost}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="none"
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
            <Text style={s.btnText}>{loading ? 'Finding recommendations…' : 'Get recommendations'}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        )}

        {/* Results */}
        {!loading && recs.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Recommended skills</Text>

            {recs.map((item, i) => (
              <View key={`${item.skill}-${i}`}>
                <View style={s.recRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.recSkill}>{item.skill}</Text>
                    <Text style={s.recMeta}>
                      Recommended by {item.score} similar {item.score === 1 ? 'user' : 'users'}
                    </Text>
                    {item.suggestedBy?.length > 0 && (
                      <Text style={s.recSuggesters}>
                        {item.suggestedBy.join('  ·  ')}
                      </Text>
                    )}
                  </View>
                  <View style={s.scoreChip}>
                    <Text style={s.scoreChipText}>{item.score}</Text>
                  </View>
                </View>
                {i < recs.length - 1 && <View style={s.rowRule} />}
              </View>
            ))}
          </View>
        )}

        {/* Empty */}
        {!loading && searched && recs.length === 0 && (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>No recommendations yet</Text>
            <Text style={s.emptySub}>
              This user has no recorded skills, or there are no similar users to compare with yet.
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
    marginBottom: 6,
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

  loadingBlock: { paddingVertical: 40, alignItems: 'center' },

  // Rec rows
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 16,
  },
  recSkill: {
    fontSize: 16,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 4,
  },
  recMeta: {
    fontSize: 13,
    color: T.inkSub,
    marginBottom: 3,
  },
  recSuggesters: {
    fontSize: 12,
    color: T.accent,
    fontWeight: '400',
  },
  scoreChip: {
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accent + '22',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 36,
    alignItems: 'center',
    marginTop: 2,
  },
  scoreChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.accent,
  },
  rowRule: {
    height: 1,
    backgroundColor: T.rule,
  },

  emptyCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: T.inkSub, marginBottom: 6 },
  emptySub: {
    fontSize: 14,
    color: T.inkGhost,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
});