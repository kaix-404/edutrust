import { Tabs } from 'expo-router';
import React from 'react';
import { Drawer } from 'expo-router/drawer';

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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skillview"
        options={{
          title: 'Skills',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recruiter"
        options={{
          title: 'Recruiter',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="briefcase.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name="line.3.horizontal"
              color={color}
            />
          ),
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
        name="recommend"
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
    </Tabs>
  );
}