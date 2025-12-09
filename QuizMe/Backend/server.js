// server.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Import quiz,attempt, explaination route
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const explanationRoutes = require('./routes/explanationRoutes');

//Middleware Setup 
app.use(cors()); 
app.use(express.json()); 

// Database Connection 
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

// Simple Test Route (Root) 
app.get('/', (req, res) => {
  res.send('Quiz Backend is Running!');
});

// oute for Quiz Data 
app.use('/api/quizzes', quizRoutes);

// Route for Attempt Data 
app.use('/api/attempts', attemptRoutes);

// Route for AI Explanations 
app.use('/api/ai/explain', explanationRoutes);