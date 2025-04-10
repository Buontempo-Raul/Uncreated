// src/components/common/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import './Navbar.css';

import logo from '../../../assets/images/uncreated.logotransparent.png'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Uncreated" />
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={closeMenu}>Home</Link>
          <Link to="/shop" className="navbar-item" onClick={closeMenu}>Shop</Link>
          <Link to="/explore" className="navbar-item" onClick={closeMenu}>Explore</Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={`/profile/${user.username}`} 
                className="navbar-item" 
                onClick={closeMenu}
              >
                Profile
              </Link>
              <button onClick={handleLogout} className="navbar-item logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="navbar-item register-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;