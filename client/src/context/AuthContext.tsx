import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'ngo' | 'user' | null;
  userData: any;
  login: (email: string, password: string, role: 'ngo' | 'user') => Promise<void>;
  register: (userData: any, role: 'ngo' | 'user') => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'ngo' | 'user' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setIsAuthenticated(true);
          setUserRole(response.data.role);
          setUserData(response.data.user);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserRole(null);
          setUserData(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, role: 'ngo' | 'user') => {
    try {
      setLoading(true);
      const endpoint = role === 'ngo' ? '/auth/ngo/login' : '/auth/user/login';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserData(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any, role: 'ngo' | 'user') => {
    try {
      setLoading(true);
      const endpoint = role === 'ngo' ? '/auth/ngo/register' : '/auth/user/register';
      const response = await axios.post(`${API_URL}${endpoint}`, userData);
      
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setUserRole(role);
      setUserData(response.data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
  };
  
  const updateProfile = async (data: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = userRole === 'ngo' ? '/ngo/profile' : '/user/profile';
      const response = await axios.put(`${API_URL}${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData(response.data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    userRole,
    userData,
    login,
    register,
    logout,
    updateProfile,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};