require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'process.env.SECRET_KEY;';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token expired' });
        }
        req.username = decoded.username;  
        next();
    });
};

module.exports = verifyToken;
