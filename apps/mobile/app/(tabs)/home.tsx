import React, {
  useEffect,
  useState,
} from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from 'react-native';

import api from '../../services/api';

export default function AnalyticsScreen() {
  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics =
    async () => {
      try {
        const response =
          await api.get(
            '/analytics'
          );

        setData(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  if (!data) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          '#F5F7FB',
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
          Analytics Dashboard
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
        >
          {[
            {
              label: 'Users',
              value: data.totalUsers,
            },
            {
              label: 'Skills',
              value: data.totalSkills,
            },
            {
              label: 'Roles',
              value: data.totalRoles,
            },
            {
              label: 'Endorsements',
              value: data.totalEndorsements,
            },
          ].map((card) => (
            <View
              key={card.label}
              style={{
                width: '48%',
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 16,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {card.value ?? 0}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                {card.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginBottom: 15,
          }}
        >
          <View
            style={{
              flex: 1,
              minWidth: 160,
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              marginRight: 8,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              👑 Most Trusted User
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 5,
              }}
            >
              {data.mostTrustedUser.name}
            </Text>

            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              Trust Score: {data.mostTrustedUser.trustScore}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: 160,
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              marginRight: 8,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              🌟 Most Influential User
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 5,
              }}
            >
              {data.mostInfluentialUser.name}
            </Text>

            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              Influence: {data.mostInfluentialUser.influenceScore}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              minWidth: 160,
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
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              🔥 Most Popular Skill
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: 5,
              }}
            >
              {data.mostPopularSkill.skill}
            </Text>

            <Text
              style={{
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              Used by {data.mostPopularSkill.count} users
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}