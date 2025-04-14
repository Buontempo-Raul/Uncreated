// src/components/common/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../../../hooks/useAuth';

import logo from '../../../assets/images/uncreated.logotransparent.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Uncreated" />
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/explore" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Explore</Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={`/profile/${user.name.replace(/\s+/g, '-').toLowerCase()}`} 
                className="navbar-item"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="navbar-item admin-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="navbar-button" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
        
        <div className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;