// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// --- 1. Middleware Setup ---
app.use(cors()); // Allows cross-origin requests from your Expo app
app.use(express.json()); // Allows parsing of JSON request bodies

// --- 2. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    // Start the server ONLY after the database is connected
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// --- 3. Simple Test Route (Root) ---
app.get('/', (req, res) => {
  res.send('Quiz Backend is Running!');
});

// --- 4. Route for Quiz Data (To be created in next step) ---
// app.use('/api/quizzes', quizRoutes);