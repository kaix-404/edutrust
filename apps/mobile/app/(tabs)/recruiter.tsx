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

  const loadCandidate = async () => {
    if (!userName.trim()) {
      return;
    }

    setCandidateName(userName.trim());

    try {
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

        {loading && (
          <ActivityIndicator
            size="large"
          />
        )}

        {!loading &&
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
      </ScrollView>
    </SafeAreaView>
  );
}