// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

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
          
          // Get user data
          // In a real app, you'd verify the token with your backend
          // For demo purposes, we'll simulate this
          
          // Simulated user data - in a real app, this would come from the API
          const userData = JSON.parse(localStorage.getItem('user'));
          
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            api.defaults.headers.common['Authorization'] = '';
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
      
      // In a real app, you'd make an API call here to authenticate
      // For demo, we'll simulate a successful login with an admin user
      
      // Simulated API response
      const response = {
        token: 'dummy-token-12345',
        user: {
          id: '1',
          name: 'Admin User',
          email: email,
          role: email.includes('admin') ? 'admin' : 'user' // Simple check for demo
        }
      };
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Set auth header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      // Update state
      setUser(response.user);
      
      return response.user;
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd make an API call to register the user
      // For demo, we'll simulate a successful registration
      
      // Simulated API response
      const response = {
        token: 'dummy-token-register-12345',
        user: {
          id: Date.now().toString(),
          name,
          email,
          role: 'user' // New users are always regular users
        }
      };
      
      // Store token in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Set auth header for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      // Update state
      setUser(response.user);
      
      return response.user;
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      throw err;
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

  const isAuthenticated = !!user;
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;