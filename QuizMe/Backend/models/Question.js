// models/Question.js
const mongoose = require('mongoose');

// Define the structure for a single question document
const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true
  },
  questionString: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  // Use an array to hold the other incorrect options
  incorrectAnswers: {
    type: [String], 
    required: true,
    validate: { // Ensure exactly two incorrect answers are provided
      validator: (v) => v.length === 2,
      message: props => `${props.value.length} incorrect answers provided. Must be 2.`
    }
  },
});

module.exports = questionSchema;