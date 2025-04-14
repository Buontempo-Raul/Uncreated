// src/pages/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Profile.css';
// Uncomment when ready to use API
// import { userAPI } from '../../services/api';
// import useAuth from '../../hooks/useAuth';

// Temporary user data - Replace with API calls when ready
const tempUser = {
  _id: '1',
  username: 'artistic_soul',
  profileImage: 'https://via.placeholder.com/150x150',
  bio: 'Contemporary artist specializing in abstract expressionism. Exploring the boundaries between form and emotion through vibrant colors and dynamic compositions.',
  website: 'https://example.com',
  isArtist: true,
  createdAt: '2023-01-15T00:00:00.000Z'
};

// Temporary artwork data - Replace with API calls when ready
const tempArtworks = [
  {
    _id: '1',
    title: 'Abstract Harmony',
    description: 'A vibrant exploration of color and form.',
    images: ['https://via.placeholder.com/400x300?text=Abstract+Harmony'],
    price: 299.99,
    category: 'painting',
    forSale: true,
    createdAt: '2023-05-10T00:00:00.000Z'
  },
  {
    _id: '5',
    title: 'Emotional Expressions',
    description: 'A portrait series capturing human emotions.',
    images: ['https://via.placeholder.com/400x300?text=Emotional+Expressions'],
    price: 399.99,
    category: 'painting',
    forSale: true,
    createdAt: '2023-07-22T00:00:00.000Z'
  },
  {
    _id: '7',
    title: 'Cosmic Journey',
    description: 'Abstract representation of space and cosmos.',
    images: ['https://via.placeholder.com/400x300?text=Cosmic+Journey'],
    price: 449.99,
    category: 'painting',
    forSale: true,
    createdAt: '2023-09-05T00:00:00.000Z'
  },
  {
    _id: '9',
    title: 'Urban Symphony',
    description: 'A colorful interpretation of city life and movement.',
    images: ['https://via.placeholder.com/400x300?text=Urban+Symphony'],
    price: 329.99,
    category: 'painting',
    forSale: false,
    createdAt: '2023-11-18T00:00:00.000Z'
  }
];

const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('artworks');
  
  // Uncomment when ready to use authentication
  // const { user: currentUser } = useAuth();
  // const isOwnProfile = currentUser && currentUser.username === username;

  // Temporary - for development
  const isOwnProfile = username === 'artistic_soul';

  useEffect(() => {
    // Function to fetch user profile
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Uncomment when ready to use API
        // const userResponse = await userAPI.getUserByUsername(username);
        // const artworksResponse = await userAPI.getUserArtworks(username);
        
        // if (userResponse.data.success && artworksResponse.data.success) {
        //   setUser(userResponse.data.user);
        //   setArtworks(artworksResponse.data.artworks);
        // } else {
        //   setError('Failed to load profile');
        // }

        // Temporary - using mock data
        // Simulate API delay
        setTimeout(() => {
          setUser(tempUser);
          setArtworks(tempArtworks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('User not found');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!user) {
    return <div className="error-container">User not found</div>;
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={user.profileImage} alt={user.username} />
        </div>
        <div className="profile-info">
          <h1 className="username">{user.username}</h1>
          {user.isArtist && <span className="artist-badge">Artist</span>}
          <p className="bio">{user.bio}</p>
          {user.website && (
            <p className="website">
              <a href={user.website} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </p>
          )}
          <p className="joined-date">Joined {formatDate(user.createdAt)}</p>
          
          {isOwnProfile && (
            <Link to="/profile/edit" className="edit-profile-btn">
              Edit Profile
            </Link>
          )}
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('artworks')}
        >
          Artworks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        {isOwnProfile && (
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        )}
      </div>
      
      <div className="profile-content">
        {activeTab === 'artworks' && (
          <div className="artworks-tab">
            {artworks.length > 0 ? (
              <div className="artworks-grid">
                {artworks.map((artwork) => (
                  <div key={artwork._id} className="artwork-card">
                    <Link to={`/artwork/${artwork._id}`} className="artwork-image">
                      <img src={artwork.images[0]} alt={artwork.title} />
                    </Link>
                    <div className="artwork-details">
                      <h3 className="artwork-title">
                        <Link to={`/artwork/${artwork._id}`}>{artwork.title}</Link>
                      </h3>
                      <p className="artwork-category">{artwork.category}</p>
                      <div className="artwork-footer">
                        <span className="artwork-price">${artwork.price.toFixed(2)}</span>
                        <span className={`artwork-status ${artwork.forSale ? 'for-sale' : 'sold'}`}>
                          {artwork.forSale ? 'For Sale' : 'Not For Sale'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-content">
                <p>No artworks found</p>
                {isOwnProfile && (
                  <Link to="/artwork/create" className="create-btn">
                    Create Artwork
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="favorites-tab">
            <div className="no-content">
              <p>No favorites yet</p>
              <Link to="/shop" className="browse-btn">
                Browse Shop
              </Link>
            </div>
          </div>
        )}
        
        {isOwnProfile && activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="no-content">
              <p>No orders yet</p>
              <Link to="/shop" className="browse-btn">
                Browse Shop
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;