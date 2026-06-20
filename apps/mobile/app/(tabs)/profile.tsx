import { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import { router } from 'expo-router';

import api from '../../services/api';

import {
  useAuth,
} from '../../context/AuthContext';

export default function ProfileScreen() {
  const {
    user,
    logout,
  } = useAuth();

  const [skills, setSkills] =
    useState<string[]>([]);

  const [trustScore, setTrustScore] =
    useState(0);

  const [endorsements, setEndorsements] =
    useState(0);

  const [influenceScore, setInfluenceScore] =
    useState(0);

  useEffect(() => {
    if (user?.name) {
      loadProfileStats();
    }
  }, [user]);

  const loadProfileStats =
    async () => {
      try {
        const skillsResponse =
          await api.get(
            `/users/${encodeURIComponent(
              user.name
            )}/skills`
          );

        setSkills(
          skillsResponse.data.skills || []
        );

        const endorsementResponse =
          await api.get(
            `/endorsements/${encodeURIComponent(
              user.name
            )}`
          );

        setTrustScore(
          endorsementResponse.data.trustScore || 0
        );

        setEndorsements(
          endorsementResponse.data.endorsements || 0
        );

        const influenceResponse =
          await api.get(
            '/endorsements/influence'
          );

        const currentUser =
          influenceResponse.data.find(
            (item: any) =>
              item.user === user.name
          );

        setInfluenceScore(
          currentUser?.influenceScore || 0
        );

      } catch (error) {
        console.log(error);
      }
    };

  const handleLogout =
    async () => {
      await logout();

      router.replace('/login');
    };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: '#F5F7FB',
        flexGrow: 1,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        My Profile
      </Text>

      <View
        style={{
          backgroundColor: 'white',
          padding: 24,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
          }}
        >
          {user?.name}
        </Text>

        <Text
          style={{
            color: '#666',
            marginTop: 4,
          }}
        >
          {user?.email}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
            }}
          >
            {skills.length}
          </Text>

          <Text>Skills</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
            }}
          >
            {trustScore}
          </Text>

          <Text>Trust</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
            }}
          >
            {endorsements}
          </Text>

          <Text>Endorsements</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
            }}
          >
            {influenceScore}
          </Text>

          <Text>Influence</Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 16,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          Skills
        </Text>

        {skills.length > 0 ? (
          skills.map(
            (skill, index) => (
              <Text
                key={index}
                style={{
                  marginBottom: 8,
                }}
              >
                ✓ {skill}
              </Text>
            )
          )
        ) : (
          <Text>
            No skills added yet.
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: '#DC2626',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontWeight: '600',
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}