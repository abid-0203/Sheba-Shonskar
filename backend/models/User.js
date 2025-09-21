// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true,
    trim: true
  },
  altPhone: { 
    type: String,
    trim: true
  },
  ps: { 
    type: String, 
    required: true,
    trim: true
  }, // Police Station
  nid: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  birthdate: { 
    type: Date, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  presentAddress: { 
    type: String, 
    required: true,
    trim: true
  },
  permanentAddress: { 
    type: String, 
    required: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  }, // Hashed password
  role: { 
    type: String, 
    enum: ['citizen', 'admin'], 
    default: 'citizen' 
  }, // User role
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String, // URL to profile image
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ nid: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = Date.now();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);