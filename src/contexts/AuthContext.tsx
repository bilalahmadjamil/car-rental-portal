'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../utils/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  customerTier: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing auth data on mount
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedUser && accessToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token is still valid by fetching profile
          const response = await apiClient.get('/auth/profile');

          if (!response.success) {
            // Token is invalid, try to refresh
            const refreshed = await refreshToken();
            if (!refreshed) {
              logout();
            }
          }
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    // Keep user on current page - no automatic navigation
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) return false;

      const response = await apiClient.post('/auth/refresh');

      if (!response.success) return false;

      localStorage.setItem('accessToken', (response.data as any).accessToken);
      setUser((response.data as any).user);
      localStorage.setItem('user', JSON.stringify((response.data as any).user));
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
