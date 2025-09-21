// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth'); // Path to your auth middleware
const Post = require('../models/Post');     // Path to your Post model
const User = require('../models/User');     // Path to your User model

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST /api/posts
// @desc    Create a post with optional images
// @access  Private (requires authentication)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  const { text } = req.body;

  try {
    // The 'auth' middleware has already verified the token and set req.user.id
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get uploaded image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newPost = new Post({
      user: req.user.id, // User ID from auth middleware
      text,
      images: imagePaths, // Store the file paths
    });

    const post = await newPost.save();

    // After saving, populate the user details for the response
    const populatedPost = await Post.findById(post._id).populate('user', ['firstName', 'lastName']);
    res.json(populatedPost);

  } catch (err) {
    console.error(err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File size too large. Maximum 5MB allowed.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts (timeline)
// @access  Private (requires authentication to view timeline)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['firstName', 'lastName']) // Populate user's first and last name
      .sort({ createdAt: -1 }); // Sort by newest first (descending order)
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Private (requires authentication)
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', ['firstName', 'lastName']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // Handle case where ID format is invalid (e.g., not a valid MongoDB ObjectId)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (requires authentication and ownership)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user ownership of the post
    // post.user is an ObjectId, req.user.id is a string, so convert post.user to string
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete the post
    await Post.deleteOne({ _id: req.params.id }); // Use deleteOne for Mongoose 6+

    res.json({ msg: 'Post removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;