// Attempt.js
const mongoose = require('mongoose');
// Import the nested schema
const AttemptAnswerSchema = require('./AttemptAnswer'); 

const attemptSchema = new mongoose.Schema({

  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',                        
    required: true,
  },
  
  // Overall result
  resultPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  
  // Array of sub-documents using the nested schema
  answers: {
    type: [AttemptAnswerSchema],
    required: true,
  },
  
}, { timestamps: true });

module.exports = mongoose.model('Attempt', attemptSchema);