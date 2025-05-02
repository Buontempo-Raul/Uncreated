// src/pages/Profile/EditProfile.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    website: '',
    isArtist: false,
    socialLinks: {
      instagram: '',
      twitter: '',
      facebook: '',
      pinterest: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Populate form with user data when component mounts
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        isArtist: user.isArtist || false,
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          twitter: user.socialLinks?.twitter || '',
          facebook: user.socialLinks?.facebook || '',
          pinterest: user.socialLinks?.pinterest || ''
        }
      });
      
      // Set initial preview image
      if (user.profileImage) {
        // For API served images, construct the full URL
        const imageUrl = user.profileImage.startsWith('http') 
          ? user.profileImage 
          : `${process.env.REACT_APP_API_URL}/${user.profileImage}`;
          
        setPreviewImage(imageUrl);
      }
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social-')) {
      // Handle social media links
      const socialNetwork = name.replace('social-', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialNetwork]: value
        }
      });
    } else {
      // Handle regular form fields
      const fieldValue = type === 'checkbox' ? checked : value;
      
      setFormData({
        ...formData,
        [name]: fieldValue
      });
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }
    
    // Store file for upload
    setProfileImage(file);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageUploadClick = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };
  
  const handleRemoveImage = () => {
    setPreviewImage(null);
    setProfileImage(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Prepare data for submission
      const updatedUserData = { ...formData };
      
      // Add profile image if changed
      if (profileImage) {
        updatedUserData.profileImage = profileImage;
      }
      
      // Call update profile function
      const updatedUser = await updateProfile(updatedUserData);
      
      setSuccess('Profile updated successfully!');
      
      // After a short delay, redirect back to profile page
      setTimeout(() => {
        navigate(`/profile/${updatedUser.username}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">Edit Profile</h1>
      
      {error && <div className="edit-profile-error">{error}</div>}
      {success && <div className="edit-profile-success">{success}</div>}
      
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group profile-image-upload">
          <label>Profile Image</label>
          <div className="image-upload-container">
            <div 
              className={`image-preview-container ${!previewImage ? 'no-image' : ''}`}
              onClick={handleImageUploadClick}
            >
              {previewImage ? (
                <img src={previewImage} alt="Profile preview" className="profile-preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <i className="upload-icon">+</i>
                  <span>Upload Image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg, image/png, image/gif, image/webp"
              className="file-input"
            />
            <div className="image-upload-actions">
              <button 
                type="button" 
                className="upload-button"
                onClick={handleImageUploadClick}
              >
                {previewImage ? 'Change Image' : 'Upload Image'}
              </button>
              {previewImage && (
                <button 
                  type="button" 
                  className="remove-button"
                  onClick={handleRemoveImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <small>Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WEBP</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
          <small>Username must be at least 3 characters and can only contain letters, numbers, underscores and hyphens.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            rows="4"
            maxLength="500"
          ></textarea>
          <small>{formData.bio.length}/500 characters</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        <div className="social-links-section">
          <h3>Social Media Links</h3>
          
          <div className="form-group">
            <label htmlFor="social-instagram">
              <i className="social-icon instagram"></i> Instagram
            </label>
            <input
              type="text"
              id="social-instagram"
              name="social-instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              placeholder="Instagram username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="social-twitter">
              <i className="social-icon twitter"></i> Twitter
            </label>
            <input
              type="text"
              id="social-twitter"
              name="social-twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              placeholder="Twitter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="social-facebook">
              <i className="social-icon facebook"></i> Facebook
            </label>
            <input
              type="text"
              id="social-facebook"
              name="social-facebook"
              value={formData.socialLinks.facebook}
              onChange={handleChange}
              placeholder="Facebook username or page"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="social-pinterest">
              <i className="social-icon pinterest"></i> Pinterest
            </label>
            <input
              type="text"
              id="social-pinterest"
              name="social-pinterest"
              value={formData.socialLinks.pinterest}
              onChange={handleChange}
              placeholder="Pinterest username"
            />
          </div>
        </div>
        
        <div className="form-checkbox">
          <input
            type="checkbox"
            id="isArtist"
            name="isArtist"
            checked={formData.isArtist}
            onChange={handleChange}
          />
          <label htmlFor="isArtist">Register as an Artist</label>
          <small>Artists can create and sell their artworks on our platform</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;