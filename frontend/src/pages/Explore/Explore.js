// src/pages/Explore/Explore.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';
// Uncomment when ready to use API
// import { artworkAPI, userAPI } from '../../services/api';

// Temporary artist data - Replace with API calls when ready
const tempArtists = [
  {
    _id: '1',
    username: 'artistic_soul',
    profileImage: 'https://via.placeholder.com/150x150',
    bio: 'Contemporary artist specializing in abstract expressionism.',
    isArtist: true
  },
  {
    _id: '2',
    username: 'city_explorer',
    profileImage: 'https://via.placeholder.com/150x150',
    bio: 'Urban photographer capturing the essence of city life.',
    isArtist: true
  },
  {
    _id: '3',
    username: 'nature_artist',
    profileImage: 'https://via.placeholder.com/150x150',
    bio: 'Sculptor inspired by natural forms and organic shapes.',
    isArtist: true
  },
  {
    _id: '4',
    username: 'future_creative',
    profileImage: 'https://via.placeholder.com/150x150',
    bio: 'Digital artist exploring futuristic concepts and sci-fi themes.',
    isArtist: true
  }
];

// Temporary artwork data - Replace with API calls when ready
const tempArtworks = [
  {
    _id: '1',
    title: 'Abstract Harmony',
    description: 'A vibrant exploration of color and form.',
    images: ['https://via.placeholder.com/400x300?text=Abstract+Harmony'],
    category: 'painting',
    creator: {
      username: 'artistic_soul',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 42,
    views: 128
  },
  {
    _id: '2',
    title: 'Urban Landscape',
    description: 'Cityscape captured through a unique perspective.',
    images: ['https://via.placeholder.com/400x300?text=Urban+Landscape'],
    category: 'photography',
    creator: {
      username: 'city_explorer',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 36,
    views: 104
  },
  {
    _id: '3',
    title: 'Serenity',
    description: 'A peaceful nature-inspired sculpture.',
    images: ['https://via.placeholder.com/400x300?text=Serenity'],
    category: 'sculpture',
    creator: {
      username: 'nature_artist',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 51,
    views: 156
  },
  {
    _id: '4',
    title: 'Digital Dreams',
    description: 'A futuristic digital artwork exploring imagination.',
    images: ['https://via.placeholder.com/400x300?text=Digital+Dreams'],
    category: 'digital',
    creator: {
      username: 'future_creative',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 29,
    views: 87
  },
  {
    _id: '5',
    title: 'Emotional Expressions',
    description: 'A portrait series capturing human emotions.',
    images: ['https://via.placeholder.com/400x300?text=Emotional+Expressions'],
    category: 'painting',
    creator: {
      username: 'emotion_artist',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 45,
    views: 132
  },
  {
    _id: '6',
    title: 'Textured Patterns',
    description: 'Mixed media artwork with unique textures and patterns.',
    images: ['https://via.placeholder.com/400x300?text=Textured+Patterns'],
    category: 'mixed media',
    creator: {
      username: 'texture_master',
      profileImage: 'https://via.placeholder.com/50x50'
    },
    likes: 33,
    views: 98
  }
];

const Explore = () => {
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [trendingArtworks, setTrendingArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data
    const fetchExploreData = async () => {
      setLoading(true);
      try {
        // Uncomment when ready to use API
        // const artistsResponse = await userAPI.getFeaturedArtists();
        // const artworksResponse = await artworkAPI.getTrendingArtworks();
        
        // if (artistsResponse.data.success && artworksResponse.data.success) {
        //   setFeaturedArtists(artistsResponse.data.artists);
        //   setTrendingArtworks(artworksResponse.data.artworks);
        // }

        // Temporary - using mock data
        // Simulate API delay
        setTimeout(() => {
          setFeaturedArtists(tempArtists);
          setTrendingArtworks(tempArtworks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching explore data:', error);
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  return (
    <div className="explore-container">
      <section className="explore-hero">
        <div className="hero-content">
          <h1>Explore the World of Art</h1>
          <p>Discover amazing artists and their creations</p>
        </div>
      </section>
      
      {loading ? (
        <div className="loading">Loading explore content...</div>
      ) : (
        <>
          <section className="featured-artists">
            <h2 className="section-title">Featured Artists</h2>
            <div className="artists-grid">
              {featuredArtists.map((artist) => (
                <div key={artist._id} className="artist-card">
                  <Link to={`/profile/${artist.username}`} className="artist-image">
                    <img src={artist.profileImage} alt={artist.username} />
                  </Link>
                  <div className="artist-details">
                    <h3 className="artist-username">
                      <Link to={`/profile/${artist.username}`}>{artist.username}</Link>
                    </h3>
                    <p className="artist-bio">{artist.bio}</p>
                    <Link to={`/profile/${artist.username}`} className="view-profile-btn">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="trending-artworks">
            <h2 className="section-title">Trending Artworks</h2>
            <div className="artworks-grid">
              {trendingArtworks.map((artwork) => (
                <div key={artwork._id} className="artwork-card">
                  <Link to={`/artwork/${artwork._id}`} className="artwork-image">
                    <img src={artwork.images[0]} alt={artwork.title} />
                  </Link>
                  <div className="artwork-details">
                    <h3 className="artwork-title">
                      <Link to={`/artwork/${artwork._id}`}>{artwork.title}</Link>
                    </h3>
                    <p className="artwork-creator">
                      by <Link to={`/profile/${artwork.creator.username}`}>{artwork.creator.username}</Link>
                    </p>
                    <p className="artwork-category">{artwork.category}</p>
                    <div className="artwork-stats">
                      <span className="likes">{artwork.likes} likes</span>
                      <span className="views">{artwork.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="explore-categories">
            <h2 className="section-title">Browse by Category</h2>
            <div className="categories-grid">
              <Link to="/shop?category=painting" className="category-card painting">
                <div className="category-overlay">
                  <h3>Paintings</h3>
                </div>
              </Link>
              <Link to="/shop?category=sculpture" className="category-card sculpture">
                <div className="category-overlay">
                  <h3>Sculptures</h3>
                </div>
              </Link>
              <Link to="/shop?category=photography" className="category-card photography">
                <div className="category-overlay">
                  <h3>Photography</h3>
                </div>
              </Link>
              <Link to="/shop?category=digital" className="category-card digital">
                <div className="category-overlay">
                  <h3>Digital Art</h3>
                </div>
              </Link>
              <Link to="/shop?category=mixed media" className="category-card mixed-media">
                <div className="category-overlay">
                  <h3>Mixed Media</h3>
                </div>
              </Link>
              <Link to="/shop" className="category-card all-art">
                <div className="category-overlay">
                  <h3>All Art</h3>
                </div>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Explore;