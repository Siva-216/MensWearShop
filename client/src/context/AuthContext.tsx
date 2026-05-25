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
  refreshOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helpers to map backend objects to frontend interfaces
  const mapOrderFromBackend = (o: any) => {
    if (!o) return null;
    return {
      id: o.orderId || o.id,
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
      total: o.totalAmount || o.subTotal || 0,
      status: (o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()) : 'Pending') as any,
      items: Array.isArray(o.items) ? o.items.map((item: any) => ({
        id: item.id || item.productId,
        name: item.name || 'Product',
        price: item.price || 0,
        quantity: item.quantity || 1,
        image: item.image || '',
        size: item.size,
        color: item.color,
        sku: item.sku
      })) : (typeof o.items === 'number' ? o.items : 0),
      address: o.shippingAddress,
      paymentMethod: o.paymentMethod,
      trackingStep: o.trackingStep,
      statusHistory: Array.isArray(o.statusHistory) ? o.statusHistory.map((h: any) => ({
        status: h.status,
        date: h.date ? new Date(h.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
      })) : []
    };
  };

  const mapUserFromBackend = (backendUser: any, backendOrders: any[] = []): UserData | null => {
    if (!backendUser) return null;
    
    // Use provided orders or fallback to backendUser.orders if exists
    const ordersToMap = (backendOrders && backendOrders.length > 0) 
      ? backendOrders 
      : (backendUser.orders || []);

    return {
      id: backendUser.id,
      fullName: backendUser.name || backendUser.fullName || '',
      email: backendUser.email || '',
      phone: backendUser.mobile || backendUser.phone || '',
      memberSince: backendUser.createdAt ? new Date(backendUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026',
      role: (backendUser.role || 'user').toLowerCase() as any,
      orders: ordersToMap.map(mapOrderFromBackend).filter(Boolean),
      addresses: (backendUser.addresses || []).map((addr: any) => ({
        id: addr.id || addr._id || `addr-${Math.random().toString(36).substr(2, 9)}`,
        name: addr.name || '',
        addressLines: Array.isArray(addr.addressLines) ? addr.addressLines : [],
        city: addr.city || '',
        state: addr.state || '',
        zip: addr.zip || addr.zipCode || '',
        country: addr.country || 'India',
        phone: addr.phone || '',
        altPhone: addr.altPhone || '',
        label: addr.label || 'Address',
        isDefault: !!addr.isDefault
      })),
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
            // Fetch orders for this user
            let orders: any[] = [];
            try {
              orders = await api.orders.getByUser(profile.id);
              if (!Array.isArray(orders)) orders = [];
            } catch (err) {
              console.error("Failed to fetch orders during init:", err);
            }

            const mappedUser = mapUserFromBackend(profile, orders);
            setUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(profile));
          } else {
            // Even if profile fetch fails, try to fetch orders for the cached user
            let orders: any[] = [];
            try {
              orders = await api.orders.getByUser(userData.id);
              if (!Array.isArray(orders)) orders = [];
            } catch (err) {
              console.error("Failed to fetch orders for cached user:", err);
            }
            setUser(mapUserFromBackend(userData, orders));
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
        // Fetch orders immediately after login
        let orders: any[] = [];
        try {
          orders = await api.orders.getByUser(response.id);
          if (!Array.isArray(orders)) orders = [];
        } catch (err) {
          console.error("Failed to fetch orders during login:", err);
        }

        localStorage.setItem('user', JSON.stringify(response));
        setUser(mapUserFromBackend(response, orders));
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
        localStorage.setItem('user', JSON.stringify(response));
        setUser(mapUserFromBackend(response, []));
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
        // Fetch orders to ensure they are preserved in the state
        let orders: any[] = [];
        try {
          orders = await api.orders.getByUser(response.id);
          if (!Array.isArray(orders)) orders = [];
        } catch (err) {
          console.error("Failed to fetch orders during update:", err);
        }

        const mappedUser = mapUserFromBackend(response, orders);
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

  const refreshOrders = React.useCallback(async () => {
    if (!user) return;
    try {
      const orders = await api.orders.getByUser(user.id);
      if (Array.isArray(orders)) {
        setUser(prev => prev ? { 
          ...prev, 
          orders: orders.map(mapOrderFromBackend).filter(Boolean) as any 
        } : null);
      }
    } catch (err) {
      console.error("Failed to refresh orders:", err);
    }
  }, [user?.id]);

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
      loading,
      refreshOrders
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
