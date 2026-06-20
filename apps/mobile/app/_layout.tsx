import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNavigator() {
  const colorScheme = useColorScheme();

  const { 
    token,
    loading,
  } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider
      value={
        colorScheme === 'dark'
          ? DarkTheme
          : DefaultTheme
      }
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {!token ? (
          <>
            <Stack.Screen
              name="login"
            />

            <Stack.Screen
              name="register"
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="(tabs)"
            />

            <Stack.Screen
              name="modal"
              options={{
                presentation:
                  'modal',
              }}
            />
          </>
        )}
      </Stack>

      <StatusBar
        style="auto"
      />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
