import { Tabs } from 'expo-router';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skillview"
        options={{
          title: 'Skills',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="lightning-bolt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-group" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recruiter"
        options={{
          title: 'Recruiter',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="account-tie" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="menu" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skills"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="role"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="graph"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="rolerecommend"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="endorsements"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="skillrecommend"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}