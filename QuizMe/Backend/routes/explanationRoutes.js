// routes/explanationRoutes.js
const express = require('express');
const OpenAI = require('openai'); // Import the OpenAI library

const router = express.Router();

// Initialize the OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate an explanation
router.post('/', async (req, res) => {
    // 1. Get data from the Expo app's request body
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !correctAnswer) {
        return res.status(400).json({ message: "Missing question details." });
    }

    // 2. Construct the prompt using the Chat Completion format
    const prompt = `
        You are a helpful and detailed quiz explanation expert. 
        Generate a concise and engaging explanation for the following quiz question and answer.

        Question: ${questionText}
        Correct Answer: ${correctAnswer}
        Options: ${options.join(', ')}

        Structure your response to first explain why the correct answer is right, and then briefly state why the other options are incorrect.
    `;

    try {
        // 3. Call the OpenAI Chat Completions API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // A fast and capable model for text generation
            messages: [
                { role: "system", content: "You are a helpful and detailed quiz explanation expert." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7, // Set temperature for creativity
            max_tokens: 500,  // Limit token usage for cost and speed
        });

        // 4. Extract and send the explanation back to the Expo app
        const explanation = completion.choices[0].message.content.trim();
        res.status(200).json({ explanation });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ message: 'Failed to generate AI explanation.', error: error.message });
    }
});

module.exports = router;