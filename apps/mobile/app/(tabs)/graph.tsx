import { useEffect, useState } from 'react';

import {
  View,
  Text,
  SafeAreaView,
  ScrollView
} from 'react-native';

import api from '../../services/api';

type GraphData = {
  user: string;
  skills: string[];
};

export default function GraphScreen() {
  const [graph, setGraph] =
    useState<GraphData | null>(null);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const response = await api.get(
        '/graph/Kai'
      );

      setGraph(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        Skill Graph
      </Text>

      {graph && (
        <ScrollView>
          <View
            style={{
              padding: 20,
              borderWidth: 2,
              borderRadius: 16,
              marginBottom: 20
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20
              }}
            >
              {graph.user}
            </Text>

            {graph.skills.map((skill, index) => (
              <View
                key={index}
                style={{
                  marginLeft: 20,
                  marginBottom: 15
                }}
              >
                <Text
                  style={{
                    fontSize: 18
                  }}
                >
                  └── {skill}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}