import { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { Link, router } from 'expo-router';
import api from '../../services/api';

const T = {
  canvas:   '#F7F5F2',
  paper:    '#FFFFFF',
  ink:      '#1A1714',
  inkSub:   '#6B6560',
  inkGhost: '#B0AAA4',
  rule:     '#E8E4DF',
  accent:   '#2D5BE3',
};

const R = 14;

export default function SkillViewScreen() {
  const [skills,  setSkills]  = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.inner}>
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Directory</Text>
          <Text style={s.title}>Skills</Text>
        </View>

        {loading ? (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        ) : (
          <FlatList
            data={skills}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={s.separator} />}
            ListEmptyComponent={
              <View style={s.emptyBlock}>
                <Text style={s.emptyTitle}>No skills yet</Text>
                <Text style={s.emptySub}>Be the first to add one below.</Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={s.row}>
                <Text style={s.rowIndex}>{String(index + 1).padStart(2, '0')}</Text>
                <Text style={s.rowName}>{item.name}</Text>
              </View>
            )}
          />
        )}

        {/* Add skill footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't see your skill?</Text>
          <TouchableOpacity
            onPress={() => router.push('/skills')}
            activeOpacity={0.7}
          >
            <Text style={s.footerLink}>Add it here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: T.canvas },
  inner: { flex: 1, padding: 24 },

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

  loadingBlock: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  listContent: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
  },
  rowIndex: {
    fontSize: 12,
    fontWeight: '500',
    color: T.inkGhost,
    width: 22,
    fontVariant: ['tabular-nums'],
  },
  rowName: {
    fontSize: 15,
    color: T.ink,
    fontWeight: '400',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: T.rule,
    marginLeft: 36,
  },

  emptyBlock: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: T.inkSub,
    marginBottom: 6,
  },
  emptySub: { fontSize: 14, color: T.inkGhost },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 20,
    paddingBottom: 8,
  },
  footerText: { fontSize: 13, color: T.inkGhost },
  footerLink: { fontSize: 13, color: T.accent, fontWeight: '500' },
});