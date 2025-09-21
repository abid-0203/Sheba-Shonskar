// backend/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{ // Array of image URLs
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Pending', 'On Progress', 'Solved', 'Declined'],
    default: 'Pending',
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  category: {
    type: String,
    enum: ['Road Issues', 'Water Supply', 'Electricity', 'Gas Supply', 'Sanitation', 'Street Lights', 'Other'],
    default: 'Other'
  },
  location: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Index for faster queries
PostSchema.index({ createdAt: -1 });
PostSchema.index({ user: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ category: 1 });

// Update the updatedAt field before saving
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', PostSchema);