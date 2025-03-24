// src/pages/Shop/Shop.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - this would come from your backend API in production
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          title: 'Abstract Painting',
          artist: 'Jane Doe',
          price: 299.99,
          image: 'https://via.placeholder.com/300x300?text=Abstract+Art',
          category: 'paintings'
        },
        {
          id: 2,
          title: 'Digital Landscape',
          artist: 'John Smith',
          price: 149.99,
          image: 'https://via.placeholder.com/300x300?text=Digital+Art',
          category: 'digital'
        },
        {
          id: 3,
          title: 'Handcrafted Necklace',
          artist: 'Maria Garcia',
          price: 89.99,
          image: 'https://via.placeholder.com/300x300?text=Jewelry',
          category: 'jewelry'
        },
        {
          id: 4,
          title: 'Ceramic Vase',
          artist: 'Alex Chen',
          price: 129.99,
          image: 'https://via.placeholder.com/300x300?text=Ceramics',
          category: 'sculptures'
        },
        {
          id: 5,
          title: 'Portrait Photography',
          artist: 'Sophia Williams',
          price: 199.99,
          image: 'https://via.placeholder.com/300x300?text=Photography',
          category: 'photos'
        },
        {
          id: 6,
          title: 'Wooden Sculpture',
          artist: 'Daniel Johnson',
          price: 349.99,
          image: 'https://via.placeholder.com/300x300?text=Sculpture',
          category: 'sculptures'
        },
        {
          id: 7,
          title: 'Acrylic Landscape',
          artist: 'Emily Brown',
          price: 279.99,
          image: 'https://via.placeholder.com/300x300?text=Landscape',
          category: 'paintings'
        },
        {
          id: 8,
          title: 'Digital Character Art',
          artist: 'Ryan Thomas',
          price: 159.99,
          image: 'https://via.placeholder.com/300x300?text=Character+Art',
          category: 'digital'
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search functionality
  const filteredProducts = products.filter(product => {
    // Apply category filter
    if (filter !== 'all' && product.category !== filter) {
      return false;
    }
    
    // Apply search filter
    return product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.artist.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Uncreated Shop
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover and purchase unique creations from talented artists
        </motion.p>
      </div>

      <div className="shop-controls">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search art or artists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'paintings' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('paintings')}
          >
            Paintings
          </button>
          <button 
            className={`filter-btn ${filter === 'digital' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('digital')}
          >
            Digital Art
          </button>
          <button 
            className={`filter-btn ${filter === 'sculptures' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('sculptures')}
          >
            Sculptures
          </button>
          <button 
            className={`filter-btn ${filter === 'jewelry' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('jewelry')}
          >
            Jewelry
          </button>
          <button 
            className={`filter-btn ${filter === 'photos' ? 'active' : ''}`} 
            onClick={() => handleFilterChange('photos')}
          >
            Photography
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading amazing art...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h2>No artworks found</h2>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <motion.div 
              className="products-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map(product => (
                <motion.div 
                  key={product.id} 
                  className="product-card"
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="artist">By {product.artist}</p>
                    <p className="price">${product.price.toFixed(2)}</p>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;