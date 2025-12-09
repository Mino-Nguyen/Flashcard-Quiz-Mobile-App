// quizRoutes.js
const express = require('express');
const Quiz = require('../models/Quiz');
const router = express.Router();

// GET all quiz documents 
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST to CREATE a new quiz document (e.g., /api/quizzes)
router.post('/', async (req, res) => {
  const quizData = req.body; 
  
  try {
    // Create a new Quiz instance from the request body
    const newQuiz = new Quiz(quizData);
    
    // Save the document to MongoDB
    const savedQuiz = await newQuiz.save();
    
    // Respond with the saved quiz and a 201 Created status
    res.status(201).json(savedQuiz);
    
  } catch (error) {
    // Handle validation errors or database connection errors
    res.status(400).json({ 
        message: 'Failed to create quiz.', 
        error: error.message,
        details: error.errors // Provides Mongoose validation details
    });
  }
});

// UPDATE QUIZ (PATCH/PUT) 
router.patch('/:id', async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id, 
      req.body,      
      { new: true, runValidators: true } 
    );

    if (updatedQuiz == null) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE QUIZ 
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);

    if (deletedQuiz == null) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Success, but no content to return
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;