//attemptRoutes.js
const express = require('express');
const Attempt = require('../models/Attempt');

const router = express.Router();

// POST route to CREATE a new quiz attempt
router.post('/', async (req, res) => {
  const attemptData = req.body; 

  // Basic validation check
  if (!attemptData.quizId || !attemptData.resultPercentage || !attemptData.answers) {
    return res.status(400).json({ message: 'Missing required attempt data (quizId, resultPercentage, or answers).' });
  }

  try {
    const newAttempt = new Attempt(attemptData);
    const savedAttempt = await newAttempt.save();
    
    // Respond with the saved attempt and a 201 Created status
    res.status(201).json(savedAttempt);
    
  } catch (error) {
    console.error('Database save error:', error);
    res.status(400).json({ 
        message: 'Failed to save attempt.', 
        error: error.message,
    });
  }
});

module.exports = router;