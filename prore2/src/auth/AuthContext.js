// auth/AuthContext.js - Version simulation simple
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('freshfold_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Connexion email/password
  const login = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email === 'test@freshfold.com' && password === '123456') {
        const userData = {
          id: '1',
          name: 'Test User',
          email: 'test@freshfold.com',
          role: 'Admin',
          avatar: null,
          provider: 'email'
        };
        setUser(userData);
        localStorage.setItem('freshfold_user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const signup = async (email, password) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userData = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        role: 'User',
        avatar: null,
        provider: 'email'
      };
      
      setUser(userData);
      localStorage.setItem('freshfold_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulation Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 'google_' + Date.now(),
        name: 'Ahmed Benali',
        email: 'ahmed@gmail.com',
        avatar: 'https://ui-avatars.com/api/?background=6fbf4c&color=fff&name=A',
        provider: 'google',
        role: 'User'
      };
      
      setUser(userData);
      localStorage.setItem('freshfold_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simulation Facebook
  const loginWithFacebook = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 'fb_' + Date.now(),
        name: 'Fatima Zahra',
        email: 'fatima@facebook.com',
        avatar: 'https://ui-avatars.com/api/?background=1877F2&color=fff&name=F',
        provider: 'facebook',
        role: 'User'
      };
      
      setUser(userData);
      localStorage.setItem('freshfold_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      localStorage.removeItem('freshfold_user');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};