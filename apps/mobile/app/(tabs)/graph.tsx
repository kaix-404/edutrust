import { useState } from 'react';

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import api from '../../services/api';

type CareerResponse = {
  success: boolean;
  path: string[];
};

export default function GraphScreen() {
  const [startSkill, setStartSkill] =
    useState('');

  const [goalSkill, setGoalSkill] =
    useState('');

  const [careerPath, setCareerPath] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(false);

  const generateRoadmap = async () => {
    if (!startSkill || !goalSkill) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.get<CareerResponse>(
          `/careers/${encodeURIComponent(
            startSkill
          )}/${encodeURIComponent(
            goalSkill
          )}`
        );

      setCareerPath(response.data.path);

    } catch (error) {
      console.log(error);

      setCareerPath([]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB'
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 10
          }}
        >
          Career Roadmap
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#666',
            marginBottom: 30
          }}
        >
          Generate your personalized
          learning path
        </Text>

        <TextInput
          placeholder="Starting Skill"
          value={startSkill}
          onChangeText={setStartSkill}
          style={{
            backgroundColor: 'white',
            padding: 18,
            borderRadius: 16,
            marginBottom: 16,
            fontSize: 16
          }}
        />

        <TextInput
          placeholder="Goal Skill"
          value={goalSkill}
          onChangeText={setGoalSkill}
          style={{
            backgroundColor: 'white',
            padding: 18,
            borderRadius: 16,
            marginBottom: 20,
            fontSize: 16
          }}
        />

        <TouchableOpacity
          onPress={generateRoadmap}
          style={{
            backgroundColor: '#111827',
            padding: 18,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 30
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '600'
            }}
          >
            Generate Roadmap
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
          />
        )}

        {careerPath.map((skill, index) => (
          <View
            key={index}
            style={{
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: '100%',
                padding: 24,
                backgroundColor: 'white',
                borderRadius: 20,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {skill}
              </Text>
            </View>

            {index !== careerPath.length - 1 && (
              <Text
                style={{
                  fontSize: 40,
                  marginBottom: 10
                }}
              >
                ↓
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}