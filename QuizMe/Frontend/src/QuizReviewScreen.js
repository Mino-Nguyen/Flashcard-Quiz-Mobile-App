// QuizReviewScreen.js
import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const QuizReviewScreen = ({ route }) => {
    const { quiz, answers } = route.params;
    const navigation = useNavigation();

    // State for AI
    const [explanations, setExplanations] = useState({});
    const [loadingIndex, setLoadingIndex] = useState(null);

    // Prevent user from going back to the AnswerScreen mid-review 
    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                navigation.navigate('Main');
            });
            return unsubscribe;
        }, [navigation])
    );

    // Fetch AI explaination
    const fetchExplanation = async (question, index) => {
        // Prevent re-fetch if loading or already loaded (toggle behavior)
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
        const userAnswer = answers[index];

        const payload = {
            questionText: question.questionString,
            correctAnswer: question.correctAnswer,
            userAnswer: userAnswer,
            options: [question.correctAnswer, ...(question.incorrectAnswers || [])]
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/api/ai/explain`, payload);

            setExplanations(prev => ({
                ...prev,
                [index]: response.data.explanation,
            }));

        } catch (error) {
            console.error("AI Explanation Error:", error.response?.data || error.message);
            setExplanations(prev => ({
                ...prev,
                [index]: "Failed to load explanation. Check your network connection or server.",
            }));
        } finally {
            setLoadingIndex(null);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Review: {quiz.title}</Text>

            {quiz.questions.map((q, i) => {
                const userAnswer = answers[i]?.trim().toLowerCase();
                const correctAnswer = q.correctAnswer?.trim().toLowerCase();
                const isCorrect = userAnswer === correctAnswer;
                const isCurrentlyLoading = loadingIndex === i;
                const hasExplanation = !!explanations[i];

                return (
                    <View key={i} style={styles.card}>
                        <Text style={styles.question}>Q{i + 1}: {q.questionString}</Text>

                        <Text style={styles.answer}>
                            Your answer: <Text style={{ fontWeight: 'bold', color: isCorrect ? 'darkgreen' : 'darkred' }}>{answers[i]}</Text>
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