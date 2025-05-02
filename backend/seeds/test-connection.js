// test-connection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Use the exact path to your .env file
const envPath = '/home/raul/web/Uncreated/backend/.env';
console.log('Looking for .env file at:', envPath);
console.log('File exists:', fs.existsSync(envPath));

// Load environment variables
dotenv.config({ path: envPath });

console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  // Try loading directly
  try {
    const envContents = fs.readFileSync(envPath, 'utf8');
    console.log('ENV file contents found');
    
    // Manual parsing of MONGO_URI
    const match = envContents.match(/MONGO_URI=(.+)/);
    if (match && match[1]) {
      console.log('Manually extracted MONGO_URI');
      process.env.MONGO_URI = match[1];
    }
  } catch (err) {
    console.error('Error reading .env file:', err);
  }
}

async function testConnection() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is still undefined after attempted fixes');
    }
    
    console.log('Attempting to connect with URI...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection();