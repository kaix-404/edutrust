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
  green:     '#2E7D52',
  greenDim:  '#2E7D520C',
  red:       '#B0392B',
  redDim:    '#B0392B0C',
  winner:    '#B07D2E',
  winnerDim: '#B07D2E0C',
};

const R = 14;

function Divider() {
  return <View style={s.divider} />;
}

function SkillRow({
  name,
  type,
}: {
  name: string;
  type: 'matched' | 'missing' | 'path';
}) {
  const dot = type === 'matched' ? T.green : type === 'missing' ? T.red : T.accent;
  return (
    <View style={s.skillRow}>
      <View style={[s.skillDot, { backgroundColor: dot }]} />
      <Text style={s.skillName}>{name}</Text>
    </View>
  );
}

function SkillSection({
  title,
  items,
  type,
  empty,
}: {
  title: string;
  items: string[];
  type: 'matched' | 'missing' | 'path';
  empty: string;
}) {
  return (
    <View style={s.skillSection}>
      <Text style={s.sectionTitle}>{title}</Text>
      {items.length > 0
        ? items.map((skill, i) => <SkillRow key={i} name={skill} type={type} />)
        : <Text style={s.empty}>{empty}</Text>
      }
    </View>
  );
}

export default function RoleAnalysisScreen() {
  const [userName, setUserName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [result,   setResult]   = useState<any>(null);
  const [recs,     setRecs]     = useState<string[]>([]);
  const [roadmap,  setRoadmap]  = useState<string[]>([]);
  const [nextSkill,setNextSkill]= useState('');
  const [loading,  setLoading]  = useState(false);

  const analyze = async () => {
    if (!userName.trim() || !roleName.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const [gapRes, recRes, roadRes] = await Promise.all([
        api.get(`/roles/gap/${encodeURIComponent(roleName)}/${encodeURIComponent(userName)}`),
        api.get(`/roles/recommendations/${encodeURIComponent(roleName)}/${encodeURIComponent(userName)}`),
        api.get(`/roles/roadmap/${encodeURIComponent(roleName)}/${encodeURIComponent(userName)}`),
      ]);
      setResult(gapRes.data);
      setRecs(recRes.data.recommendations || []);
      setRoadmap(roadRes.data.roadmap || []);
      setNextSkill(roadRes.data.nextSkill || '');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const matchPct = result?.matchScore ?? 0;
  const matchColor =
    matchPct >= 75 ? T.green :
    matchPct >= 40 ? T.winner : T.red;

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
          <Text style={s.title}>Role Analysis</Text>
        </View>

        {/* Form */}
        <View style={s.card}>
          <Text style={s.label}>Candidate name</Text>
          <TextInput
            placeholder="e.g. Jordan Lee"
            placeholderTextColor={T.inkGhost}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="words"
            returnKeyType="next"
            style={s.input}
          />

          <View style={{ height: 20 }} />

          <Text style={s.label}>Target role</Text>
          <TextInput
            placeholder="e.g. Frontend Engineer"
            placeholderTextColor={T.inkGhost}
            value={roleName}
            onChangeText={setRoleName}
            returnKeyType="done"
            onSubmitEditing={analyze}
            style={s.input}
          />

          <Divider />

          <TouchableOpacity
            onPress={analyze}
            activeOpacity={0.85}
            style={[s.btn, loading && { opacity: 0.6 }]}
            disabled={loading}
          >
            <Text style={s.btnText}>{loading ? 'Analysing…' : 'Analyse candidate'}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
          </View>
        )}

        {!loading && result && (
          <>
            {/* Match score hero */}
            <View style={s.scoreCard}>
              <Text style={s.scoreEyebrow}>Match score</Text>
              <Text style={[s.scoreValue, { color: matchColor }]}>{matchPct}%</Text>
              <Text style={s.scoreSub}>{result.user} · {result.role}</Text>
              {/* Progress bar */}
              <View style={s.scoreBg}>
                <View
                  style={[
                    s.scoreFill,
                    { width: `${matchPct}%`, backgroundColor: matchColor },
                  ]}
                />
              </View>
            </View>

            {/* Skills breakdown */}
            <View style={s.card}>
              <SkillSection
                title="Matched skills"
                items={result.matchedSkills}
                type="matched"
                empty="No matching skills found."
              />
              {result.missingSkills?.length > 0 && (
                <>
                  <Divider />
                  <SkillSection
                    title="Missing skills"
                    items={result.missingSkills}
                    type="missing"
                    empty="No missing skills."
                  />
                </>
              )}
            </View>

            {/* Learning path */}
            {(recs.length > 0 || roadmap.length > 0 || nextSkill) && (
              <View style={s.card}>
                {nextSkill ? (
                  <>
                    <Text style={s.sectionTitle}>Recommended next skill</Text>
                    <View style={s.nextSkillBlock}>
                      <Text style={s.nextSkillText}>{nextSkill}</Text>
                    </View>
                  </>
                ) : null}

                {roadmap.length > 0 && (
                  <>
                    {nextSkill && <Divider />}
                    <SkillSection
                      title="Learning roadmap"
                      items={roadmap}
                      type="path"
                      empty=""
                    />
                  </>
                )}

                {recs.length > 0 && (
                  <>
                    {(roadmap.length > 0 || nextSkill) && <Divider />}
                    <SkillSection
                      title="Recommended learning path"
                      items={recs}
                      type="path"
                      empty=""
                    />
                  </>
                )}
              </View>
            )}
          </>
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

  loadingBlock: { paddingVertical: 40, alignItems: 'center' },

  // Score hero
  scoreCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 24,
    marginBottom: 14,
  },
  scoreEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.inkGhost,
    marginBottom: 6,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  scoreSub: { fontSize: 13, color: T.inkGhost, marginBottom: 18 },
  scoreBg: {
    height: 6,
    backgroundColor: T.rule,
    borderRadius: 100,
    overflow: 'hidden',
  },
  scoreFill: { height: 6, borderRadius: 100 },

  // Skill sections
  skillSection: {},
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  skillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  skillName: { fontSize: 15, color: T.ink, fontWeight: '400' },

  empty: { fontSize: 14, color: T.inkGhost, paddingVertical: 4 },

  // Next skill
  nextSkillBlock: {
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accent + '22',
    borderRadius: R,
    padding: 16,
    marginTop: 4,
  },
  nextSkillText: {
    fontSize: 17,
    fontWeight: '600',
    color: T.accent,
  },
});