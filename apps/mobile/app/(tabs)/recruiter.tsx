import { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';

import api from '../../services/api';

// ─── Tokens ───────────────────────────────────────────────────────────────────
// Warm off-white canvas, single ink colour, one restrained accent.
// No colour-coded metric buckets — let whitespace and type do the work.

const T = {
  canvas:     '#F7F5F2',   // warm off-white
  paper:      '#FFFFFF',   // card surface
  ink:        '#1A1714',   // near-black text
  inkSub:     '#6B6560',   // secondary text
  inkGhost:   '#B0AAA4',   // placeholder / muted
  rule:       '#E8E4DF',   // hairline divider
  accent:     '#2D5BE3',   // single accent – calm indigo
  accentDim:  '#2D5BE308', // tinted surface
  winner:     '#B07D2E',   // warm gold — winner only
  winnerDim:  '#B07D2E0C',
};

const R = 14; // base border-radius

// ─── Micro-components ─────────────────────────────────────────────────────────

function Label({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

function Divider() {
  return <View style={s.divider} />;
}

function MetricRow({
  title,
  value,
  sub,
}: {
  title: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <View style={s.metricRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.metricTitle}>{title}</Text>
        {sub ? <Text style={s.metricSub}>{sub}</Text> : null}
      </View>
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

function EndorserItem({ name, index }: { name: string; index: number }) {
  return (
    <View style={s.endorserItem}>
      <View style={s.endorserAvatar}>
        <Text style={s.endorserInitial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={s.endorserName}>{name}</Text>
      {index === 0 && <Text style={s.endorserBadge}>Lead endorser</Text>}
    </View>
  );
}

// Comparison: single metric row showing both sides
function CompareMetric({
  label,
  c1name,
  c1val,
  c2name,
  c2val,
}: {
  label: string;
  c1name: string;
  c1val: number;
  c2name: string;
  c2val: number;
}) {
  const max      = Math.max(c1val, c2val, 1);
  const c1wins   = c1val > c2val;
  const c2wins   = c2val > c1val;
  const tied     = c1val === c2val;

  return (
    <View style={s.cmpMetric}>
      <Text style={s.cmpMetricLabel}>{label}</Text>

      {/* Candidate 1 bar */}
      <View style={s.cmpBarRow}>
        <Text style={[s.cmpName, c1wins && s.cmpNameWinner]}>{c1name}</Text>
        <View style={s.cmpBarTrack}>
          <View
            style={[
              s.cmpBarFill,
              {
                width: `${(c1val / max) * 100}%`,
                backgroundColor: c1wins ? T.winner : T.accent,
                opacity: c1wins ? 1 : 0.45,
              },
            ]}
          />
        </View>
        <Text style={[s.cmpScore, c1wins && s.cmpScoreWinner]}>{c1val}</Text>
      </View>

      {/* Candidate 2 bar */}
      <View style={s.cmpBarRow}>
        <Text style={[s.cmpName, c2wins && s.cmpNameWinner]}>{c2name}</Text>
        <View style={s.cmpBarTrack}>
          <View
            style={[
              s.cmpBarFill,
              {
                width: `${(c2val / max) * 100}%`,
                backgroundColor: c2wins ? T.winner : T.accent,
                opacity: c2wins ? 1 : 0.45,
              },
            ]}
          />
        </View>
        <Text style={[s.cmpScore, c2wins && s.cmpScoreWinner]}>{c2val}</Text>
      </View>
    </View>
  );
}

function ProfileLevel({ score }: { score: number }) {
  const label =
    score >= 50 ? 'Expert'      :
    score >= 20 ? 'Strong'      :
    score >  0  ? 'Developing'  : 'New';
  return <Text style={s.levelBadge}>{label}</Text>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RecruiterScreen() {
  const [userName,      setUserName]      = useState('');
  const [compareName,   setCompareName]   = useState('');
  const [candidateName, setCandidateName] = useState('');

  const [skills,     setSkills]     = useState<string[]>([]);
  const [badges,     setBadges]     = useState<any[]>([]);
  const [endorsers,  setEndorsers]  = useState<string[]>([]);
  const [trustScore, setTrustScore] = useState<number | null>(null);

  const [comparison, setComparison] = useState<any>(null);
  const [loading,    setLoading]    = useState(false);
  const [mode,       setMode]       = useState<'analysis' | 'comparison' | null>(null);
  const [searched,   setSearched]   = useState(false);

  const loadCandidate = async () => {
    if (!userName.trim()) return;
    setCandidateName(userName.trim());
    setMode('analysis');
    setComparison(null);
    setLoading(true);
    setSearched(true);
    try {
      const [graphRes, endorseRes, badgeRes] = await Promise.all([
        api.get(`/graph/${encodeURIComponent(userName)}`),
        api.get(`/endorsements/${encodeURIComponent(userName)}`),
        api.get(`/badges/${encodeURIComponent(userName)}`),
      ]);
      setSkills(graphRes.data.skills || []);
      setEndorsers(endorseRes.data.endorsedBy || []);
      setTrustScore(endorseRes.data.trustScore ?? 0);
      setBadges(badgeRes.data || [])
    } catch {
      setSkills([]);
      setEndorsers([]);
      setTrustScore(0);
      setBadges([]);
    } finally {
      setLoading(false);
      setUserName('');
    }
  };

  const compareCandidates = async () => {
    if (!userName.trim() || !compareName.trim()) return;
    if (userName.trim() === compareName.trim()) {
      alert('Please enter two different candidate names.');
      return;
    }
    setMode('comparison');
    setLoading(true);
    try {
      const res = await api.get(
        `/compare/${encodeURIComponent(userName)}/${encodeURIComponent(compareName)}`
      );
      setComparison(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setMode(null);
    setSearched(false);
    setComparison(null);
    setSkills([]);
    setEndorsers([]);
    setTrustScore(null);
    setBadges([]);
    setUserName('');
    setCompareName('');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const getCount = (value: any) =>
    typeof value === 'number'
      ? value
      : Array.isArray(value)
      ? value.length
      : 0;

  const overallWinner = (() => {
    if (!comparison) return null;
    const c1 = comparison.candidate1;
    const c2 = comparison.candidate2;
    const s1 =
      getCount(c1.trustScore) +
      getCount(c1.influenceScore) +
      getCount(c1.skillCount) +
      getCount(c1.endorsements) +
      getCount(c1.badges);
    const s2 =
      getCount(c2.trustScore) +
      getCount(c2.influenceScore) +
      getCount(c2.skillCount) +
      getCount(c2.endorsements) +
      getCount(c2.badges);
    if (s1 === s2) return null;
    return s1 > s2 ? c1.name : c2.name;
  })();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Page header ────────────────────────────────────────────────── */}
        <View style={s.pageHeader}>
          <View>
            <Text style={s.pageEyebrow}>Recruiter</Text>
            <Text style={s.pageTitle}>Candidate Review</Text>
          </View>
          {(mode || searched) && (
            <TouchableOpacity onPress={clearAll} activeOpacity={0.6}>
              <Text style={s.resetLink}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Search card ────────────────────────────────────────────────── */}
        <View style={s.card}>
          <Label>Candidate name</Label>
          <TextInput
            placeholder="e.g. Jordan Lee"
            placeholderTextColor={T.inkGhost}
            value={userName}
            onChangeText={setUserName}
            onSubmitEditing={loadCandidate}
            returnKeyType="search"
            style={s.input}
          />

          <View style={s.inputSpacing} />

          <Label>Compare with (optional)</Label>
          <TextInput
            placeholder="e.g. Alex Kim"
            placeholderTextColor={T.inkGhost}
            value={compareName}
            onChangeText={setCompareName}
            onSubmitEditing={compareCandidates}
            returnKeyType="search"
            style={s.input}
          />

          <View style={s.btnRow}>
            <TouchableOpacity
              onPress={loadCandidate}
              activeOpacity={0.85}
              style={[s.btn, s.btnPrimary]}
            >
              <Text style={s.btnPrimaryText}>Analyze</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={compareCandidates}
              activeOpacity={0.85}
              style={[s.btn, s.btnGhost]}
            >
              <Text style={s.btnGhostText}>Compare</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
            <Text style={s.loadingText}>Fetching profile…</Text>
          </View>
        )}

        {/* ── Analysis ───────────────────────────────────────────────────── */}
        {!loading && mode === 'analysis' && searched && trustScore !== null && (
          <>
            {/* Identity block */}
            <View style={s.card}>
              <View style={s.identityRow}>
                <View style={s.avatar}>
                  <Text style={s.avatarInitial}>
                    {candidateName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.candidateName}>{candidateName}</Text>
                  <ProfileLevel score={trustScore} />
                </View>
              </View>

              <Divider />

              <MetricRow title="Trust score"     value={trustScore} />
              <MetricRow title="Verified skills" value={skills.length} />
              <MetricRow title="Earned Badges"   value={badges.length} />
              <MetricRow title="Endorsements"    value={endorsers.length} />
            </View>

            {/* Skills */}
            {skills.length > 0 && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>Verified skills</Text>
                <View style={s.pillsRow}>
                  {skills.map((skill, i) => (
                    <SkillTag key={i} name={skill} />
                  ))}
                </View>
              </View>
            )}

            {badges.length > 0 && (
              <View style={s.card}>
                <Text style={s.sectionTitle}>Earned Badges</Text>
                <View style={s.pillsRow}>
                  {badges.map((badge, i) => (
                    <SkillTag
                      key={i}
                      name={
                        typeof badge === 'string'
                          ? badge
                          : badge?.badge ?? String(badge)
                      }
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Endorsements */}
            <View style={s.card}>
              <Text style={s.sectionTitle}>Endorsed by</Text>
              {endorsers.length > 0 ? (
                endorsers.map((name, i) => (
                  <EndorserItem key={i} name={name} index={i} />
                ))
              ) : (
                <Text style={s.emptyLine}>No endorsements on record.</Text>
              )}
            </View>
          </>
        )}

        {/* ── Comparison ─────────────────────────────────────────────────── */}
        {!loading && mode === 'comparison' && comparison && (
          <>
            {/* Header */}
            <View style={s.card}>
              <Text style={s.sectionTitle}>Comparison</Text>
              <Text style={s.cmpNames}>
                {comparison.candidate1.name}
                {'  ·  '}
                {comparison.candidate2.name}
              </Text>

              <Divider />

              <CompareMetric
                label="Trust score"
                c1name={comparison.candidate1.name}
                c1val={comparison.candidate1.trustScore}
                c2name={comparison.candidate2.name}
                c2val={comparison.candidate2.trustScore}
              />
              <CompareMetric
                label="Influence score"
                c1name={comparison.candidate1.name}
                c1val={comparison.candidate1.influenceScore}
                c2name={comparison.candidate2.name}
                c2val={comparison.candidate2.influenceScore}
              />
              <CompareMetric
                label="Skill count"
                c1name={comparison.candidate1.name}
                c1val={comparison.candidate1.skillCount}
                c2name={comparison.candidate2.name}
                c2val={comparison.candidate2.skillCount}
              />
              <CompareMetric
                label="Badge count"
                c1name={comparison.candidate1.name}
                c1val={getCount(comparison.candidate1.badges)}
                c2name={comparison.candidate2.name}
                c2val={getCount(comparison.candidate2.badges)}
              />
              <CompareMetric
                label="Endorsements"
                c1name={comparison.candidate1.name}
                c1val={comparison.candidate1.endorsements}
                c2name={comparison.candidate2.name}
                c2val={comparison.candidate2.endorsements}
                />
            </View>

            {/* Recommendation */}
            {overallWinner ? (
              <View style={s.recommendCard}>
                <Text style={s.recommendEyebrow}>Overall recommendation</Text>
                <Text style={s.recommendName}>{overallWinner}</Text>
                <Text style={s.recommendSub}>
                  Leads across the combined scoring metrics.
                </Text>
              </View>
            ) : (
              <View style={s.recommendCard}>
                <Text style={s.recommendEyebrow}>Overall recommendation</Text>
                <Text style={s.recommendName}>Tied</Text>
                <Text style={s.recommendSub}>
                  Candidates are evenly matched across all metrics.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── Empty state ────────────────────────────────────────────────── */}
        {!loading && !mode && !searched && (
          <View style={s.emptyState}>
            <Text style={s.emptyTitle}>Search a candidate above</Text>
            <Text style={s.emptySub}>
              Enter a name to review a full profile, or fill both fields to compare two candidates side by side.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({

  safe:   { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 24, paddingBottom: 60 },

  // Page header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  pageEyebrow: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: T.inkGhost,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.6,
  },
  resetLink: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '500',
    paddingVertical: 4,
  },

  // Cards
  card: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 16,
  },

  // Labels
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: T.inkSub,
    letterSpacing: 0.4,
    marginBottom: 8,
  },

  // Inputs
  input: {
    fontSize: 16,
    color: T.ink,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    marginBottom: 4,
  },
  inputSpacing: { height: 20 },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: R,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: T.accent },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: T.rule,
  },
  btnGhostText: { color: T.inkSub, fontWeight: '500', fontSize: 15 },

  // Loading
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  loadingText: { color: T.inkSub, fontSize: 14 },

  // Divider
  divider: {
    height: 1,
    backgroundColor: T.rule,
    marginVertical: 18,
  },

  // Identity block
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: T.accentDim,
    borderWidth: 1,
    borderColor: T.accent + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: T.accent,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 4,
  },
  levelBadge: {
    fontSize: 12,
    fontWeight: '500',
    color: T.inkSub,
    letterSpacing: 0.3,
  },

  // Metric rows
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  metricTitle: { fontSize: 15, color: T.ink, fontWeight: '400' },
  metricSub:   { fontSize: 12, color: T.inkGhost, marginTop: 2 },
  metricValue: { fontSize: 18, fontWeight: '600', color: T.ink },

  // Section title
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 16,
  },

  // Skill pills
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: T.canvas,
    borderWidth: 1,
    borderColor: T.rule,
  },
  skillTagText: {
    fontSize: 13,
    color: T.inkSub,
    fontWeight: '500',
  },

  // Endorsers
  endorserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
    gap: 13,
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
  endorserName:    { flex: 1, fontSize: 15, color: T.ink, fontWeight: '400' },
  endorserBadge:   {
    fontSize: 11,
    color: T.inkGhost,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  emptyLine: { fontSize: 14, color: T.inkGhost, paddingVertical: 6 },

  // Comparison
  cmpNames: {
    fontSize: 15,
    color: T.inkSub,
    marginBottom: 18,
    marginTop: 4,
  },
  cmpMetric: { marginBottom: 22 },
  cmpMetricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.inkGhost,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  cmpBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  cmpName: {
    width: 72,
    fontSize: 13,
    color: T.inkSub,
    fontWeight: '400',
  },
  cmpNameWinner: {
    color: T.winner,
    fontWeight: '600',
  },
  cmpBarTrack: {
    flex: 1,
    height: 5,
    backgroundColor: T.rule,
    borderRadius: 100,
    overflow: 'hidden',
  },
  cmpBarFill: {
    height: 5,
    borderRadius: 100,
  },
  cmpScore: {
    width: 28,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: T.inkSub,
  },
  cmpScoreWinner: { color: T.winner },

  // Recommendation
  recommendCard: {
    backgroundColor: T.winnerDim,
    borderWidth: 1,
    borderColor: T.winner + '28',
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 16,
  },
  recommendEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.winner,
    marginBottom: 8,
  },
  recommendName: {
    fontSize: 26,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  recommendSub: {
    fontSize: 13,
    color: T.inkSub,
    lineHeight: 20,
  },

  // Empty state
  emptyState: {
    paddingTop: 56,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: T.inkSub,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: T.inkGhost,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
});