const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(e) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);
            },
            message: 'Email not valid.'
        }
    },
    mobile_no: {
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Example: 10 digit mobile number
            },
            message: 'Mobile number must be 10 digits.'
        }
    },
    designation: {
        type: String,
        required: true,
        enum: ['manager', 'hr', 'sales'], // Only allow these values
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'], // Only allow these values
    },
    course: {
        type: [String], // Array of strings for checkboxes
        required: true,
        validate: {
            validator: function(e) {
                return e.length > 0; // At least one course must be selected
            },
            message: 'At least one course must be selected.'
        },
        enum: ['MCA', 'BCA', 'BSC'] // Only allow these values
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(png|jpg)$/.test(v); // Check if image ends with .png or .jpg
            },
            message: 'Image must be in PNG or JPG format.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current date/time when the document is created
    }
});

module.exports = mongoose.model('Employees', schema);
