import { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';

import Svg, {
  Circle,
  Line,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';

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

export default function GraphScreen() {
  const [userName,  setUserName]  = useState('');
  const [candidate, setCandidate] = useState('');
  const [skills,    setSkills]    = useState<string[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [searched,  setSearched]  = useState(false);

  const loadGraph = async () => {
    if (!userName.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/graph/${encodeURIComponent(userName)}`);
      setCandidate(userName.trim());
      setSkills(res.data.skills || []);
    } catch (err) {
      console.log(err);
      setSkills([]);
    } finally {
      setLoading(false);
      setUserName('');
    }
  };

  const screenW = Dimensions.get('window').width;
  const svgW    = Math.max(skills.length * 160, screenW - 48, 500);
  const centerX = svgW / 2;
  const centerY = 70;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>Visualisation</Text>
          <Text style={s.title}>Graph Explorer</Text>
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
            onSubmitEditing={loadGraph}
            style={s.input}
          />
          <View style={s.divider} />
          <TouchableOpacity
            onPress={loadGraph}
            activeOpacity={0.85}
            style={[s.btn, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Loading…' : 'Load graph'}</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        )}

        {/* Graph */}
        {!loading && searched && skills.length > 0 && (
          <View style={s.graphCard}>
            <Text style={s.graphTitle}>{candidate}</Text>
            <Text style={s.graphSub}>{skills.length} verified {skills.length === 1 ? 'skill' : 'skills'}</Text>
            <View style={{ height: 16 }} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Svg width={svgW} height={400}>

                {/* Centre user node */}
                <Circle cx={centerX} cy={centerY} r={36} fill={T.ink} />
                <SvgText
                  x={centerX} y={centerY + 5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={candidate.length > 10 ? 9 : 12}
                  fontWeight="600"
                >
                  {candidate}
                </SvgText>

                {/* Skill nodes */}
                {skills.map((skill, i) => {
                  const spacing = svgW / (skills.length + 1);
                  const x = spacing * (i + 1);
                  const y = 280;
                  const w = Math.max(skill.length * 8.5, 90);

                  return (
                    <G key={skill}>
                      {/* Edge */}
                      <Line
                        x1={centerX} y1={centerY + 36}
                        x2={x}       y2={y - 20}
                        stroke={T.rule}
                        strokeWidth="1.5"
                      />
                      {/* Node */}
                      <Rect
                        x={x - w / 2} y={y - 20}
                        width={w} height={36}
                        rx={10}
                        fill={T.paper}
                        stroke={T.rule}
                        strokeWidth="1.5"
                      />
                      <SvgText
                        x={x} y={y + 3}
                        textAnchor="middle"
                        fill={T.inkSub}
                        fontSize="12"
                        fontWeight="500"
                      >
                        {skill}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </ScrollView>
          </View>
        )}

        {/* Empty after search */}
        {!loading && searched && skills.length === 0 && (
          <View style={s.emptyCard}>
            <Text style={s.emptyTitle}>No skills found</Text>
            <Text style={s.emptySub}>This user has no verified skills on record yet.</Text>
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

  loadingBlock: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  // Graph card
  graphCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 14,
    overflow: 'hidden',
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 2,
  },
  graphSub: {
    fontSize: 13,
    color: T.inkGhost,
  },

  emptyCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: T.inkSub,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 14,
    color: T.inkGhost,
    textAlign: 'center',
  },
});