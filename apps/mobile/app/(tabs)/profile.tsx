import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import api from '../../services/api';

export default function ProfileScreen() {
  const [name, setName] = useState('');

  const createUser = async () => {
    try {
      await api.post('/users', {
        name
      });

      Alert.alert('Success', 'User created');

      setName('');

    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to create user');
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
        Create Profile
      </Text>

      <TextInput
        placeholder="Enter username"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20
        }}
      />

      <TouchableOpacity
        onPress={createUser}
        style={{
          backgroundColor: 'black',
          padding: 15,
          borderRadius: 10
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 18
          }}
        >
          Create User
        </Text>
      </TouchableOpacity>
    </View>
  );

}