import { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import api from '../../services/api';

export default function RoleAnalysisScreen() {
  const [userName, setUserName] =
    useState('');

  const [roleName, setRoleName] =
    useState('');

  const [result, setResult] =
    useState<any>(null);

  const [recommendations, setRecommendations] =
    useState<string[]>([]); 

  const analyzeCandidate = async () => {
    try {
      const response =
        await api.get(
          `/roles/gap/${encodeURIComponent(
            roleName
          )}/${encodeURIComponent(
            userName
          )}`
        );

      setResult(response.data);
      
      const recommendationResponse =
        await api.get(
          `/roles/recommendations/${encodeURIComponent(
            roleName
          )}/${encodeURIComponent(
            userName
          )}`
        );

      setRecommendations(
        recommendationResponse.data
          .recommendations || []
      );

    } catch (error) {
      console.log(error);
    }
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
          Role Analysis
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

        <TextInput
          placeholder="Role Name"
          value={roleName}
          onChangeText={setRoleName}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={analyzeCandidate}
          style={{
            backgroundColor: '#111827',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 20,
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

        {result && (
          <>
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
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                Match Score
              </Text>

              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 'bold'
                }}
              >
                {result.matchScore}%
              </Text>

              <Text
                style={{
                  color: '#666',
                }}
              >
                {result.user} vs {result.role}
              </Text>
            </View>

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
                Matched Skills
              </Text>

              {result.matchedSkills.length > 0 ? (
                result.matchedSkills.map(
                  (
                    skill: string,
                    index: number
                  ) => (
                    <Text
                      key={index}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      ✓ {skill}
                    </Text>
                  )
                )
              ) : (
                <Text>
                  No matching skills found.
                </Text>
              )}
            </View>

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
                Missing Skills
              </Text>

              {result.missingSkills.length > 0 ? (
                result.missingSkills.map(
                  (
                    skill: string,
                    index: number
                  ) => (
                    <Text
                      key={index}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      ✗ {skill}
                    </Text>
                  )
                )
              ) : (
                <Text>
                  No missing skills.
                </Text>
              )}
            </View>
            {recommendations.length > 0 && (
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
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 12,
                  }}
                >
                  Recommended Learning Path
                </Text>

                {recommendations.map(
                  (skill, index) => (
                    <Text
                      key={index}
                      style={{
                        marginBottom: 8,
                      }}
                    >
                      {index + 1}. {skill}
                    </Text>
                  )
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}