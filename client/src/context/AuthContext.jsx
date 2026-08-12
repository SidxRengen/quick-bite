import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const TOKEN_KEY = 'quickbite_token';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCheckingSession(false);
      return;
    }

    api.me()
      .then((response) => setUser(response.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setCheckingSession(false));
  }, []);

  const authenticate = useCallback(async (mode, credentials) => {
    const response = await api[mode](credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, checkingSession, authenticate, logout }),
    [user, checkingSession, authenticate, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export { TOKEN_KEY };
