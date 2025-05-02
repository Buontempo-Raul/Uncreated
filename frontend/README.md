# Uncreated - Art Marketplace Platform

Uncreated is a full-stack web application that serves as a marketplace for artists to showcase and sell their artwork. Users can create profiles, follow artists, browse artwork, and purchase pieces they love.

## Features

- User authentication (register, login, profile management)
- Artist profiles with customizable bios and social media links
- Upload and manage artworks
- Follow artists and like artworks
- Browse and search artwork by various criteria
- Shopping cart and checkout functionality
- Responsive design for all devices

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Styled with CSS 
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uncreated.git
   cd uncreated
   ```

2. **Set up environment variables**
   
   Create `.env` file in the backend directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Seed the database with initial data**
   ```bash
   cd ../backend
   node seeds/seed.js
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Demo Users

After running the seed script, you can log in with these demo accounts:

- **Admin User**
  - Email: admin@example.com
  - Password: admin123

- **Artist User**
  - Email: artist@example.com
  - Password: artist123

- **Regular User**
  - Email: user@example.com
  - Password: user123

## Project Structure

```
├── backend             # Backend code
│   ├── config          # Configuration files
│   ├── controllers     # Request handlers
│   ├── middleware      # Express middleware
│   ├── models          # Mongoose schemas
│   ├── routes          # API routes
│   ├── seeds           # Database seeders
│   ├── uploads         # Uploaded files
│   └── server.js       # Entry point
├── frontend            # Frontend code
│   ├── public          # Static files
│   └── src             # React components and logic
│       ├── components  # Reusable components
│       ├── context     # React context providers
│       ├── hooks       # Custom React hooks
│       ├── pages       # Page components
│       ├── services    # API services
│       └── styles      # CSS files
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/password` - Update password

### Users
- `GET /api/users/:username` - Get user by username
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:username/artworks` - Get user's artworks
- `POST /api/users/:id/follow` - Follow a user
- `POST /api/users/:id/unfollow` - Unfollow a user
- `GET /api/users/favorites` - Get user's favorites
- `POST /api/users/favorites/:artworkId` - Add to favorites
- `DELETE /api/users/favorites/:artworkId` - Remove from favorites

### Artworks
- `GET /api/artworks` - Get all artworks (with filtering)
- `GET /api/artworks/:id` - Get artwork by ID
- `POST /api/artworks` - Create new artwork
- `PUT /api/artworks/:id` - Update artwork
- `DELETE /api/artworks/:id` - Delete artwork
- `POST /api/artworks/:id/like` - Like an artwork

### Shop
- `GET /api/shop/featured` - Get featured artworks
- `GET /api/shop/recent` - Get recent artworks
- `GET /api/shop/popular` - Get popular artworks
- `GET /api/shop/cart` - Get user's cart
- `POST /api/shop/cart` - Add to cart
- `POST /api/shop/orders` - Create order
- `GET /api/shop/orders/:id` - Get order by ID
- `GET /api/shop/myorders` - Get user's orders

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)