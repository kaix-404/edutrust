import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import api from '../../services/api';

export default function EndorsementsScreen() {
  const [fromUser, setFromUser] = useState('');
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');

  const [searchUser, setSearchUser] = useState('');

  const [endorsers, setEndorsers] = useState<string[]>([]);
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [numberOfEndorsements, setNumberOfEndorsements] = useState<number | null>(null);

  const endorseUser = async () => {
    try {
      await api.post('/endorsements', {
        endorser: fromUser,
        endorsee: toUser,
      });

      setMessage('Endorsement created successfully');
      setFromUser('');
      setToUser('');
    } catch (error) {
      console.log(error);

      setMessage('Failed to create endorsement');
    }
  };

  const fetchTrustData = async () => {
    try {
      const response =
        await api.get(
          `/endorsements/${encodeURIComponent(
            searchUser
          )}`
        );

      setEndorsers(
        response.data.endorsedBy || []
      );

      setTrustScore(
        response.data.trustScore || 0
      );

      setNumberOfEndorsements(
        response.data.endorsements || 0
      );

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Failed to fetch trust data'
      );
    }
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
          Trust Network
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 10,
          }}
        >
          Create Endorsement
        </Text>

        <TextInput
          placeholder="From User"
          value={fromUser}
          onChangeText={setFromUser}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="To User"
          value={toUser}
          onChangeText={setToUser}
          onSubmitEditing={endorseUser}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={endorseUser}
          style={{
            backgroundColor: '#111827',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            Endorse User
          </Text>
        </TouchableOpacity>

        {message ? (
          <View
            style={{
            backgroundColor: '#DCFCE7',
            padding: 12,
            borderRadius: 12,
            marginBottom: 16,
            }}
          >
            <Text>{message}</Text>
          </View>
        ) : null}

        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 10,
          }}
        >
          Check Trust Profile
        </Text>

        <TextInput
          placeholder="User Name"
          value={searchUser}
          onChangeText={setSearchUser}
          onSubmitEditing={fetchTrustData}
          returnKeyType="done"
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={fetchTrustData}
          style={{
            backgroundColor: '#2563EB',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 25,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '600',
            }}
          >
            View Trust Profile
          </Text>
        </TouchableOpacity>

        {trustScore !== null && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
              }}
            >
              Trust Score: {trustScore}
            </Text>
            <Text
              style={{
                fontSize: 16
              }}
            >
              Number of Endorsements: {numberOfEndorsements}
            </Text>
          </View>
        )}


        {endorsers.length > 0 && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Endorsed By
            </Text>

            {endorsers.map(
              (endorser, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: 16,
                    marginBottom: 6,
                  }}
                >
                  • {endorser}
                </Text>
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}