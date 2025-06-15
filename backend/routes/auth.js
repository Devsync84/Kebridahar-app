const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        // Don't send password back
        const userData = user.toObject();
        delete userData.password;
        
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
