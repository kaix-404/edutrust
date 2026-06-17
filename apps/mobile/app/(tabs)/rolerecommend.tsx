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

export default function RoleRecommendationsScreen() {
  const [userName, setUserName] =
    useState('');

  const [recommendations, setRecommendations] =
    useState<any[]>([]);

  const loadRecommendations = async () => {
    try {
      const response =
        await api.get(
          `/roles/recommend/${encodeURIComponent(
            userName
          )}`
        );

      setRecommendations(
        Array.isArray(response.data)
          ? response.data
          : response.data.recommendations || []
      );

    } catch (error) {
      console.log(error);
    }
  };

  const getMedal = (
    index: number
  ) => {
    if (index === 0) {
      return '🥇';
    }

    if (index === 1) {
      return '🥈';
    }

    if (index === 2) {
      return '🥉';
    }

    return '📌';
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
          Role Recommendations
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
            Find Best Roles
          </Text>
        </TouchableOpacity>

        {recommendations.length === 0 && (
          <View
            style={{
              backgroundColor: 'white',
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
              No Role Matches Found
            </Text>

            <Text
              style={{
                color: '#666',
              }}
            >
              This user has no recorded skills yet.
              Add skills to receive career
              recommendations.
            </Text>
          </View>
        )}

        {recommendations.length > 0 && (
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
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              🎯 Best Match
            </Text>

            <Text
              style={{
                fontSize: 22,
                marginTop: 10,
              }}
            >
              {recommendations[0].role}
            </Text>

            <Text>
              Match Score:{' '}
              {recommendations[0].matchScore}%
            </Text>
          </View>
        )}

        {recommendations.map(
          (item, index) => (
            <View
              key={item.role}
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 16,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                {getMedal(index)}{' '}
                {item.role}
              </Text>

              <Text>
                Match Score:{' '}
                {item.matchScore}%
              </Text>

              <Text
                style={{
                  marginTop: 12,
                  fontWeight: '600',
                }}
              >
                Matched Skills
              </Text>

              {item.matchedSkills.length >
              0 ? (
                item.matchedSkills.map(
                  (
                    skill: string,
                    i: number
                  ) => (
                    <Text key={i}>
                      ✓ {skill}
                    </Text>
                  )
                )
              ) : (
                <Text>
                  No matching skills
                </Text>
              )}

              <Text
                style={{
                  marginTop: 12,
                  fontWeight: '600',
                }}
              >
                Missing Skills
              </Text>

              {item.missingSkills.length >
              0 ? (
                item.missingSkills.map(
                  (
                    skill: string,
                    i: number
                  ) => (
                    <Text key={i}>
                      • {skill}
                    </Text>
                  )
                )
              ) : (
                <Text>
                  No missing skills
                </Text>
              )}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}