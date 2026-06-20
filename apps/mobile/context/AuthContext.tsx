import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type AuthContextType = {
  token: string | null;
  user: any;
  login: (
    token: string,
    user: any
  ) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: any) => {
  const [token, setToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth =
    async () => {
      const storedToken =
        await AsyncStorage.getItem(
          'token'
        );

      const storedUser =
        await AsyncStorage.getItem(
          'user'
        );

      if (
        storedToken &&
        storedUser
      ) {
        setToken(
          storedToken
        );

        setUser(
          JSON.parse(
            storedUser
          )
        );
      }

      setLoading(false);
    };

  const login =
    async (
      token: string,
      user: any
    ) => {
      await AsyncStorage.setItem(
        'token',
        token
      );

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(
          user
        )
      );

      setToken(token);
      setUser(user);
    };

  const logout =
    async () => {
      await AsyncStorage.removeItem(
        'token'
      );

      await AsyncStorage.removeItem(
        'user'
      );

      setToken(null);
      setUser(null);
    };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () =>
    useContext(
      AuthContext
    );