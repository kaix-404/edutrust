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

export default function SkillRecommendationsScreen() {
  const [userName, setUserName] =
    useState('');

  const [recommendations, setRecommendations] =
    useState<any[]>([]);

  const [searched, setSearched] =
    useState(false);

  const loadRecommendations =
    async () => {
      try {
        const response =
          await api.get(
            `/recommendations/skill/${encodeURIComponent(
              userName
            )}`
          );

        setRecommendations(
          response.data || []
        );

        setSearched(true);

      } catch (error) {
        console.log(error);

        setRecommendations([]);
        setSearched(true);
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
          Skill Recommendations
        </Text>

        <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
          onSubmitEditing={loadRecommendations}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={loadRecommendations}
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
            Find Recommendations
          </Text>
        </TouchableOpacity>

        {recommendations.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 15,
              }}
            >
              Recommended Skills
            </Text>

            {recommendations.map(
              (
                recommendation,
                index
              ) => (
                <View
                  key={`${recommendation.skill}-${index}`}
                  style={{
                    backgroundColor:
                      '#F9FAFB',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                    }}
                  >
                    ⭐{' '}
                    {
                      recommendation.skill
                    }
                  </Text>

                  <Text
                    style={{
                      color: '#666',
                      marginTop: 5,
                    }}
                  >
                    Recommended by{' '}
                    {
                      recommendation.score
                    }{' '}
                    similar users
                  </Text>

                  {recommendation
                    .suggestedBy &&
                    recommendation
                      .suggestedBy
                      .length >
                      0 && (
                      <Text
                        style={{
                          marginTop: 5,
                          color:
                            '#2563EB',
                        }}
                      >
                        Similar Users:{' '}
                        {recommendation.suggestedBy.join(
                          ', '
                        )}
                      </Text>
                    )}
                </View>
              )
            )}
          </View>
        )}

        {searched &&
          recommendations.length ===
            0 && (
            <View
              style={{
                backgroundColor:
                  'white',
                padding: 20,
                borderRadius: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                No Recommendations Found
              </Text>

              <Text
                style={{
                  color: '#666',
                }}
              >
                This user either has
                no skills recorded or
                there are no similar
                users available yet.
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}