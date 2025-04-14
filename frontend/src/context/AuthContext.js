// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getUserFromStorage();
      
      if (storedUser) {
        try {
          // Verify token by getting current user profile
          const response = await authService.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            // If token is invalid, logout
            authService.logout();
          }
        } catch (error) {
          // If API call fails, logout
          authService.logout();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      if (response.success) {
        setUser(response.user);
      }
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        setUser(response.user);
      }
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setUser(null);
    return { success: true };
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(userData);
      if (response.success) {
        setUser(prevUser => ({
          ...prevUser,
          ...response.user
        }));
      }
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;