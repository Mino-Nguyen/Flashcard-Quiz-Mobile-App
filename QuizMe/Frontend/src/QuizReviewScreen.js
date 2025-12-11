// QuizReviewScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const normalizeString = (str) => {
    if (!str) return '';
    return String(str)
        .trim()
        .toLowerCase()
        .normalize('NFD') // Normalizes Unicode characters
        .replace(/[\u0300-\u036f]/g, "") // Removes diacritics (accents)
        .replace(/[^a-z0-9\s]/g, '') // Optionally remove punctuation (if you want "c++" to match "c plus plus")
        .replace(/\s+/g, ' '); // Consolidate multiple spaces
};

const QuizReviewScreen = ({ route }) => {
    const { quiz, answers } = route.params;
    const navigation = useNavigation();

    // State for AI
    const [explanations, setExplanations] = useState({});
    const [loadingIndex, setLoadingIndex] = useState(null);

    // Prevent user from going back to the AnswerScreen mid-review 
    React.useLayoutEffect(() => {
        // Disables the swipe gesture and the native back button
        navigation.setOptions({
            gestureEnabled: false,
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Main')}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    // Fetch AI explaination
    const fetchExplanation = async (question, index) => {
        if (loadingIndex === index) return;

        //If explanation is already visible, hide it.
        if (explanations[index]) {
            setExplanations(prev => {
                const newExplanations = { ...prev };
                delete newExplanations[index];
                return newExplanations;
            });
            return;
        }

        setLoadingIndex(index);
        const userAnswerObject = answers[index];
        const userAnswerString = userAnswerObject?.userAnswer || "No Answer Selected";

        const payload = {
            questionText: question.questionString,
            correctAnswer: question.correctAnswer,
            userAnswer: userAnswerString,
            options: [question.correctAnswer, ...(question.incorrectAnswers || [])]
        };

        try {
            const url = `${API_BASE_URL}/api/ai/explain`;

            const response = await axios.post(url, payload);

            const explanationText = response.data.explanation;

            setExplanations(prev => ({
                ...prev,
                [index]: explanationText || 'Failed to generate an explanation.',
            }));
        } catch (error) {
            console.error('API Call Failed:', error.response?.data || error.message);
            Alert.alert('AI Error', 'Failed to fetch explanation from the server. Please check console for details.');
        } finally {
            setLoadingIndex(null);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Review: {quiz.category}</Text>

            {quiz.questions.map((q, i) => {
                let rawUserAnswer = null;
                const answerItem = answers[i];

                if (answerItem) {
                    if (typeof answerItem === 'object' && answerItem.userAnswer) {
                        rawUserAnswer = answerItem.userAnswer;
                    }
                    else if (typeof answerItem === 'string') {
                        rawUserAnswer = answerItem;
                    }
                }

                const userAnswer = normalizeString(rawUserAnswer);

                const rawCorrectAnswer = q.correctAnswer;
                const correctAnswer = normalizeString(rawCorrectAnswer);

                const isCorrect = userAnswer === correctAnswer;
                const isCurrentlyLoading = loadingIndex === i;
                const hasExplanation = !!explanations[i];

                return (
                    <View key={i} style={styles.card}>
                        <Text style={styles.question}>Q{i + 1}: {q.questionString}</Text>

                        <Text style={styles.answer}>
                            Your answer: <Text style={{ fontWeight: 'bold', color: isCorrect ? 'darkgreen' : 'darkred' }}>
                                {rawUserAnswer || 'No Answer Selected'}</Text>
                        </Text>

                        <Text style={styles.answer}>
                            Correct answer: <Text style={{ fontWeight: 'bold' }}>{q.correctAnswer}</Text>
                        </Text>

                        <Text style={{ color: isCorrect ? 'green' : 'red', marginTop: 10, fontWeight: 'bold' }}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => fetchExplanation(q, i)}
                            style={[
                                styles.aiButton,
                                isCurrentlyLoading && styles.aiButtonDisabled,
                            ]}
                            disabled={isCurrentlyLoading}
                        >
                            {isCurrentlyLoading ? (
                                <ActivityIndicator color="#000000" size="small" />
                            ) : (
                                <Text style={styles.aiButtonText}>
                                    {hasExplanation ? 'Hide Explanation' : 'Get AI Explanation'}
                                </Text>
                            )}
                        </TouchableOpacity>
                        {hasExplanation && (
                            <View style={styles.explanationBox}>
                                <Text style={styles.explanationText}>
                                    {explanations[i]}
                                </Text>
                            </View>
                        )}
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#a8dba8',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    answer: {
        fontSize: 15,
        marginTop: 5,
    },
    aiButton: {
        backgroundColor: '#FFFFFF', // White background
        padding: 10,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#000000'
    },
    aiButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 15,
    },
    explanationBox: {
        backgroundColor: '#F0F8FF',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#4B0082',
    },
    explanationText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    aiButtonDisabled: {
        backgroundColor: '#EEEEEE', // Light gray background when disabled
        opacity: 0.6,
        borderColor: '#AAAAAA',
    },
});

export default QuizReviewScreen;