require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db_connect.js');
const verify = require('./verifyToken.js');
const loginRouter = require('./Routes/Routes.js'); // Correct path to your routes file

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', loginRouter);

app.use('/uploads', express.static('uploads'));

app.get('/admin', verify, async (req, res) => {
    try {
        const user = await loginmodel.findOne({ username: req.user.username }); // Use req.user.username
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
const port =process.env.PORT||3005; 
app.listen(port, () => {
    console.log("Server is running on port 3005");
});
