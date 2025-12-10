// AnswerScreen.js
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator } from 'react-native';import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; 
import { API_BASE_URL } from '../config';

// Simple function to shuffle an array
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    let newArray = [...array];
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
};


const AnswerScreen = () => {
    const navigation = useNavigation();

    const { quiz } = useRoute().params;
    
    const [selectedAnswers, setSelectedAnswers] = useState(Array(quiz.questions.length).fill(null));
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const shuffledOptions = useMemo(() => {
        return quiz.questions.map(q => {
            const allOptions = [q.correctAnswer, ...q.incorrectAnswers];
            return shuffleArray(allOptions);
        });
    }, [quiz.questions]);

    const handleSelect = (qIndex, selectedValue) => {
        const updated = [...selectedAnswers];
        updated[qIndex] = selectedValue;
        setSelectedAnswers(updated);
    };

    const handleSubmit = async () => {
if (!quiz || !quiz._id) {
        Alert.alert('Error', 'Quiz information is incomplete. Cannot submit attempt.');
        return;
    }

        if (selectedAnswers.includes(null)) {
            Alert.alert('Incomplete Quiz', 'Please answer all questions before submitting.');
            return;
        }

        setIsSubmitting(true); // Start loading

        // CALCULATE SCORE & FORMAT DATA
        const total = quiz.questions.length;
        let correctCount = 0;
        
        const attemptAnswers = quiz.questions.map((q, i) => {
            const userAnswer = selectedAnswers[i];
            const isCorrect = userAnswer?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();
            
            if (isCorrect) {
                correctCount++;
            }

            return {
                questionNumber: q.questionNumber,
                questionString: q.questionString,
                userAnswer: userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect: isCorrect,
            };
        });

        const resultPercentage = Math.round((correctCount / total) * 100);

        const attemptPayload = {
            quizId: quiz._id, 
            resultPercentage: resultPercentage,
            answers: attemptAnswers,
        };
        
        // POST DATA TO BACKEND
        try {
            const url = `${API_BASE_URL}/api/attempts`;
            
            // The POST request sends the final formatted data
            const response = await axios.post(url, attemptPayload);
            
            console.log('Attempt saved with ID:', response.data._id); 

            // NAVIGATE TO REVIEW SCREEN
            navigation.navigate('QuizReviewScreen', {
                quiz,
                answers: selectedAnswers,
                correct: correctCount,
                total: total,
            });

        } catch (error) {
            console.error('Backend Submission Error:', error.response ? error.response.data : error.message);
            Alert.alert('Submission Error', 'Failed to save your quiz attempt to the server.');
        } finally {
            setIsSubmitting(false); 
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>
                Answer Quiz: {quiz.category}
            </Text>

            {quiz.questions.map((q, i) => {
                const options = shuffledOptions[i];
                const selected = selectedAnswers[i];
                
                return (
                    <View key={i} style={styles.questionBlock}>
                        <Text style={styles.questionText}>{i + 1}. {q.questionString}</Text>
                        
                        {options.map((option, j) => (
                            <TouchableOpacity
                                key={j}
                                onPress={() => handleSelect(i, option)}
                                style={[
                                    styles.optionButton,
                                    selected === option && styles.optionSelected,
                                ]}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}
            
            <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                disabled={isSubmitting} // Disable button while submitting
            >
                {isSubmitting ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.submitButtonText}>
                        Submit Answers
                    </Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    questionBlock: {
        marginBottom: 25,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    optionButton: {
        padding: 12,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    optionSelected: {
        backgroundColor: '#79bd9a', 
        borderColor: '#5c8f74',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#79bd9a',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50,
    },
    submitButtonDisabled: { 
        backgroundColor: '#a8a8a8', 
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AnswerScreen;