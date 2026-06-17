import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView
} from 'react-native';

import api from '../../services/api';

export default function HomeScreen() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response =
        await api.get(
          '/analytics'
        );

      setAnalytics(
        response.data
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F7FB'
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        EduTrust 
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent:
            'space-between',
        }}
      >
        {[
          {
            label: 'Users',
            value:
              analytics?.totalUsers,
          },
          {
            label: 'Skills',
            value:
              analytics?.totalSkills,
          },
          {
            label: 'Roles',
            value:
              analytics?.totalRoles,
          },
          {
            label: 'Endorsements',
            value:
              analytics?.totalEndorsements,
          },
        ].map(card => (
          <View
            key={card.label}
            style={{
              width: '48%',
              backgroundColor:
                'white',
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
              }}
            >
              {card.value ?? 0}
            </Text>

            <Text>
              {card.label}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}