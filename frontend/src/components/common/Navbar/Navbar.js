// src/components/common/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import logo from '../../../assets/images/uncreated.logotransparent.png'

// Uncomment when ready to use authentication
// import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Uncomment when ready to use authentication
  // const { user } = useAuth();
  
  // Temporary - use this until authentication is implemented
  const isAuthenticated = false;
  const user = null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Uncreated" />
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item">Home</Link>
          <Link to="/shop" className="navbar-item">Shop</Link>
          <Link to="/explore" className="navbar-item">Explore</Link>
          
          {isAuthenticated ? (
            <>
              <Link to={`/profile/${user.username}`} className="navbar-item">My Profile</Link>
              <button className="navbar-item logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-item">Login</Link>
              <Link to="/register" className="navbar-item">Register</Link>
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