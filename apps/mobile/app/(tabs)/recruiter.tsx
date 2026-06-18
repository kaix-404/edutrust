import { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import api from '../../services/api';

export default function RecruiterScreen() {
  const [userName, setUserName] = useState('');
  const [candidateName, setCandidateName] = useState('');

  const [skills, setSkills] =
    useState<string[]>([]);

  const [influence, setInfluence] = 
    useState<number | null>(null);
    
  const [endorsers, setEndorsers] =
    useState<string[]>([]);

  const [trustScore, setTrustScore] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [searched, setSearched] =
    useState(false);

  const [compareName, setCompareName] =
    useState('');

  const [comparison, setComparison] =
    useState<any>(null);

  const [mode, setMode] =
    useState<'analysis' | 'comparison' | null>(
      null
    );

  const loadCandidate = async () => {
    if (!userName.trim()) {
      return;
    }

    setCandidateName(userName.trim());

    try {
      setMode('analysis');
      setComparison(null);
      setLoading(true);
      setSearched(true);

      const graphResponse =
        await api.get(
          `/graph/${encodeURIComponent(
            userName
          )}`
        );

      setSkills(
        graphResponse.data.skills || []
      );

      const endorsementResponse =
        await api.get(
          `/endorsements/${encodeURIComponent(
            userName
          )}`
        );

      setEndorsers(
        endorsementResponse.data.endorsedBy || []
      );

      setTrustScore(
        endorsementResponse.data.trustScore || 0
      );
    } catch (error) {
      console.log(error);

      setSkills([]);
      setEndorsers([]);
      setTrustScore(0);
    } finally {
      setLoading(false);
      setUserName('');
    }
  };

  const compareCandidates = async () => {
      if (
        !userName.trim() ||
        !compareName.trim()
      ) {
        return;
      }

      try {
        setMode('comparison');

        const response =
          await api.get(
            `/compare/${encodeURIComponent(
              userName
            )}/${encodeURIComponent(
              compareName
            )}`
          );

        if (userName.trim() === compareName.trim()) {
          alert(
            'Please enter two different candidate names for comparison.'
          );
          return;
        }

        setComparison(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  const getProfileStrength = (
    score: number
  ) => {
    if (score >= 50) {
      return 'Expert';
    }

    if (score >= 20) {
      return 'Strong';
    }

    if (score > 0) {
      return 'Developing';
    }

    return 'Beginner';
  };

  const winner = (
    a: number,
    b: number
  ) => {
    if (a > b) return 1;
    if (b > a) return 2;
    return 0;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Recruiter Dashboard
        </Text>

        <TextInput
          placeholder="Candidate Name"
          value={userName}
          onChangeText={setUserName}
          onSubmitEditing={loadCandidate}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={loadCandidate}
          style={{
            backgroundColor: '#111827',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            Analyze Candidate
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Compare With"
          value={compareName}
          onChangeText={setCompareName}
          onSubmitEditing={compareCandidates}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
        <TouchableOpacity
          onPress={compareCandidates}
          style={{
            backgroundColor: '#2563EB',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            Compare Candidates
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
          />
        )}

        {!loading &&
          mode === 'analysis' &&
          searched &&
          trustScore !== null && (
            <>
              {/* Candidate Card */}

              <View
                style={{
                  backgroundColor: 'white',
                  padding: 24,
                  borderRadius: 18,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                  }}
                >
                  {candidateName}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: '#666',
                    fontSize: 16,
                  }}
                >
                  {getProfileStrength(
                    trustScore
                  )}{' '}
                  Candidate
                </Text>
              </View>

              {/* Stats */}

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}
                  >
                    {trustScore}
                  </Text>

                  <Text>
                    Trust Score
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: 'bold',
                    }}
                  >
                    {skills.length}
                  </Text>

                  <Text>
                    Skills
                  </Text>
                </View>
              </View>

              {/* Skills */}

              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 16,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 12,
                  }}
                >
                  Verified Skills
                </Text>

                {skills.length > 0 ? (
                  skills.map(
                    (skill, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          marginBottom: 8,
                        }}
                      >
                        ✓ {skill}
                      </Text>
                    )
                  )
                ) : (
                  <Text
                    style={{
                      color: '#888',
                    }}
                  >
                    No verified skills found.
                  </Text>
                )}
              </View>

              {/* Endorsements */}

              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 12,
                  }}
                >
                  Endorsements
                </Text>

                {endorsers.length > 0 ? (
                  endorsers.map(
                    (
                      endorser,
                      index
                    ) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          marginBottom: 8,
                        }}
                      >
                        👤 {endorser}
                      </Text>
                    )
                  )
                ) : (
                  <Text
                    style={{
                      color: '#888',
                    }}
                  >
                    No endorsements yet.
                  </Text>
                )}
              </View>
            </>
          )}

        {mode === 'comparison' && 
        comparison && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 16,
              }}
            >
              🏆 Candidate Comparison
            </Text>

            <Text
              style={{
                marginBottom: 10,
              }}
            >
              {comparison.candidate1.name}
              {' vs '}
              {comparison.candidate2.name}
            </Text>

            {/* Trust */}

            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Trust Score
            </Text>

            <Text>
              {comparison.candidate1.trustScore}
              {winner(
                comparison.candidate1.trustScore,
                comparison.candidate2.trustScore
              ) === 1
                ? ' 🏆'
                : ''}
            </Text>

            <Text
              style={{
                marginBottom: 12,
              }}
            >
              {comparison.candidate2.trustScore}
              {winner(
                comparison.candidate1.trustScore,
                comparison.candidate2.trustScore
              ) === 2
                ? ' 🏆'
                : ''}
            </Text>

            {/* Influence */}

            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Influence Score
            </Text>

            <Text>
              {comparison.candidate1.influenceScore}
              {winner(
                comparison.candidate1.influenceScore,
                comparison.candidate2.influenceScore
              ) === 1
                ? ' 🏆'
                : ''}
            </Text>

            <Text
              style={{
                marginBottom: 12,
              }}
            >
              {comparison.candidate2.influenceScore}
              {winner(
                comparison.candidate1.influenceScore,
                comparison.candidate2.influenceScore
              ) === 2
                ? ' 🏆'
                : ''}
            </Text>

            {/* Skills */}

            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Skill Count
            </Text>

            <Text>
              {comparison.candidate1.skillCount}
              {winner(
                comparison.candidate1.skillCount,
                comparison.candidate2.skillCount
              ) === 1
                ? ' 🏆'
                : ''}
            </Text>

            <Text
              style={{
                marginBottom: 12,
              }}
            >
              {comparison.candidate2.skillCount}
              {winner(
                comparison.candidate1.skillCount,
                comparison.candidate2.skillCount
              ) === 2
                ? ' 🏆'
                : ''}
            </Text>

            {/* Endorsements */}

            <Text
              style={{
                fontWeight: 'bold',
              }}
            >
              Endorsements
            </Text>

            <Text>
              {comparison.candidate1.endorsements}
              {winner(
                comparison.candidate1.endorsements,
                comparison.candidate2.endorsements
              ) === 1
                ? ' 🏆'
                : ''}
            </Text>

            <Text>
              {comparison.candidate2.endorsements}
              {winner(
                comparison.candidate1.endorsements,
                comparison.candidate2.endorsements
              ) === 2
                ? ' 🏆'
                : ''}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}