//attemptRoutes.js
const express = require('express');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

const router = express.Router();

// Retrieve all quiz attempts
router.get('/', async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate({ path: 'quizId', select: 'category' })
      .sort({ attemptedAt: -1 });

    res.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Failed to fetch quiz attempts.' });
  }
});

// POST route to CREATE a new quiz attempt
router.post('/', async (req, res) => {
  const attemptData = req.body;
  const { quizId, resultPercentage, answers } = attemptData;

  const isPercentageMissing = (resultPercentage === undefined || resultPercentage === null);

  // Basic validation check
  if (!quizId || isPercentageMissing || !answers) {
    return res.status(400).json({
      message: 'Missing required attempt data (quizId, resultPercentage, or answers).',
    });
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

router.get('/:attemptId/review', async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId).exec();

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found.' });
    }

    const quiz = await Quiz.findById(attempt.quizId).exec();

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz associated with attempt not found.' });
    }

    res.status(200).json({
      quiz: quiz.toObject(),
      answers: attempt.answers,
    });

  } catch (error) {
    console.error('CRITICAL Error fetching review data:', error);
    res.status(500).json({ message: 'Server error fetching review data.' });
  }
});

module.exports = router;