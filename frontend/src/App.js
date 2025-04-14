// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';

// Pages
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import Explore from './pages/Explore/Explore';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound/NotFound';

// Components
import Navbar from './components/common/Navbar/Navbar';
import Footer from './components/common/Footer/Footer';

// Uncomment when ready to use authentication
// import AuthProvider from './context/AuthContext';

function App() {
  return (
    // Uncomment when ready to use authentication
    // <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    // </AuthProvider>
  );
}

export default App;