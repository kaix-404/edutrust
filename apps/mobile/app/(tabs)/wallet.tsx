import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import api from '../../services/api';

export default function WalletScreen() {
  const [userName, setUserName] = useState('');
  const [skill, setSkill] = useState('');

  const addSkill = async () => {
    try {
      await api.post(
        `/users/${userName}/skills`,
        { skill }
      );

      Alert.alert('Success', 'Skill added');

      setSkill('');

    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to add skill');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20
        }}
      >
        Add Skill
      </Text>

      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 15,
          marginBottom: 15
        }}
      />

      <TextInput
        placeholder="Skill"
        value={skill}
        onChangeText={setSkill}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20
        }}
      />

      <TouchableOpacity
        onPress={addSkill}
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
          Add Skill
        </Text>
      </TouchableOpacity>
    </View>
  );
}