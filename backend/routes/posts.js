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
  const { text, category } = req.body;

  try {
    // The 'auth' middleware has already verified the token and set req.user.id
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Validate category
    const validCategories = ['Electricity Issue', 'Gas Issue', 'Road Issue', 'Water Issue', 'Other Issue'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ msg: 'Invalid category selected' });
    }

    // Get uploaded image paths
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newPost = new Post({
      user: req.user.id, // User ID from auth middleware
      text,
      category,
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
// @desc    Get all posts (timeline) - for citizens
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

// @route   GET /api/posts/admin
// @desc    Get all posts for admin with optional category filter
// @access  Private (requires admin authentication)
router.get('/admin', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { category, status } = req.query;
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }

    const posts = await Post.find(filter)
      .populate('user', ['firstName', 'lastName', 'email', 'phone', 'presentAddress'])
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/posts/:id/status
// @desc    Update post status (admin only)
// @access  Private (requires admin authentication)
router.put('/:id/status', auth, async (req, res) => {
  // MODIFIED: Destructure adminMessage from req.body
  const { status, adminMessage } = req.body; 

  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const validStatuses = ['Pending', 'On Progress', 'Solved', 'Declined'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    // Find the post and update its status and adminMessage
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status, adminMessage: adminMessage || '' }, // NEW: Update adminMessage, default to empty string if not provided
      { new: true }
    ).populate('user', ['firstName', 'lastName', 'email']);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
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

    // Check user ownership of the post or admin privilege
    const user = await User.findById(req.user.id);
    if (post.user.toString() !== req.user.id && user.role !== 'admin') {
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
