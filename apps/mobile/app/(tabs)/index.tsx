import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView
} from 'react-native';

import api from '../../services/api';

export default function HomeScreen() {
  const [skills, setSkills] = useState<{ name: string }[]>([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills');

      setSkills(response.data);

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
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        EduTrust Skills
      </Text>

      <FlatList
        data={skills}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10
            }}
          >
            <Text style={{ fontSize: 18 }}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}