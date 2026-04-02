import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, users } from '../data/users';

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<UserData>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: UserData) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>(users);
  const [loading, setLoading] = useState(true);

  // Initialize users and current user from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('local_users');
    let currentUsers = users;
    
    if (storedUsers) {
      currentUsers = JSON.parse(storedUsers);
      setAllUsers(currentUsers);
    }

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      const foundUser = currentUsers.find(u => u.id === storedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('userId', foundUser.id);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<UserData>): Promise<boolean> => {
    const newUser: UserData = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName || '',
      email: userData.email || '',
      password: userData.password || '',
      phone: userData.phone || '',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      orders: [],
      addresses: [],
      wishlistCount: 0,
      ...userData
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('local_users', JSON.stringify(updatedUsers));
    
    // Auto login
    setUser(newUser);
    localStorage.setItem('userId', newUser.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const updateUser = (updatedUser: UserData) => {
    const updatedAllUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setAllUsers(updatedAllUsers);
    localStorage.setItem('local_users', JSON.stringify(updatedAllUsers));
    setUser(updatedUser);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isAuthenticated: !!user }}>
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
