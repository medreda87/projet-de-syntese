import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idLaundry, setIdLaundry] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (userData ) => {

    const res = await axios.post("/api/auth/login" , userData);

    if(res.data.success){
         setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        return { success: true };
    }
    return { success: false, message: res.data.message || 'Login failed' };
    
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, idLaundry, setIdLaundry }}>
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
