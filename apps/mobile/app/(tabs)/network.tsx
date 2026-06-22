import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import Svg, {
  Circle,
  Line,
  Polygon,
  Text as SvgText,
} from 'react-native-svg';

import api from '../../services/api';

// ─── Tokens (same system as recruiter.tsx) ────────────────────────────────────

const T = {
  canvas:    '#F7F5F2',
  paper:     '#FFFFFF',
  ink:       '#1A1714',
  inkSub:    '#6B6560',
  inkGhost:  '#B0AAA4',
  rule:      '#E8E4DF',
  accent:    '#2D5BE3',
  accentDim: '#2D5BE308',
  winner:    '#B07D2E',
  winnerDim: '#B07D2E0C',

  // Node tier colours — muted, not neon
  nodeExpert:     '#B07D2E', // warm gold
  nodeSolid:      '#3D7A5C', // sage green
  nodeBase:       '#2D5BE3', // calm indigo
  nodeEdge:       '#C9C4BE', // soft grey edge
};

const R = 14;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tierColor(score: number): string {
  if (score >= 50) return T.nodeExpert;
  if (score >= 20) return T.nodeSolid;
  return T.nodeBase;
}

function nodeR(score: number): number {
  return Math.max(22, Math.min(20 + score / 5, 42));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return <View style={s.divider} />;
}

function StatItem({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={s.statItem}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function RankItem({
  item,
  index,
  maxScore,
}: {
  item: { user: string; influenceScore: number };
  index: number;
  maxScore: number;
}) {
  const isTop3 = index < 3;
  const pct    = maxScore > 0 ? (item.influenceScore / maxScore) * 100 : 0;

  return (
    <View style={s.rankItem}>
      {/* Rank number */}
      <Text style={[s.rankIndex, isTop3 && s.rankIndexTop]}>
        {String(index + 1).padStart(2, '0')}
      </Text>

      {/* Name & bar */}
      <View style={{ flex: 1 }}>
        <Text style={[s.rankName, isTop3 && s.rankNameTop]}>
          {item.user}
        </Text>
        <View style={s.rankBarTrack}>
          <View
            style={[
              s.rankBarFill,
              {
                width: `${pct}%`,
                backgroundColor: isTop3 ? T.winner : T.accent,
                opacity: isTop3 ? 0.9 : 0.5,
              },
            ]}
          />
        </View>
      </View>

      {/* Score */}
      <Text style={[s.rankScore, isTop3 && s.rankScoreTop]}>
        {item.influenceScore}
      </Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EndorsementNetworkScreen() {
  const [connections, setConnections] = useState<any[]>([]);
  const [nodes,       setNodes]       = useState<any[]>([]);
  const [ranking,     setRanking]     = useState<any[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [tab,         setTab]         = useState<'graph' | 'ranking'>('graph');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [netRes, infRes] = await Promise.all([
        api.get('/endorsements/network'),
        api.get('/endorsements/influence'),
      ]);
      setConnections(netRes.data.connections || []);
      setNodes(netRes.data.nodes || []);
      setRanking(infRes.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  const users = useMemo(
    () => [...new Set(connections.flatMap(c => [c.source, c.target]))],
    [connections],
  );

  const trustMap: Record<string, number> = useMemo(
    () => nodes.reduce((acc, n) => { acc[n.name] = n.trustScore; return acc; }, {}),
    [nodes],
  );

  const maxInfluence = useMemo(
    () => Math.max(...ranking.map(r => r.influenceScore), 1),
    [ranking],
  );

  const avgDegree = users.length > 0
    ? (connections.length / users.length).toFixed(1)
    : '—';

  // Graph geometry
  const screenW    = Dimensions.get('window').width;
  const orbit      = Math.max(120, users.length * 38);
  const svgW       = Math.max(screenW - 48, orbit * 2 + 180);
  const svgH       = Math.max(420, orbit * 2 + 180);
  const cx         = svgW / 2;
  const cy         = svgH / 2;

  const positions: Record<string, { x: number; y: number }> = useMemo(
    () => users.reduce((acc, user, i) => {
      const angle = (i / users.length) * Math.PI * 2 - Math.PI / 2;
      acc[user] = {
        x: cx + orbit * Math.cos(angle),
        y: cy + orbit * Math.sin(angle),
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>),
    [users, cx, cy, orbit],
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ────────────────────────────────────────────────────── */}
        <View style={s.pageHeader}>
          <View>
            <Text style={s.eyebrow}>Network</Text>
            <Text style={s.title}>Trust Graph</Text>
          </View>
          <TouchableOpacity onPress={load} activeOpacity={0.6} style={s.refreshBtn}>
            <Text style={s.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <View style={s.statsRow}>
          <StatItem value={users.length}       label="Participants" />
          <View style={s.statsDivider} />
          <StatItem value={connections.length}  label="Endorsements" />
          <View style={s.statsDivider} />
          <StatItem value={avgDegree}           label="Avg. degree" />
        </View>

        {/* ── Tab bar ───────────────────────────────────────────────────── */}
        <View style={s.tabBar}>
          {(['graph', 'ranking'] as const).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
              style={[s.tabBtn, tab === t && s.tabBtnActive]}
            >
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>
                {t === 'graph' ? 'Network graph' : 'Influence ranking'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
            <Text style={s.loadingText}>Loading…</Text>
          </View>
        )}

        {/* ── Graph tab ─────────────────────────────────────────────────── */}
        {!loading && tab === 'graph' && (
          <>
            {users.length === 0 ? (
              <View style={s.emptyCard}>
                <Text style={s.emptyTitle}>No network data yet</Text>
                <Text style={s.emptySub}>
                  Endorsements between users will appear here as a graph.
                </Text>
              </View>
            ) : (
              <View style={s.graphCard}>
                {/* Legend */}
                <View style={s.legend}>
                  {[
                    { color: T.nodeExpert, label: 'Expert  ≥ 50' },
                    { color: T.nodeSolid,  label: 'Strong  ≥ 20' },
                    { color: T.nodeBase,   label: 'Developing' },
                  ].map(({ color, label }) => (
                    <View key={label} style={s.legendItem}>
                      <View style={[s.legendDot, { backgroundColor: color }]} />
                      <Text style={s.legendLabel}>{label}</Text>
                    </View>
                  ))}
                </View>

                <Divider />

                {/* SVG */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Svg width={svgW} height={svgH}>

                    {/* Edges */}
                    {connections.map((conn, i) => {
                      const src = positions[conn.source];
                      const tgt = positions[conn.target];
                      if (!src || !tgt) return null;

                      const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
                      const tR    = nodeR(trustMap[conn.target] ?? 0);
                      const ex    = tgt.x - tR * Math.cos(angle);
                      const ey    = tgt.y - tR * Math.sin(angle);
                      const al    = 9;
                      const aw    = 4;

                      return (
                        <React.Fragment key={i}>
                          <Line
                            x1={src.x} y1={src.y}
                            x2={ex}    y2={ey}
                            stroke={T.nodeEdge}
                            strokeWidth="1.5"
                          />
                          <Polygon
                            points={`
                              ${ex},${ey}
                              ${ex - al * Math.cos(angle) + aw * Math.sin(angle)},${ey - al * Math.sin(angle) - aw * Math.cos(angle)}
                              ${ex - al * Math.cos(angle) - aw * Math.sin(angle)},${ey - al * Math.sin(angle) + aw * Math.cos(angle)}
                            `}
                            fill={T.nodeEdge}
                          />
                        </React.Fragment>
                      );
                    })}

                    {/* Nodes */}
                    {users.map(user => {
                      const pos   = positions[user];
                      const trust = trustMap[user] ?? 0;
                      const r     = nodeR(trust);
                      const color = tierColor(trust);

                      return (
                        <React.Fragment key={user}>
                          <Circle
                            cx={pos.x} cy={pos.y}
                            r={r}
                            fill={T.paper}
                            stroke={color}
                            strokeWidth="2"
                          />
                          <SvgText
                            x={pos.x}
                            y={pos.y + 4}
                            textAnchor="middle"
                            fill={color}
                            fontSize={user.length > 8 ? 8 : 11}
                            fontWeight="600"
                          >
                            {user}
                          </SvgText>
                          <SvgText
                            x={pos.x}
                            y={pos.y + r + 16}
                            textAnchor="middle"
                            fill={T.inkGhost}
                            fontSize="10"
                          >
                            {trust}
                          </SvgText>
                        </React.Fragment>
                      );
                    })}

                  </Svg>
                </ScrollView>
              </View>
            )}
          </>
        )}

        {/* ── Ranking tab ───────────────────────────────────────────────── */}
        {!loading && tab === 'ranking' && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Influence ranking</Text>

            {ranking.length === 0 ? (
              <Text style={s.emptySub}>No ranking data available.</Text>
            ) : (
              ranking.map((item, index) => (
                <RankItem
                  key={item.user}
                  item={item}
                  index={index}
                  maxScore={maxInfluence}
                />
              ))
            )}
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

  // Header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
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
  refreshBtn: { paddingVertical: 4 },
  refreshText: {
    fontSize: 14,
    color: T.accent,
    fontWeight: '500',
  },

  // Stats strip
  statsRow: {
    flexDirection: 'row',
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 11,
    color: T.inkGhost,
    marginTop: 4,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  statsDivider: {
    width: 1,
    height: 32,
    backgroundColor: T.rule,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: T.paper,
    borderRadius: R,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: R - 4,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: T.canvas,
  },
  tabText: {
    fontSize: 13,
    color: T.inkGhost,
    fontWeight: '500',
  },
  tabTextActive: {
    color: T.ink,
    fontWeight: '600',
  },

  // Loading
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  loadingText: { color: T.inkSub, fontSize: 14 },

  // Divider
  divider: {
    height: 1,
    backgroundColor: T.rule,
    marginVertical: 18,
  },

  // Graph card
  graphCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },

  // Legend
  legend: {
    flexDirection: 'row',
    gap: 18,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: T.inkSub,
  },

  // Generic card
  card: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  // Rank items
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.rule,
  },
  rankIndex: {
    fontSize: 13,
    fontWeight: '500',
    color: T.inkGhost,
    width: 24,
    fontVariant: ['tabular-nums'],
  },
  rankIndexTop: {
    color: T.winner,
    fontWeight: '700',
  },
  rankName: {
    fontSize: 15,
    color: T.ink,
    fontWeight: '400',
    marginBottom: 6,
  },
  rankNameTop: { fontWeight: '600' },
  rankBarTrack: {
    height: 3,
    backgroundColor: T.rule,
    borderRadius: 100,
    overflow: 'hidden',
  },
  rankBarFill: {
    height: 3,
    borderRadius: 100,
  },
  rankScore: {
    fontSize: 15,
    fontWeight: '600',
    color: T.inkSub,
    width: 36,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  rankScoreTop: { color: T.winner },

  // Empty states
  emptyCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: T.inkSub,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: T.inkGhost,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});