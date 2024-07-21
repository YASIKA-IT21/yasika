const express = require('express');
const router = express.Router();
const loginmodel = require('../Models/Login_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '5555';
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const employee_model = require('../Models/Employee_model');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (!['.png', '.jpg'].includes(ext)) {
            return cb(new Error('File type is not supported'), false);
        }
        const username = req.body.name || 'default'; // Fallback to 'default' if username is not provided
        cb(null, `${username}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (!['.png', '.jpg'].includes(ext)) {
            return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
    }
});

// Create a new user
router.post('/create', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password format before hashing
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character.' });
    }

    try {
        const serialNumber = uuid.v4(); // Generate a unique serial number
        const hashedPassword = await bcrypt.hashSync(password, 10);
        console.log(hashedPassword);
        const newRecord = new loginmodel({ serialNumber, username, password: hashedPassword, email });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error creating new record:', error);

        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const user = await loginmodel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email' });
        }

        // Log the hashed password from the database
        console.log('Stored Hashed Password:', user.password);

        // Verify the password
        const isPasswordValid = await bcrypt.compareSync(password, user.password);

        // Log the result of the password comparison
        console.log('Password Valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: '30m' } // Set token expiration to 30 minutes
        );

        res.json({ message: 'Login successful', token,user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).json({ message: 'Server error', error });
    }
});
  

// Create a new employee
router.post('/create_employee', upload.single('image'), async (req, res) => {
    const { name, email, mobile_no, designation, gender, course } = req.body;
    const image = req.file ? `http://localhost:3005/uploads/${req.file.filename}`: null;

    if (!name || !email || !mobile_no || !designation || !gender || !course || !image) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newRecord = new employee_model({ name, email, mobile_no, designation, gender, course: JSON.parse(course), image });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error creating new record:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get all employees
router.get('/employees', (req, res) => {
    employee_model.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

// Delete an employee
router.delete('/delete_employees/:id', (req, res) => {
    const { id } = req.params;
    employee_model.findByIdAndDelete(id)
        .then(() => res.json({ message: "User deleted successfully" }))
        .catch(err => res.status(500).json(err));
});

// Get an employee by ID
router.get('/employees/:id', (req, res) => {
    const { id } = req.params;
    employee_model.findById(id)
        .then(employee => {
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json(employee);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// Update an employee
router.put('/employees/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, email, mobile_no, designation, gender, course } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const updatedFields = {
        name,
        email,
        mobile_no,
        designation,
        gender,
        course: JSON.parse(course)
    };

    if (image) {
        updatedFields.image = image;
    }

    employee_model.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true, runValidators: true }
    )
    .then(employee => {
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    })
    .catch(err => {
        console.error('Error updating employee:', err.message);
        res.status(500).json({ error: err.message });
    });
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await employee_model.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const imagePath = employee.image;
        
        if (!imagePath) {
            return res.status(404).json({ message: 'No image found for this employee' });
        }

        const fullImagePath = path.join(__dirname, '../uploads', path.basename(imagePath));
        
        fs.access(fullImagePath, fs.constants.F_OK, (err) => {
            if (err) {
                return res.status(404).json({ message: 'Image not found on server' });
            }
            res.json({ imagePath });
        });
    } catch (error) {
        console.error('Error checking image existence:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
