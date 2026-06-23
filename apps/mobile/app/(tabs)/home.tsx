import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
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
};

const R = 14;

function Divider() {
  return <View style={s.divider} />;
}

function KpiCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={s.kpiCard}>
      <Text style={s.kpiValue}>{value ?? 0}</Text>
      <Text style={s.kpiLabel}>{label}</Text>
    </View>
  );
}

function SpotlightCard({
  eyebrow,
  name,
  detail,
}: {
  eyebrow: string;
  name: string;
  detail: string;
}) {
  return (
    <View style={s.spotlightCard}>
      <Text style={s.spotlightEyebrow}>{eyebrow}</Text>
      <Text style={s.spotlightName}>{name}</Text>
      <Text style={s.spotlightDetail}>{detail}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get('/analytics');
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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

  if (!data) return null;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Overview</Text>
          <Text style={s.title}>Analytics</Text>
        </View>

        {/* KPI grid */}
        <View style={s.kpiGrid}>
          <KpiCard value={data.totalUsers}        label="Users"        />
          <KpiCard value={data.totalSkills}       label="Skills"       />
          <KpiCard value={data.totalRoles}        label="Roles"        />
          <KpiCard value={data.totalEndorsements} label="Endorsements" />
        </View>

        <Divider />

        {/* Spotlight section */}
        <Text style={s.sectionTitle}>Community spotlights</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          {[
            {
              eyebrow: 'Most trusted',
              name: data.mostTrustedUser?.name ?? '—',
              detail: `Trust score · ${data.mostTrustedUser?.trustScore ?? 0}`,
            },
            {
              eyebrow: 'Most influential',
              name: data.mostInfluentialUser?.name ?? '—',
              detail: `Influence score · ${data.mostInfluentialUser?.influenceScore ?? 0}`,
            },
            {
              eyebrow: 'Most popular skill',
              name: data.mostPopularSkill?.skill ?? '—',
              detail: `Held by ${data.mostPopularSkill?.count ?? 0} users`,
            },
          ].map((item) => (
            <View
              key={item.eyebrow}
              style={{
                width: '33%',
                marginBottom: 12,
              }}
            >
              <SpotlightCard
                eyebrow={item.eyebrow}
                name={item.name}
                detail={item.detail}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 24, paddingBottom: 60 },

  loadingBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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

  // KPI grid — 2-column
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  kpiCard: {
    width: '47.5%',
    backgroundColor: T.paper,
    borderRadius: R + 4,
    paddingVertical: 22,
    paddingHorizontal: 18,
  },
  kpiValue: {
    fontSize: 34,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 13,
    color: T.inkSub,
    fontWeight: '400',
  },

  divider: {
    height: 1,
    backgroundColor: T.rule,
    marginVertical: 28,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // Spotlight cards — stacked, editorial
  spotlightCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 12,
  },
  spotlightEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.winner,
    marginBottom: 6,
  },
  spotlightName: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  spotlightDetail: {
    fontSize: 13,
    color: T.inkSub,
  },
});