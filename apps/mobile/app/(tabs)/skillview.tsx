import { useEffect, useState } from 'react';

import { Link } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';

import api from '../../services/api';

export default function WalletScreen() {
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
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
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
        Skills
      </Text>

      <FlatList
        data={skills}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10
            }}
          >
            <Text style={{ fontSize: 15 }}>
              {item.name}
            </Text>
          </View>
        )}
      />

      <Text
        style={{
          fontSize: 16,
          marginTop: 20,
          textAlign: 'center'
        }}
      >
        Don't see your skill? Add it 
        <Link 
          href="/skills"
          style={{ 
            color: 'blue'
          }}
        > here
        </Link>
      </Text>

    </View>
  );
}