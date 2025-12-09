// AttemptAnswer.js
const mongoose = require('mongoose');

// Schema for tracking a single question's result within an attempt
const attemptAnswerSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionString: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

module.exports = attemptAnswerSchema;