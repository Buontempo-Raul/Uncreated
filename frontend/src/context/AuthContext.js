// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/auth'; // Import the auth service

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Set auth header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile from the server
          try {
            // In a real production app, verify token here with the backend
            const response = await api.get('/auth/profile');
            if (response.data.success) {
              setUser(response.data.user);
            } else {
              // If token is invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              api.defaults.headers.common['Authorization'] = '';
            }
          } catch (err) {
            // If API call fails, use localStorage as fallback
            console.error('Error fetching user profile:', err);
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
              setUser(userData);
            } else {
              localStorage.removeItem('token');
              api.defaults.headers.common['Authorization'] = '';
            }
          }
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the auth service for login
      const response = await authService.login({ email, password });
      
      if (response.success) {
        // Update state
        setUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const message = err.message || 'An error occurred during login';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the auth service for registration
      const response = await authService.register(userData);
      
      if (response.success) {
        // Update state
        setUser(response.user);
        return response.user;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const message = err.message || 'An error occurred during registration';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Use the auth service for logout
    authService.logout();
    // Clear user from state
    setUser(null);
  };

  const clearError = () => {
    setError(null);
  };

  const isAuthenticated = !!user;
  const isArtist = user && (user.isArtist || user.role === 'artist');
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isArtist,
        isAdmin,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;