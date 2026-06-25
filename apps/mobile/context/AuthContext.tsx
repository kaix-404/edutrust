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
  login: (token: string, user: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const [token,   setToken]   = useState<string | null>(null);
  const [user,    setUser]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser  = await AsyncStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.log('Failed to load stored auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, user: any) => {
    // Update state first so the UI responds immediately
    setToken(token);
    setUser(user);
    // Persist in the background — non-blocking
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.log('Failed to persist login:', err);
    }
  };

  const logout = () => {
    // Null state SYNCHRONOUSLY first — the root layout re-renders instantly
    // and swaps (tabs) → login. This is the fix: the working reference project
    // does exactly this. Awaiting AsyncStorage before nulling state means the
    // root navigator never sees the token change if AsyncStorage is slow.
    setToken(null);
    setUser(null);
    // Fire-and-forget storage clear — doesn't need to block navigation
    AsyncStorage.clear().catch(err => console.log('AsyncStorage clear failed:', err));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);