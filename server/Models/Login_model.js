const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Counter = require('../Counter.js');
// Define the schema
const loginSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(value) {
        // Email validation regex pattern
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      },
      message: 'Email must be a valid email address.',
    },
  },
});

// Pre-save hook to hash the password

  
loginSchema.pre('save', async function(next) {
    if (this.isNew) {
      try {
        const counter = await Counter.findByIdAndUpdate(
          { _id: 'serialNumber' },
          { $inc: { sequence_value: 1 } },
          { new: true, upsert: true }
        );
        this.serialNumber = counter.sequence_value;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  });
  
module.exports = mongoose.model('tasks', loginSchema);
