import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { AuthState } from '../types';

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkTokenExpiry = useCallback(() => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      setIsAdmin(false);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token || checkTokenExpiry()) {
          setLoading(false);
          return;
        }

        const { valid, isAdmin: adminStatus } = await authAPI.validateToken();
        setIsAdmin(valid && adminStatus);
      } catch (error) {
        console.error('Token validation failed:', error);
        setIsAdmin(false);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [checkTokenExpiry]);

  const login = async (password: string, isInitialSetup = false): Promise<void> => {
    const { token, isAdmin: adminStatus, expiresIn } = await authAPI.login(password, isInitialSetup);
    
    // Calculate token expiry time
    const expiryTime = Date.now() + (parseInt(expiresIn) * 1000);
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    setIsAdmin(adminStatus);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setIsAdmin(false);
  };

  const checkInitialSetup = async () => {
    try {
      const { needsSetup } = await authAPI.checkSetup();
      return needsSetup;
    } catch (error) {
      console.error('Failed to check initial setup:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading, checkInitialSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}