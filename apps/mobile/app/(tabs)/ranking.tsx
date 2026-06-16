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

export default function CandidateRankingScreen() {
  const [role, setRole] =
    useState('');

  const [rankings, setRankings] =
    useState<any[]>([]);

  const loadRankings = async () => {
    try {
      const response =
        await api.get(
          `/roles/rank/${encodeURIComponent(
            role
          )}`
        );

      setRankings(
        response.data || []
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

    return `#${index + 1}`;
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
          Candidate Ranking
        </Text>

        <TextInput
          placeholder="Role Name"
          value={role}
          onChangeText={setRole}
          onSubmitEditing={loadRankings}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={loadRankings}
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
            Rank Candidates
          </Text>
        </TouchableOpacity>

        {rankings.map(
          (candidate, index) => (
            <View
              key={candidate.user}
              style={{
                backgroundColor:
                  'white',
                padding: 20,
                borderRadius: 18,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                }}
              >
                {getMedal(index)}{' '}
                {candidate.user}
              </Text>

              <Text
                style={{
                  marginTop: 10,
                  fontWeight: '600'
                }}
              >
                Final Score:{' '}
                {candidate.finalScore}
              </Text>

              <Text>
                Match Score:{' '}
                {candidate.matchScore}%
              </Text>

              <Text>
                Trust Score:{' '}
                {candidate.trustScore}
              </Text>

              <Text>
                Influence Score:{' '}
                {candidate.influenceScore}
              </Text>
            </View>
          )
        )}

        {rankings.length > 0 && (
          <View
            style={{
              backgroundColor:
                'white',
              padding: 20,
              borderRadius: 18,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 10,
              }}
            >
              Top Candidate
            </Text>

            <Text>
              🎯 {
                rankings[0].user
              }
            </Text>

            <Text>
              Overall Score:{' '}
              {
                rankings[0]
                  .finalScore
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}