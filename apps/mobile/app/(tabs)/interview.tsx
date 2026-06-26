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
  Modal,
  Pressable,
} from 'react-native';

import { puter } from '@heyputer/puter.js';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ─── Tokens (shared system) ───────────────────────────────────────────────────

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
  gold:      '#B07D2E',
  goldDim:   '#B07D2E0C',
  danger:    '#C0392B',
  dangerDim: '#C0392B08',
};

const R = 14;

// ─── Styles (declared first so sub-components can reference s.*) ──────────────

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: T.canvas },
  scroll: { padding: 24, paddingBottom: 60 },

  pageHeader:  { marginBottom: 28 },
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

  // Cards
  card: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 14,
  },

  // Form elements
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

  // Buttons
  btnPrimary: {
    backgroundColor: T.accent,
    borderRadius: R,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  btnSecondary: {
    backgroundColor: T.paper,
    borderRadius: R,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.rule,
  },
  btnSecondaryText: { color: T.inkSub, fontWeight: '600', fontSize: 15 },
  btnDisabled: { opacity: 0.45 },

  // Loading
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  loadingText: { fontSize: 14, color: T.inkSub },

  // Question cards
  questionCard: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 20,
    marginBottom: 12,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  questionIndex: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: T.accent,
    textTransform: 'uppercase',
  },
  questionIndexRule: {
    flex: 1,
    height: 1,
    backgroundColor: T.rule,
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
    lineHeight: 22,
    marginBottom: 16,
  },
  answerInput: {
    fontSize: 14,
    color: T.ink,
    borderWidth: 1,
    borderColor: T.rule,
    borderRadius: R,
    padding: 14,
    minHeight: 96,
    lineHeight: 22,
    textAlignVertical: 'top',
    backgroundColor: T.canvas,
  },
  answerInputFilled: {
    borderColor: T.accent + '44',
    backgroundColor: T.accentDim,
  },

  // Score / results
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
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  scoreSub: { fontSize: 13, color: T.inkSub, marginBottom: 18 },
  scoreBarBg: {
    height: 6,
    backgroundColor: T.rule,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scoreBarFill: { height: 6, borderRadius: 100 },

  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: T.inkSub,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 15,
    color: T.ink,
    lineHeight: 24,
  },

  // Badge earned
  badgeCard: {
    backgroundColor: T.goldDim,
    borderWidth: 1,
    borderColor: T.gold + '28',
    borderRadius: R + 4,
    padding: 22,
    marginBottom: 14,
  },
  badgeEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: T.gold,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  badgeSub: { fontSize: 13, color: T.inkSub },

  // Error notice
  errorCard: {
    backgroundColor: T.dangerDim,
    borderWidth: 1,
    borderColor: T.danger + '28',
    borderRadius: R,
    padding: 14,
    marginBottom: 14,
  },
  errorText: { fontSize: 14, color: T.danger },

  // Badge modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#1A171488',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalBox: {
    backgroundColor: T.paper,
    borderRadius: R + 4,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 6,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    color: T.inkSub,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: T.gold,
    borderRadius: R,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  modalBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return <View style={s.divider} />;
}

function BadgeModal({
  visible,
  skill,
  score,
  onClose,
}: {
  visible: boolean;
  skill: string;
  score: number;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.modalBackdrop} onPress={onClose}>
        <Pressable style={s.modalBox} onPress={e => e.stopPropagation()}>
          <Text style={{ fontSize: 40, marginBottom: 16 }}>🏅</Text>
          <Text style={s.modalTitle}>Badge earned</Text>
          <Text style={s.modalBody}>
            You scored {score}/100 and earned the{'\n'}
            <Text style={{ fontWeight: '700', color: T.gold }}>{skill} Verified</Text> badge.
          </Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.85} style={s.modalBtn}>
            <Text style={s.modalBtnText}>Nice</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ScoreColor(score: number): string {
  if (score >= 80) return T.green;
  if (score >= 50) return T.gold;
  return T.danger;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function InterviewScreen() {
  const { user } = useAuth();

  const [skill,         setSkill]         = useState('');
  const [questions,     setQuestions]     = useState<string[]>([]);
  const [answers,       setAnswers]       = useState<string[]>([]);
  const [score,         setScore]         = useState<number | null>(null);
  const [feedback,      setFeedback]      = useState('');
  const [loading,       setLoading]       = useState(false);
  const [loadingMsg,    setLoadingMsg]    = useState('');
  const [error,         setError]         = useState('');
  const [badgeEarned,   setBadgeEarned]   = useState(false);
  const [badgeModal,    setBadgeModal]    = useState(false);

  const ensurePuterAuth = async () => {
    const signedIn = await puter.auth.isSignedIn();
    if (!signedIn) await puter.auth.signIn();
  };

  const generateQuestions = async () => {
    if (!skill.trim()) return;
    setError('');
    setScore(null);
    setFeedback('');
    setQuestions([]);
    setBadgeEarned(false);
    setLoading(true);
    setLoadingMsg('Generating questions…');

    try {
      await ensurePuterAuth();

      const response = await puter.ai.chat(`
Generate exactly 5 technical interview questions for ${skill}.
Return ONLY a JSON array of strings, no markdown, no explanation.
Example: ["Question 1","Question 2","Question 3","Question 4","Question 5"]
`);

      const generated = JSON.parse(response as string);
      setQuestions(generated);
      setAnswers(new Array(generated.length).fill(''));

    } catch (err) {
      console.log(err);
      setError('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const evaluateInterview = async () => {
    const unanswered = answers.filter(a => !a.trim()).length;
    if (unanswered > 0) {
      setError(`Please answer all questions before submitting. ${unanswered} left.`);
      return;
    }

    setError('');
    setLoading(true);
    setLoadingMsg('Evaluating your answers…');

    try {
      await ensurePuterAuth();

      const response = await puter.ai.chat(`
You are a senior technical interviewer. Evaluate the following interview.

Skill: ${skill}

Questions and Answers:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i]}`).join('\n\n')}

Return ONLY valid JSON with no markdown or explanation:
{"score": <integer 0-100>, "feedback": "<2-3 sentence summary>"}
`);

      const result = JSON.parse(response as string);
      setScore(result.score);
      setFeedback(result.feedback);

      if (result.score >= 80 && user?.name) {
        try {
          await api.post('/badges', {
            user:  user.name,
            badge: `${skill} Verified`,
            score: result.score,
          });
          setBadgeEarned(true);
          setBadgeModal(true);
        } catch (badgeErr) {
          console.log('Badge save failed:', badgeErr);
        }
      }

    } catch (err) {
      console.log(err);
      setError('Failed to evaluate your answers. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMsg('');
    }
  };

  const reset = () => {
    setSkill('');
    setQuestions([]);
    setAnswers([]);
    setScore(null);
    setFeedback('');
    setError('');
    setBadgeEarned(false);
  };

  const allAnswered = questions.length > 0 && answers.every(a => a.trim().length > 0);

  return (
    <SafeAreaView style={s.safe}>
      <BadgeModal
        visible={badgeModal}
        skill={skill}
        score={score ?? 0}
        onClose={() => setBadgeModal(false)}
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.pageHeader}>
          <Text style={s.eyebrow}>AI · Interview</Text>
          <Text style={s.title}>Skill Interview</Text>
        </View>

        {/* Skill input */}
        <View style={s.card}>
          <Text style={s.label}>Skill to be assessed</Text>
          <TextInput
            placeholder="e.g. TypeScript, System Design"
            placeholderTextColor={T.inkGhost}
            value={skill}
            onChangeText={v => { setSkill(v); setError(''); }}
            returnKeyType="done"
            onSubmitEditing={generateQuestions}
            editable={!loading}
            style={s.input}
          />

          <Divider />

          <TouchableOpacity
            onPress={questions.length > 0 ? reset : generateQuestions}
            activeOpacity={0.85}
            disabled={loading || !skill.trim()}
            style={[
              questions.length > 0 ? s.btnSecondary : s.btnPrimary,
              (loading || !skill.trim()) && s.btnDisabled,
            ]}
          >
            <Text style={questions.length > 0 ? s.btnSecondaryText : s.btnPrimaryText}>
              {loading && !questions.length
                ? 'Generating…'
                : questions.length > 0
                ? 'Start over'
                : 'Generate interview'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error notice */}
        {error ? (
          <View style={s.errorCard}>
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Loading */}
        {loading && (
          <View style={s.loadingBlock}>
            <ActivityIndicator color={T.accent} />
            <Text style={s.loadingText}>{loadingMsg}</Text>
          </View>
        )}

        {/* Questions */}
        {!loading && questions.map((question, i) => (
          <View key={i} style={s.questionCard}>
            <View style={s.questionMeta}>
              <Text style={s.questionIndex}>Q{i + 1}</Text>
              <View style={s.questionIndexRule} />
            </View>
            <Text style={s.questionText}>{question}</Text>
            <TextInput
              multiline
              value={answers[i]}
              onChangeText={text => {
                const copy = [...answers];
                copy[i] = text;
                setAnswers(copy);
              }}
              placeholder="Write your answer here…"
              placeholderTextColor={T.inkGhost}
              style={[s.answerInput, answers[i]?.trim() && s.answerInputFilled]}
            />
          </View>
        ))}

        {/* Submit */}
        {questions.length > 0 && !loading && score === null && (
          <TouchableOpacity
            onPress={evaluateInterview}
            activeOpacity={0.85}
            disabled={!allAnswered}
            style={[s.btnPrimary, !allAnswered && s.btnDisabled, { marginBottom: 14 }]}
          >
            <Text style={s.btnPrimaryText}>Submit interview</Text>
          </TouchableOpacity>
        )}

        {/* Results */}
        {score !== null && !loading && (
          <>
            {/* Badge */}
            {badgeEarned && (
              <View style={s.badgeCard}>
                <Text style={s.badgeEyebrow}>Badge earned</Text>
                <Text style={s.badgeName}>{skill} Verified</Text>
                <Text style={s.badgeSub}>Score of {score}/100 — added to your profile.</Text>
              </View>
            )}

            {/* Score card */}
            <View style={s.scoreCard}>
              <Text style={s.scoreEyebrow}>Your result</Text>
              <Text style={[s.scoreValue, { color: ScoreColor(score) }]}>
                {score}<Text style={{ fontSize: 24, fontWeight: '400', color: T.inkGhost }}>/100</Text>
              </Text>
              <Text style={s.scoreSub}>{skill} interview</Text>

              <View style={s.scoreBarBg}>
                <View style={[s.scoreBarFill, {
                  width: `${score}%`,
                  backgroundColor: ScoreColor(score),
                }]} />
              </View>

              <Text style={s.feedbackLabel}>Feedback</Text>
              <Text style={s.feedbackText}>{feedback}</Text>
            </View>

            {/* Retry */}
            <TouchableOpacity
              onPress={reset}
              activeOpacity={0.85}
              style={s.btnSecondary}
            >
              <Text style={s.btnSecondaryText}>Try another skill</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}