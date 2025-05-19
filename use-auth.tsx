import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: number;
  username: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginMutation: any;
  registerMutation: any;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Save user to state and localStorage
      setUser({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
      });
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
      }));
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { username: string; password: string; displayName: string }) => {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setUser({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
      });
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
      }));
      navigate('/');
    },
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Invalidate any user-related queries
    queryClient.invalidateQueries({ queryKey: ['user'] });
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginMutation,
        registerMutation,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};