// models/Quiz.js
const mongoose = require('mongoose');
const questionSchema = require('./Question'); 

// Defines the structure for the entire quiz document
const quizSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  
  // Array of sub-documents using the nested schema
  questions: { 
    type: [questionSchema],
    required: true,
    validate: { //Ensure at least one question exists
      validator: (v) => v.length > 0,
      message: 'A quiz must contain at least one question.'
    }
  },
  
}, { timestamps: true }); // enables createdAt and updatedAt fields

// Export the model
module.exports = mongoose.model('Quiz', quizSchema);