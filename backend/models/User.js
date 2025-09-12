 // backend/models/User.js
    const mongoose = require('mongoose');

    const UserSchema = new mongoose.Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      ps: { type: String, required: true }, // Police Station
      nid: { type: String, required: true, unique: true },
      birthdate: { type: Date, required: true },
      age: { type: Number, required: true },
      presentAddress: { type: String, required: true },
      permanentAddress: { type: String, required: true },
      password: { type: String, required: true }, // Hashed password
      role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' }, // User role
      createdAt: { type: Date, default: Date.now },
    });

    module.exports = mongoose.model('User', UserSchema);