// src/pages/Explore/Explore.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Explore.css';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('following');
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});

  // Mock data for user profile - in production this would come from your auth context
  const user = {
    id: 'user123',
    name: 'Alex Morgan',
    username: 'alex_creates',
    avatar: 'https://via.placeholder.com/40?text=AM',
    following: [2, 4], // IDs of artists the user follows
  };

  // Mock data - in production this would come from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockPosts = [
        {
          id: 1,
          artistId: 1,
          artistName: 'Isabella Rodriguez',
          artistUsername: 'bella_creates',
          artistAvatar: 'https://via.placeholder.com/40?text=IR',
          image: 'https://via.placeholder.com/600x600?text=Urban+Dreams',
          caption: 'Just finished this piece exploring urban architecture and dreams. What do you think? #abstractart #urbandreams',
          likes: 423,
          comments: 32,
          timeAgo: '2 hours ago',
          tags: ['abstract', 'urban', 'architecture'],
          shopItem: {
            id: 101,
            title: 'Urban Dreams Canvas Print',
            price: 149.99,
            available: true
          }
        },
        {
          id: 2,
          artistId: 2,
          artistName: 'Marcus Chen',
          artistUsername: 'mchen_art',
          artistAvatar: 'https://via.placeholder.com/40?text=MC',
          image: 'https://via.placeholder.com/600x800?text=Neon+City',
          caption: 'Exploring the relationship between humanity and technology in my latest digital art series. #digitalart #cyberpunk',
          likes: 892,
          comments: 78,
          timeAgo: '5 hours ago',
          tags: ['digital', 'cyberpunk', 'neon'],
          shopItem: {
            id: 102,
            title: 'Neon City Limited Print',
            price: 89.99,
            available: true
          }
        },
        {
          id: 3,
          artistId: 3,
          artistName: 'Olivia Bennett',
          artistUsername: 'olivia_sculpture',
          artistAvatar: 'https://via.placeholder.com/40?text=OB',
          image: 'https://via.placeholder.com/600x600?text=Harmony+in+Wood',
          caption: 'Newest sculpture made from reclaimed wood found along the coast. Sustainable art is my passion! #sculpture #sustainable #wood',
          likes: 317,
          comments: 45,
          timeAgo: '1 day ago',
          tags: ['sculpture', 'sustainable', 'wood'],
          shopItem: {
            id: 103,
            title: 'Harmony Wooden Sculpture',
            price: 499.99,
            available: false
          }
        },
        {
          id: 4,
          artistId: 4,
          artistName: 'Takashi Yamamoto',
          artistUsername: 'yamamoto_ink',
          artistAvatar: 'https://via.placeholder.com/40?text=TY',
          image: 'https://via.placeholder.com/600x700?text=Whispers+of+Autumn',
          caption: 'Merging traditional ink techniques with contemporary themes. This piece represents the transition of seasons. #inkart #traditional #japan',
          likes: 645,
          comments: 53,
          timeAgo: '8 hours ago',
          tags: ['ink', 'traditional', 'japan'],
          shopItem: {
            id: 104,
            title: 'Whispers of Autumn Original Ink',
            price: 1299.99,
            available: true
          }
        },
        {
          id: 5,
          artistId: 5,
          artistName: 'Emma Wilson',
          artistUsername: 'emma_photography',
          artistAvatar: 'https://via.placeholder.com/40?text=EW',
          image: 'https://via.placeholder.com/600x600?text=Ocean+Reflections',
          caption: 'Capturing the serene beauty of dawn by the ocean. Light and water create such magical combinations. #photography #ocean #dawn',
          likes: 528,
          comments: 41,
          timeAgo: '3 hours ago',
          tags: ['photography', 'nature', 'ocean'],
          shopItem: {
            id: 105,
            title: 'Ocean Reflections - Framed Print',
            price: 179.99,
            available: true
          }
        },
        {
          id: 6,
          artistId: 2,
          artistName: 'Marcus Chen',
          artistUsername: 'mchen_art',
          artistAvatar: 'https://via.placeholder.com/40?text=MC',
          image: 'https://via.placeholder.com/600x600?text=Digital+Wasteland',
          caption: 'Latest piece from my dystopian future series. Looking at environmental consequences of our digital age. #digitalart #environment',
          likes: 763,
          comments: 92,
          timeAgo: '1 day ago',
          tags: ['digital', 'environment', 'dystopian'],
          shopItem: {
            id: 106,
            title: 'Digital Wasteland Art Print',
            price: 79.99,
            available: true
          }
        },
        {
          id: 7,
          artistId: 6,
          artistName: 'Carlos Rivera',
          artistUsername: 'carlosart',
          artistAvatar: 'https://via.placeholder.com/40?text=CR',
          image: 'https://via.placeholder.com/600x800?text=Street+Art+Revolution',
          caption: 'My latest mural in downtown. Art should belong to everyone and transform public spaces! #streetart #mural #urban',
          likes: 921,
          comments: 104,
          timeAgo: '2 days ago',
          tags: ['streetart', 'mural', 'urban'],
          shopItem: {
            id: 107,
            title: 'Street Art Revolution - Photo Book',
            price: 59.99,
            available: true
          }
        },
        {
          id: 8,
          artistId: 4,
          artistName: 'Takashi Yamamoto',
          artistUsername: 'yamamoto_ink',
          artistAvatar: 'https://via.placeholder.com/40?text=TY',
          image: 'https://via.placeholder.com/600x600?text=Mountain+Spirit',
          caption: 'Inspired by the ancient mountains of Hokkaido. Ink and minimal watercolor on handmade washi paper. #inkart #mountains #japan',
          likes: 582,
          comments: 47,
          timeAgo: '1 day ago',
          tags: ['ink', 'mountains', 'japan'],
          shopItem: {
            id: 108,
            title: 'Mountain Spirit - Original Artwork',
            price: 1499.99,
            available: true
          }
        },
      ];

      setPosts(mockPosts);
      // Filter posts from artists the user follows
      setFollowingPosts(mockPosts.filter(post => user.following.includes(post.artistId)));
      setLoading(false);
    }, 1000);
  }, []);

  // Animation variants
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
        duration: 0.4
      }
    }
  };

  // Handle post interactions
  const handleLikePost = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleSavePost = (postId) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Get currently displayed posts based on active tab
  const displayedPosts = activeTab === 'following' ? followingPosts : posts;

  return (
    <div className="explore-container">
      {/* Instagram-like header */}
      <div className="instagram-header">
        <h1>Uncreated</h1>
        <div className="header-actions">
          <button className="icon-btn">
            <i className="fas fa-plus-square"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-heart"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Feed tabs */}
      <div className="feed-tabs">
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`} 
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
        <button 
          className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`} 
          onClick={() => setActiveTab('explore')}
        >
          Explore
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your feed...</p>
        </div>
      ) : (
        <>
          {displayedPosts.length === 0 && activeTab === 'following' ? (
            <div className="empty-following">
              <div className="empty-icon">🎨</div>
              <h2>Your feed is empty</h2>
              <p>Follow more artists to see their latest work in your feed</p>
              <button className="primary-btn" onClick={() => setActiveTab('explore')}>
                Discover Artists
              </button>
            </div>
          ) : (
            <motion.div 
              className="posts-feed"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeTab}
            >
              {displayedPosts.map(post => (
                <motion.div 
                  key={post.id} 
                  className="post-card"
                  variants={itemVariants}
                >
                  <div className="post-header">
                    <div className="artist-info">
                      <img src={post.artistAvatar} alt={post.artistName} className="artist-avatar" />
                      <div>
                        <p className="artist-name">{post.artistName}</p>
                        <p className="artist-username">@{post.artistUsername}</p>
                      </div>
                    </div>
                    <button className="more-options">
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                  </div>
                  
                  <div className="post-image">
                    <img src={post.image} alt="" />
                  </div>
                  
                  <div className="post-actions">
                    <div className="left-actions">
                      <button 
                        className={`action-btn ${likedPosts[post.id] ? 'liked' : ''}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <i className={`${likedPosts[post.id] ? 'fas' : 'far'} fa-heart`}></i>
                      </button>
                      <button className="action-btn">
                        <i className="far fa-comment"></i>
                      </button>
                      <button className="action-btn">
                        <i className="far fa-paper-plane"></i>
                      </button>
                    </div>
                    <button 
                      className={`action-btn ${savedPosts[post.id] ? 'saved' : ''}`}
                      onClick={() => handleSavePost(post.id)}
                    >
                      <i className={`${savedPosts[post.id] ? 'fas' : 'far'} fa-bookmark`}></i>
                    </button>
                  </div>
                  
                  <div className="post-likes">
                    {likedPosts[post.id] ? post.likes + 1 : post.likes} likes
                  </div>
                  
                  <div className="post-caption">
                    <span className="caption-username">@{post.artistUsername}</span> {post.caption}
                  </div>
                  
                  <div className="post-comments-link">
                    View all {post.comments} comments
                  </div>

                  <div className="post-time">
                    {post.timeAgo}
                  </div>

                  {post.shopItem && (
                    <div className="shop-item-link">
                      <div className="shop-item-info">
                        <span className="shop-item-title">{post.shopItem.title}</span>
                        <span className="shop-item-price">${post.shopItem.price.toFixed(2)}</span>
                      </div>
                      <Link to={`/shop/item/${post.shopItem.id}`} className="shop-btn">
                        {post.shopItem.available ? 'Shop Now' : 'View Details'}
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Instagram-like bottom navigation */}
      <div className="instagram-nav">
        <button className="nav-btn active">
          <i className="fas fa-home"></i>
        </button>
        <button className="nav-btn">
          <i className="fas fa-search"></i>
        </button>
        <button className="nav-btn">
          <i className="fas fa-shopping-bag"></i>
        </button>
        <button className="nav-btn">
          <i className="fas fa-user"></i>
        </button>
      </div>
    </div>
  );
};

export default Explore;