// src/pages/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import { useAuth } from '../../hooks/useAuth';
import userAPI from '../../services/userAPI';

// Social media icons - replace with actual icons in a real app
const SocialIcon = ({ platform, username }) => {
  if (!username) return null;
  
  let url = '';
  switch (platform) {
    case 'instagram':
      url = `https://instagram.com/${username}`;
      break;
    case 'twitter':
      url = `https://twitter.com/${username}`;
      break;
    case 'facebook':
      url = `https://facebook.com/${username}`;
      break;
    case 'pinterest':
      url = `https://pinterest.com/${username}`;
      break;
    default:
      return null;
  }
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`social-link ${platform}`}
      title={`${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${username}`}
    >
      <i className={`social-icon ${platform}`}></i>
    </a>
  );
};

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('artworks');
  const [pagination, setPagination] = useState({
    artworks: { page: 1, totalPages: 1 },
    favorites: { page: 1, totalPages: 1 }
  });
  
  // Use the auth context
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Determine if this is the current user's own profile
  const isOwnProfile = isAuthenticated && user && (user.username === username);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await userAPI.getUserByUsername(username);
      
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('User not found');
    }
  };
  
  // Fetch user artworks
  const fetchUserArtworks = async (page = 1) => {
    try {
      const response = await userAPI.getUserArtworks(username, page);
      
      if (response.data.success) {
        setArtworks(response.data.artworks);
        setPagination(prev => ({
          ...prev,
          artworks: {
            page: response.data.currentPage,
            totalPages: response.data.totalPages
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching user artworks:', error);
    }
  };
  
const handleRemoveFromFavorites = async (artworkId) => {
  try {
    await userAPI.removeFromFavorites(artworkId);
    
    // Update the favorites list by filtering out the removed artwork
    setFavorites(favorites.filter(item => item._id !== artworkId));
    
    // Show success message or notification (optional)
    // You can add a toast notification here if you have a notification system
  } catch (error) {
    console.error('Error removing from favorites:', error);
    // Show error message (optional)
  }
};

  // Fetch user favorites (only for own profile)
  const fetchUserFavorites = async (page = 1) => {
    if (!isOwnProfile) return;
    
    try {
      const response = await userAPI.getUserFavorites(page);
      
      if (response.data.success) {
        setFavorites(response.data.favorites);
        setPagination(prev => ({
          ...prev,
          favorites: {
            page: response.data.currentPage,
            totalPages: response.data.totalPages
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };
  
  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError('');
      
      try {
        await fetchUserData();
        await fetchUserArtworks();
        
        if (isOwnProfile) {
          await fetchUserFavorites();
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Reset active tab when username changes
    setActiveTab('artworks');
    
    loadUserData();
  }, [username, isOwnProfile]);
  
  // Load appropriate data when tab changes
  useEffect(() => {
    if (activeTab === 'favorites' && isOwnProfile) {
      fetchUserFavorites();
    }
  }, [activeTab]);
  
  // Handle page changes for artworks and favorites
  const handlePageChange = (type, page) => {
    setPagination(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        page
      }
    }));
    
    if (type === 'artworks') {
      fetchUserArtworks(page);
    } else if (type === 'favorites') {
      fetchUserFavorites(page);
    }
    
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };
  
  const handleFollowUser = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await userAPI.followUser(userData._id);
      // Refresh user data to update followers count
      fetchUserData();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };
  
  const handleUnfollowUser = async () => {
    try {
      await userAPI.unfollowUser(userData._id);
      // Refresh user data to update followers count
      fetchUserData();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };
  
  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!userData) {
    return <div className="error-container">User not found</div>;
  }
  
  // Check if current user is following this profile
  const isFollowing = user && userData.followers && 
    userData.followers.some(follower => follower._id === user._id);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get image URL (handle both relative and absolute URLs)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/default-profile.jpg';
    
    return imagePath.startsWith('http') 
      ? imagePath 
      : `${process.env.REACT_APP_API_URL}/${imagePath}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={getImageUrl(userData.profileImage)} alt={userData.username} />
        </div>
        <div className="profile-info">
          <div className="profile-title-section">
            <h1 className="username">{userData.username}</h1>
            {userData.isArtist && <span className="artist-badge">Artist</span>}
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userData.artworksCount || 0}</span>
              <span className="stat-label">Artworks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userData.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          
          <p className="bio">{userData.bio}</p>
          
          {userData.website && (
            <p className="website">
              <a href={userData.website} target="_blank" rel="noopener noreferrer">
                {userData.website}
              </a>
            </p>
          )}
          
          {userData.socialLinks && (
            <div className="social-links">
              {Object.entries(userData.socialLinks).map(([platform, username]) => (
                username && <SocialIcon key={platform} platform={platform} username={username} />
              ))}
            </div>
          )}
          
          <p className="joined-date">Joined {formatDate(userData.createdAt)}</p>
          
          <div className="profile-actions">
            {isOwnProfile ? (
              <button onClick={handleEditProfile} className="edit-profile-btn">
                Edit Profile
              </button>
            ) : (
              isAuthenticated && (
                isFollowing ? (
                  <button onClick={handleUnfollowUser} className="unfollow-btn">
                    Unfollow
                  </button>
                ) : (
                  <button onClick={handleFollowUser} className="follow-btn">
                    Follow
                  </button>
                )
              )
            )}
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'artworks' ? 'active' : ''}`}
          onClick={() => setActiveTab('artworks')}
        >
          Artworks
        </button>
        
        {isOwnProfile && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </>
        )}
      </div>
      
      <div className="profile-content">
        {activeTab === 'artworks' && (
          <div className="artworks-tab">
            {artworks.length > 0 ? (
              <>
                <div className="artworks-grid">
                  {artworks.map((artwork) => (
                    <div key={artwork._id} className="artwork-card">
                      <Link to={`/artwork/${artwork._id}`} className="artwork-image">
                        <img src={getImageUrl(artwork.images[0])} alt={artwork.title} />
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
                
                {/* Pagination controls for artworks */}
                {pagination.artworks.totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn"
                      disabled={pagination.artworks.page === 1}
                      onClick={() => handlePageChange('artworks', pagination.artworks.page - 1)}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.artworks.totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${pagination.artworks.page === i + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange('artworks', i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      className="pagination-btn"
                      disabled={pagination.artworks.page === pagination.artworks.totalPages}
                      onClick={() => handlePageChange('artworks', pagination.artworks.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-content">
                <p>No artworks found</p>
                {isOwnProfile && userData.isArtist && (
                  <Link to="/artwork/create" className="create-btn">
                    Create Artwork
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && isOwnProfile && (
          <div className="favorites-tab">
            {favorites.length > 0 ? (
              <>
                <div className="artworks-grid">
                  {favorites.map((artwork) => (
                    <div key={artwork._id} className="artwork-card">
                      <Link to={`/artwork/${artwork._id}`} className="artwork-image">
                        <img src={getImageUrl(artwork.images[0])} alt={artwork.title} />
                      </Link>
                      <div className="artwork-details">
                        <h3 className="artwork-title">
                          <Link to={`/artwork/${artwork._id}`}>{artwork.title}</Link>
                        </h3>
                        <p className="artwork-creator">
                          by <Link to={`/profile/${artwork.creator.username}`}>{artwork.creator.username}</Link>
                        </p>
                        <p className="artwork-category">{artwork.category}</p>
                        <div className="artwork-footer">
                          <span className="artwork-price">${artwork.price.toFixed(2)}</span>
                          <button 
                            className="remove-favorite-btn"
                            onClick={() => handleRemoveFromFavorites(artwork._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination controls for favorites */}
                {pagination.favorites.totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn"
                      disabled={pagination.favorites.page === 1}
                      onClick={() => handlePageChange('favorites', pagination.favorites.page - 1)}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.favorites.totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${pagination.favorites.page === i + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange('favorites', i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      className="pagination-btn"
                      disabled={pagination.favorites.page === pagination.favorites.totalPages}
                      onClick={() => handlePageChange('favorites', pagination.favorites.page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-content">
                <p>No favorites yet</p>
                <Link to="/shop" className="browse-btn">
                  Browse Shop
                </Link>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && isOwnProfile && (
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