import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

const ITEMS: { label: string; sub: string; route: string; icon: string }[] = [
  { label: 'Role Analysis',           sub: 'Gap analysis against a target role',       route: '/role',          icon: 'briefcase-search' },
  { label: 'Role Recommendations',    sub: 'Best-fit roles based on your skill set',   route: '/rolerecommend', icon: 'briefcase-check'  },
  { label: 'Skill Recommendations',   sub: 'Skills suggested by similar users',        route: '/skillrecommend',icon: 'lightbulb-on'     },
  { label: 'Graph Explorer',          sub: "Visualise a user's skill graph",           route: '/graph',         icon: 'graph'            },
  { label: 'Endorsements',            sub: 'Give and look up trust endorsements',      route: '/endorsements',  icon: 'handshake'        },
  { label: 'Candidate Ranking',       sub: 'Rank candidates for a specific role',      route: '/ranking',       icon: 'podium'           },
];

export default function MoreScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Navigation</Text>
          <Text style={s.title}>More</Text>
        </View>

        {ITEMS.map(({ label, sub, route, icon }) => (
          <TouchableOpacity
            key={route}
            onPress={() => router.push(route as any)}
            activeOpacity={0.7}
            style={s.row}
          >
            <View style={s.rowIcon}>
              <MaterialCommunityIcons name={icon as any} size={20} color={T.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>{label}</Text>
              <Text style={s.rowSub}>{sub}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color={T.inkGhost} />
          </TouchableOpacity>
        ))}
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 18,
    marginBottom: 10,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: T.accent + '0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 2,
  },
  rowSub: {
    fontSize: 12,
    color: T.inkGhost,
    lineHeight: 17,
  },
});