// src/pages/Auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
// Uncomment the following when ready to use authentication
// import useAuth from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Uncomment when ready to use authentication
  // const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Temporary login simulation - Replace with actual authentication when ready
    try {
      // Uncomment when ready to use authentication
      // const response = await login(formData);
      
      // if (response.success) {
      //   navigate('/');
      // } else {
      //   setError(response.message || 'Login failed');
      // }

      // Temporary simulation - remove this when implementing actual auth
      console.log('Login attempted with:', formData);
      setTimeout(() => {
        setLoading(false);
        // Simulate successful login
        navigate('/');
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Log In</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="auth-link">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;