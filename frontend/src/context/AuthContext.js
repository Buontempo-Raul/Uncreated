// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = getCurrentUser();
    
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    
    setLoading(false);
  }, []);
  
  const login = (userData) => {
    setUser(userData);
  };
  
  const signOut = () => {
    logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated: !!user, 
        login, 
        logout: signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};