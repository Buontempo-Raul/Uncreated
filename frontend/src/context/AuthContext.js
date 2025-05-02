// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import userAPI from '../services/userAPI';

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
            const response = await api.get('/api/auth/profile');
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
      
      // Make API call to login
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const userData = response.data.user;
        
        // Store token in localStorage
        localStorage.setItem('token', userData.token);
        delete userData.token; // Don't include token in user object
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set auth header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        // Update state
        setUser(userData);
        
        return userData;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred during login';
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
      
      // Make API call to register
      const response = await api.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const userData = response.data.user;
        
        // Store token in localStorage
        localStorage.setItem('token', userData.token);
        delete userData.token; // Don't include token in user object
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Set auth header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        
        // Update state
        setUser(userData);
        
        return userData;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred during registration';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the userAPI service for profile updates
      const response = await userAPI.updateUserProfile(userData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        
        return updatedUser;
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred while updating profile';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth header
    api.defaults.headers.common['Authorization'] = '';
    
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
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;