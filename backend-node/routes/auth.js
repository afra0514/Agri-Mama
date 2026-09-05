const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        let existingUser = await User.findOne({ 
            $or: [
                { email: email.trim().toLowerCase() }, 
                { username: username.trim() }
            ] 
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email or Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username: username.trim(), 
            email: email.trim().toLowerCase(), 
            password: hashedPassword 
        });
        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET || "AgriMamaSecret", 
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: "Account created! Welcome to AgriMama.",
            token, 
            userId: newUser._id, 
            username: newUser.username 
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

router.post('/login', async (req, res) => {
    try {
        let identifier = req.body.email ? req.body.email.trim() : "";
        let password = req.body.password ? req.body.password.trim() : "";

        const safeIdentifier = escapeRegex(identifier);
        
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp("^" + safeIdentifier + "$", "i") } },
                { username: { $regex: new RegExp("^" + safeIdentifier + "$", "i") } }
            ]
        });

        if (!user) return res.status(400).json({ error: "No user found with this email/username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || "AgriMamaSecret", 
            { expiresIn: '7d' }
        );

        res.json({ 
            token, 
            userId: user._id, 
            username: user.username 
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: "Login process failed" });
    }
});

module.exports = router;