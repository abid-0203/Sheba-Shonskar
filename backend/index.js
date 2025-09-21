// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend communication
app.use(express.json()); // Enable parsing of JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route to check if server is running
app.get('/', (req, res) => {
  res.send('ShebaShongskar Backend API is running!');
});

// Import and use API routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat'); // Add chat routes

app.use('/api/auth', authRoutes); // Routes for authentication (register, login)
app.use('/api/posts', postRoutes); // Routes for posts (create, get, delete)
app.use('/api/chat', chatRoutes); // Routes for chat functionality

// Start the server
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});