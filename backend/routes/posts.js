// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Path to your auth middleware
const Post = require('../models/Post');     // Path to your Post model
const User = require('../models/User');     // Path to your User model (for populating user info)

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  const { text, images } = req.body; // 'images' will be an array of URLs

  try {
    // The 'auth' middleware has already verified the token and set req.user.id
    // We can optionally fetch the user to ensure they still exist, though not strictly necessary for post creation
    const user = await User.findById(req.user.id).select('-password'); // Select -password to not send it
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newPost = new Post({
      user: req.user.id, // User ID from auth middleware
      text,
      images: images || [], // Ensure images is an array, even if empty
    });

    const post = await newPost.save();

    // After saving, populate the user details for the response
    // This ensures the frontend gets the user's name immediately
    const populatedPost = await Post.findById(post._id).populate('user', ['firstName', 'lastName']);
    res.json(populatedPost);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts
// @desc    Get all posts for citizens
// @access  Private (requires authentication)
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
// @desc    Get all posts for admin dashboard
// @access  Private (Admin only)
router.get('/admin', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const posts = await Post.find()
      .populate('user', ['firstName', 'lastName'])
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/posts/admin/:id
// @desc    Update post status (Admin only)
// @access  Private (Admin only)
router.patch('/admin/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin only.' });
    }

    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'On Progress', 'Solved', 'Declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.status = status;
    await post.save();
    
    // Return updated post with user info
    const updatedPost = await Post.findById(post._id).populate('user', ['firstName', 'lastName']);
    res.json(updatedPost);
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

    // Check user ownership of the post OR if user is admin
    const user = await User.findById(req.user.id);
    const isOwner = post.user.toString() === req.user.id;
    const isAdmin = user && user.role === 'admin';

    if (!isOwner && !isAdmin) {
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