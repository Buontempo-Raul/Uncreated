// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the Auth Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check localStorage for auth token
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // In a real app, you would validate this token with your backend
          // For now, we'll just simulate a logged-in user
          const user = { 
            id: '1', 
            username: 'user', 
            email: 'user@example.com' 
          };
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // In a real app, you would make an API call to your auth endpoint
      // For demo purposes, we'll simulate a successful login
      if (email && password) {
        // Simulate API response
        const user = { 
          id: '1', 
          username: 'user', 
          email 
        };
        
        // Store token in localStorage
        localStorage.setItem('authToken', 'demo-token-12345');
        
        setCurrentUser(user);
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      // In a real app, you would make an API call to your register endpoint
      // For demo purposes, we'll simulate a successful registration
      if (username && email && password) {
        // Simulate API response
        const user = { 
          id: '1', 
          username, 
          email 
        };
        
        // Store token in localStorage
        localStorage.setItem('authToken', 'demo-token-12345');
        
        setCurrentUser(user);
        return { success: true };
      }
      return { success: false, message: 'Invalid registration data' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;