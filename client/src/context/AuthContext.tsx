import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '../data/users';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: UserData) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.auth.getProfile();
          if (profile && !profile.error) {
            setUser(profile);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.auth.login({ email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const response = await api.auth.register(userData);
      if (response && !response.error) {
        // Many backends don't return a token on register, so we might need to login after
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUser, 
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
