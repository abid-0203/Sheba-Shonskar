// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend communication
app.use(express.json()); // Enable parsing of JSON request bodies

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

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

app.use('/api/auth', authRoutes); // Routes for authentication (register, login)
app.use('/api/posts', postRoutes); // Routes for posts (create, get, delete)

// Start the server
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});