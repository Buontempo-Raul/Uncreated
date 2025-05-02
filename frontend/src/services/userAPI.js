// frontend/src/services/userAPI.js
import api from './api';

// Get user by username
export const getUserByUsername = async (username) => {
  return await api.get(`/api/users/${username}`);
};

// Update user profile
export const updateUserProfile = async (userData) => {
  // If userData contains a File object for profileImage, use FormData
  if (userData.profileImage instanceof File) {
    const formData = new FormData();
    
    // Append all text fields
    Object.keys(userData).forEach(key => {
      if (key !== 'profileImage' && userData[key] !== undefined) {
        // Handle special case for socialLinks object
        if (key === 'socialLinks' && typeof userData[key] === 'object') {
          Object.keys(userData[key]).forEach(social => {
            formData.append(`socialLinks[${social}]`, userData[key][social]);
          });
        } else {
          formData.append(key, userData[key]);
        }
      }
    });
    
    // Append profile image file
    formData.append('profileImage', userData.profileImage);
    
    return await api.put('/api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  
  // If no File object, proceed with normal JSON request
  return await api.put('/api/users/profile', userData);
};

// Get user artworks with pagination
export const getUserArtworks = async (username, page = 1, limit = 12, sort = '-createdAt') => {
  return await api.get(`/api/users/${username}/artworks`, {
    params: { page, limit, sort }
  });
};

// Follow a user
export const followUser = async (userId) => {
  return await api.post(`/api/users/${userId}/follow`);
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  return await api.post(`/api/users/${userId}/unfollow`);
};

// Get current user's favorites
export const getUserFavorites = async (page = 1, limit = 12) => {
  return await api.get('/api/users/favorites', {
    params: { page, limit }
  });
};

// Add artwork to favorites
export const addToFavorites = async (artworkId) => {
  return await api.post(`/api/users/favorites/${artworkId}`);
};

// Remove artwork from favorites
export const removeFromFavorites = async (artworkId) => {
  return await api.delete(`/api/users/favorites/${artworkId}`);
};

export default {
  getUserByUsername,
  updateUserProfile,
  getUserArtworks,
  followUser,
  unfollowUser,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
};