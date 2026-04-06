import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData } from '../data/users';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: any) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to map backend user object to frontend UserData interface
  const mapUserFromBackend = (backendUser: any): UserData | null => {
    if (!backendUser) return null;
    return {
      id: backendUser.id,
      fullName: backendUser.name || backendUser.fullName || '',
      email: backendUser.email || '',
      phone: backendUser.mobile || backendUser.phone || '',
      memberSince: backendUser.createdAt ? new Date(backendUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026',
      role: (backendUser.role || 'user').toLowerCase() as any,
      orders: backendUser.orders || [],
      addresses: backendUser.addresses || [],
      wishlistCount: backendUser.wishlistCount || 0
    };
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const profile = await api.auth.getProfile(userData.id); 
          if (profile && !profile.error && profile.id) {
            const mappedUser = mapUserFromBackend(profile);
            setUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(profile));
          } else {
            setUser(mapUserFromBackend(userData));
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.auth.login({ email, password });
      if (response && response.id) {
        localStorage.setItem('user', JSON.stringify(response));
        setUser(mapUserFromBackend(response));
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
      if (response && !response.error && response.id) {
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
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = async (updatedData: any) => {
    try {
      // Map frontend-to-backend fields for the update request
      const backendData = {
        name: updatedData.fullName,
        mobile: updatedData.phone,
        email: updatedData.email,
        addresses: updatedData.addresses,
        role: updatedData.role ? updatedData.role.toUpperCase() : undefined
      };
      
      const response = await api.users.update(updatedData.id, backendData);
      if (response && response.id) {
        const mappedUser = mapUserFromBackend(response);
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(response));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!user) return false;
    try {
      const success = await api.users.delete(user.id);
      if (success) {
        logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete account:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      updateUser, 
      deleteAccount,
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
