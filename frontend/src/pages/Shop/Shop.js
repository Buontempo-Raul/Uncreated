// frontend/src/pages/Shop/Shop.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
import api from '../../services/api';

const Shop = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    priceRange: '',
    sortBy: 'latest'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    // Function to fetch artworks
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (filter.category) params.append('category', filter.category);
        if (filter.priceRange) params.append('priceRange', filter.priceRange);
        if (filter.sortBy) params.append('sortBy', filter.sortBy);
        params.append('page', pagination.currentPage);
        params.append('limit', 12); // Items per page

        const response = await api.get(`/artworks?${params.toString()}`);
        
        if (response.data.success) {
          setArtworks(response.data.artworks);
          setPagination({
            currentPage: response.data.currentPage,
            totalPages: response.data.pages,
            totalItems: response.data.count
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [filter, pagination.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
    // Reset to page 1 when filter changes
    setPagination({
      ...pagination,
      currentPage: 1
    });
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
    // Scroll to top when changing page
    window.scrollTo(0, 0);
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
        <>
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
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>
              {[...Array(pagination.totalPages).keys()].map(x => (
                <button
                  key={x + 1}
                  className={`pagination-btn ${pagination.currentPage === x + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(x + 1)}
                >
                  {x + 1}
                </button>
              ))}
              <button 
                className="pagination-btn"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;