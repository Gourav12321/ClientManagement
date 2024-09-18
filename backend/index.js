const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')
const app = express();
dotenv.config();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

// Middleware
app.use(cors())
app.use(express.json());


// Initialize routes
app.use('/api', router);
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve the index.html for any unknown routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
