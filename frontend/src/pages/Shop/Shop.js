// src/pages/Shop/Shop.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
// Uncomment when ready to use API
// import { artworkAPI } from '../../services/api';

// Temporary artwork data - Replace with API calls when ready
const tempArtworks = [
  {
    _id: '1',
    title: 'Abstract Harmony',
    description: 'A vibrant exploration of color and form.',
    images: ['https://via.placeholder.com/400x300?text=Abstract+Harmony'],
    price: 299.99,
    category: 'painting',
    creator: {
      username: 'artistic_soul',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  },
  {
    _id: '2',
    title: 'Urban Landscape',
    description: 'Cityscape captured through a unique perspective.',
    images: ['https://via.placeholder.com/400x300?text=Urban+Landscape'],
    price: 349.99,
    category: 'photography',
    creator: {
      username: 'city_explorer',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  },
  {
    _id: '3',
    title: 'Serenity',
    description: 'A peaceful nature-inspired sculpture.',
    images: ['https://via.placeholder.com/400x300?text=Serenity'],
    price: 499.99,
    category: 'sculpture',
    creator: {
      username: 'nature_artist',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  },
  {
    _id: '4',
    title: 'Digital Dreams',
    description: 'A futuristic digital artwork exploring imagination.',
    images: ['https://via.placeholder.com/400x300?text=Digital+Dreams'],
    price: 199.99,
    category: 'digital',
    creator: {
      username: 'future_creative',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  },
  {
    _id: '5',
    title: 'Emotional Expressions',
    description: 'A portrait series capturing human emotions.',
    images: ['https://via.placeholder.com/400x300?text=Emotional+Expressions'],
    price: 399.99,
    category: 'painting',
    creator: {
      username: 'emotion_artist',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  },
  {
    _id: '6',
    title: 'Textured Patterns',
    description: 'Mixed media artwork with unique textures and patterns.',
    images: ['https://via.placeholder.com/400x300?text=Textured+Patterns'],
    price: 279.99,
    category: 'mixed media',
    creator: {
      username: 'texture_master',
      profileImage: 'https://via.placeholder.com/50x50'
    }
  }
];

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    priceRange: '',
    sortBy: 'latest'
  });

  useEffect(() => {
    // Function to fetch artworks
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        // Uncomment when ready to use API
        // const response = await artworkAPI.getArtworks(filter);
        // if (response.data.success) {
        //   setArtworks(response.data.artworks);
        // }

        // Temporary - using mock data
        // Simulate API delay
        setTimeout(() => {
          setArtworks(tempArtworks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  return (
    <div className="shop-container">
      <h1 className="shop-title">Explore Artworks</h1>
      
      <div className="shop-filters">
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="painting">Painting</option>
            <option value="sculpture">Sculpture</option>
            <option value="photography">Photography</option>
            <option value="digital">Digital Art</option>
            <option value="mixed media">Mixed Media</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="priceRange">Price Range</label>
          <select
            id="priceRange"
            name="priceRange"
            value={filter.priceRange}
            onChange={handleFilterChange}
          >
            <option value="">All Prices</option>
            <option value="0-100">Under $100</option>
            <option value="100-300">$100 - $300</option>
            <option value="300-500">$300 - $500</option>
            <option value="500-1000">$500 - $1000</option>
            <option value="1000-">Over $1000</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filter.sortBy}
            onChange={handleFilterChange}
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading artworks...</div>
      ) : (
        <div className="artworks-grid">
          {artworks.length > 0 ? (
            artworks.map((artwork) => (
              <div key={artwork._id} className="artwork-card">
                <div className="artwork-image">
                  <img src={artwork.images[0]} alt={artwork.title} />
                </div>
                <div className="artwork-details">
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-creator">
                    by <Link to={`/profile/${artwork.creator.username}`}>{artwork.creator.username}</Link>
                  </p>
                  <p className="artwork-category">{artwork.category}</p>
                  <p className="artwork-price">${artwork.price.toFixed(2)}</p>
                  <Link to={`/artwork/${artwork._id}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No artworks found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;