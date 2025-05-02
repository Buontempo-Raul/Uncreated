// backend/seeds/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');
const Artwork = require('../models/Artwork');

// Load environment variables - fix the path to point to the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Make sure the MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI not found in environment variables');
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Create uploads directories if they don't exist
const createUploadDirs = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const profilesDir = path.join(uploadsDir, 'profiles');
  const artworksDir = path.join(uploadsDir, 'artworks');
  
  [uploadsDir, profilesDir, artworksDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  return { uploadsDir, profilesDir, artworksDir };
};

// Create default profile images
const createDefaultImages = ({ profilesDir, artworksDir }) => {
  // We'd normally copy actual images here
  // For this example, we'll just create blank placeholders
  
  const defaultProfilePath = path.join(profilesDir, 'default-profile.jpg');
  if (!fs.existsSync(defaultProfilePath)) {
    // Create a simple blank file
    fs.writeFileSync(defaultProfilePath, '');
  }
  
  // Create some artwork placeholders
  const artworkImages = [
    'artwork-abstract.jpg',
    'artwork-portrait.jpg',
    'artwork-landscape.jpg',
    'artwork-digital.jpg'
  ];
  
  artworkImages.forEach(img => {
    const imgPath = path.join(artworksDir, img);
    if (!fs.existsSync(imgPath)) {
      fs.writeFileSync(imgPath, '');
    }
  });
  
  return { defaultProfilePath, artworkImages };
};

// Seed database with initial data
const seedDatabase = async () => {
  try {
    // Connect to DB
    const conn = await connectDB();
    
    // Create upload directories and default images
    const dirs = createUploadDirs();
    const images = createDefaultImages(dirs);
    
    // Clear existing data
    await User.deleteMany({});
    await Artwork.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      isArtist: false,
      profileImage: 'uploads/profiles/default-profile.jpg',
      bio: 'System administrator',
      website: 'https://example.com',
      createdAt: new Date('2023-01-01')
    });
    
    console.log('Admin user created');
    
    // Create artist user
    const artistPassword = await bcrypt.hash('artist123', 10);
    const artist = await User.create({
      username: 'artistic_soul',
      email: 'artist@example.com',
      password: artistPassword,
      role: 'artist',
      isArtist: true,
      profileImage: 'uploads/profiles/default-profile.jpg',
      bio: 'Contemporary artist specializing in abstract expressionism. Exploring the boundaries between form and emotion through vibrant colors and dynamic compositions.',
      website: 'https://example.com',
      socialLinks: {
        instagram: 'artistic_soul',
        twitter: 'artistic_soul'
      },
      createdAt: new Date('2023-01-15')
    });
    
    console.log('Artist user created');
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      username: 'art_lover',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      isArtist: false,
      profileImage: 'uploads/profiles/default-profile.jpg',
      bio: 'Art enthusiast and collector',
      createdAt: new Date('2023-02-01')
    });
    
    console.log('Regular user created');
    
    // Create follow relationships
    artist.followers.push(regularUser._id);
    await artist.save();
    
    regularUser.following.push(artist._id);
    await regularUser.save();
    
    console.log('Follow relationships created');
    
    // Create artworks
    const artworks = [
      {
        title: 'Abstract Harmony',
        description: 'A vibrant exploration of color and form.',
        images: ['uploads/artworks/artwork-abstract.jpg'],
        price: 299.99,
        category: 'painting',
        medium: 'Acrylic on canvas',
        dimensions: {
          width: 60,
          height: 80,
          unit: 'cm'
        },
        creator: artist._id,
        forSale: true,
        isSold: false,
        tags: ['abstract', 'colorful', 'vibrant'],
        createdAt: new Date('2023-05-10')
      },
      {
        title: 'Emotional Expressions',
        description: 'A portrait series capturing human emotions.',
        images: ['uploads/artworks/artwork-portrait.jpg'],
        price: 399.99,
        category: 'painting',
        medium: 'Oil on canvas',
        dimensions: {
          width: 50,
          height: 70,
          unit: 'cm'
        },
        creator: artist._id,
        forSale: true,
        isSold: false,
        tags: ['portrait', 'emotions', 'expressive'],
        createdAt: new Date('2023-07-22')
      },
      {
        title: 'Cosmic Journey',
        description: 'Abstract representation of space and cosmos.',
        images: ['uploads/artworks/artwork-abstract.jpg'],
        price: 449.99,
        category: 'painting',
        medium: 'Mixed media',
        dimensions: {
          width: 100,
          height: 80,
          unit: 'cm'
        },
        creator: artist._id,
        forSale: true,
        isSold: false,
        tags: ['cosmic', 'space', 'abstract'],
        createdAt: new Date('2023-09-05')
      },
      {
        title: 'Urban Symphony',
        description: 'A colorful interpretation of city life and movement.',
        images: ['uploads/artworks/artwork-digital.jpg'],
        price: 329.99,
        category: 'digital',
        creator: artist._id,
        forSale: false,
        isSold: false,
        tags: ['urban', 'city', 'digital'],
        createdAt: new Date('2023-11-18')
      }
    ];
    
    const createdArtworks = await Artwork.insertMany(artworks);
    console.log('Artworks created');
    
    // Add favorite artworks for users
    regularUser.favorites.push(createdArtworks[0]._id);
    regularUser.favorites.push(createdArtworks[2]._id);
    await regularUser.save();
    
    console.log('Favorites added');
    
    console.log('Database seeded successfully!');
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();