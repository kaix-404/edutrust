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
    setToken(token);
    setUser(user);
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.log('Failed to persist login:', err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    AsyncStorage.clear().catch(err => console.log('AsyncStorage clear failed:', err));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);