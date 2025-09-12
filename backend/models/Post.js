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
      },
      images: [{ // Array of image URLs
        type: String,
      }],
      status: {
        type: String,
        enum: ['Pending', 'On Progress', 'Solved'],
        default: 'Pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    module.exports = mongoose.model('Post', PostSchema);
    