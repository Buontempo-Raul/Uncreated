// frontend/src/services/artworkAPI.js
import api from './api';

// Get all artworks with filters
export const getArtworks = async (filters = {}, page = 1, limit = 12) => {
  const params = new URLSearchParams();
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  // Add pagination
  params.append('page', page);
  params.append('limit', limit);
  
  return await api.get(`/artworks?${params.toString()}`);
};

// Get artwork by ID
export const getArtworkById = async (id) => {
  return await api.get(`/artworks/${id}`);
};

// Get featured artworks
export const getFeaturedArtworks = async () => {
  return await api.get('/artworks/featured');
};

// Get artwork categories
export const getCategories = async () => {
  return await api.get('/artworks/categories');
};

// Like an artwork
export const likeArtwork = async (id) => {
  return await api.post(`/artworks/${id}/like`);
};

// Create new artwork
export const createArtwork = async (artworkData) => {
  return await api.post('/artworks', artworkData);
};

// Update artwork
export const updateArtwork = async (id, artworkData) => {
  return await api.put(`/artworks/${id}`, artworkData);
};

// Delete artwork
export const deleteArtwork = async (id) => {
  return await api.delete(`/artworks/${id}`);
};

export default {
  getArtworks,
  getArtworkById,
  getFeaturedArtworks,
  getCategories,
  likeArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork
};