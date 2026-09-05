const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' }); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const app = express();

app.use(cors());  
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node.js Server running on port ${PORT}`);
});