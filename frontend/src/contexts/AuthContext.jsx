import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idLaundry, setIdLaundry] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('userFreshFold');
    const token = localStorage.getItem('tokenFreshFold');
    
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    
    try {
      const res = await API.post('/login', credentials);
      if (res.data.success) {
        const { user: userData, access_token } = res.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.removeItem('laundry');
        localStorage.setItem('userFreshFold', JSON.stringify(userData));
        localStorage.setItem('tokenFreshFold', access_token);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (data) => {
    try {
      const res = await API.post('/register', data);
      if (res.data.success) {
        const { user: userData, access_token } = res.data;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.removeItem('laundry');
        localStorage.setItem('userFreshFold', JSON.stringify(userData));
        localStorage.setItem('tokenFreshFold', access_token);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (error) {
      if (error.response?.status === 422) {
        return { success: false, errors: error.response.data.errors };
      }
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const updateRole = async (role) => {
    try {
      const res = await API.put('/update-role', { role });
      if (res.data.success) {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem('userFreshFold', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Failed to update role' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update role';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await API.post('/logout');
    } catch {
      // ignore errors on logout
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userFreshFold');
    localStorage.removeItem('tokenFreshFold');
    localStorage.removeItem('laundry');
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateRole, idLaundry, setIdLaundry }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
