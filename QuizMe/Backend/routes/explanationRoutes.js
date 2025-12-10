// routes/explanationRoutes.js
const express = require('express');
const OpenAI = require('openai'); // Import the OpenAI library

const router = express.Router();

// Initialize the OpenAI client using the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// POST route to generate an explanation
router.post('/explain', async (req, res) => {
    // Get data from the Expo app's request body
    const { questionText, options, correctAnswer, userAnswer } = req.body;

    if (!questionText || !correctAnswer || !userAnswer) {
        return res.status(400).json({ message: "Missing question details: questionText, correctAnswer, or userAnswer." });
    }

    // Construct the prompt using the Chat Completion format
    const prompt = `
        You are an expert tutor. Please provide a brief, helpful, and encouraging explanation 
        for the following quiz result. Explain why the correct answer is right and why the 
        user's answer was wrong.

        Question: "${questionText}"
        User's Answer: "${userAnswer}"
        Correct Answer: "${correctAnswer}"

        Structure your response to first explain why the correct answer is right, and then briefly state why the other options are incorrect.
    `;

    try {
        // Call the OpenAI Chat Completions API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful and detailed quiz explanation expert." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        // Extract and send the explanation back to the Expo app
        const explanation = completion.choices[0].message.content.trim();
        res.status(200).json({ explanation });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ message: 'Failed to generate AI explanation.', error: error.message });
    }
});

module.exports = router;