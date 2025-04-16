// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth';

// Create the Auth Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is logged in when the app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = authService.getUserFromStorage();
        
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          // Set admin status if you have role field
          setIsAdmin(user.role === 'admin'); 
        }
      } catch (error) {
        console.error('Authentication error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register function
  const register = async (username, email, password) => {
    try {
      const result = await authService.register({
        username,
        email,
        password
      });
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setIsAdmin(result.user.role === 'admin');
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const result = await authService.login({
        email, 
        password
      });
      
      if (result.success) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        setIsAdmin(result.user.role === 'admin');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
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