// CreateQuiz.js
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CreateQuiz = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { quiz, index } = route.params || {};

    const [title, setTitle] = useState(quiz?.title || '');
    const initialQuestions = quiz?.questions.map((q, i) => ({
        questionString: q.questionString || q.question || '',
        correctAnswer: q.correctAnswer || q.answer || '',
        incorrectAnswers: q.incorrectAnswers || ['', ''],
        questionNumber: i + 1,
    })) || [{ questionString: '', correctAnswer: '', incorrectAnswers: ['', ''], questionNumber: 1 }];

    const [questions, setQuestions] = useState(initialQuestions);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleChange = (i, field, value, arrIndex = null) => {
        const updated = [...questions];

        if (field === 'incorrectAnswers' && arrIndex !== null) {
            updated[i].incorrectAnswers[arrIndex] = value;
        } else {
            updated[i][field] = value;
        }
        setQuestions(updated);
    };

    const addField = () => {
        const newQ = { questionString: '', correctAnswer: '', incorrectAnswers: ['', ''], questionNumber: questions.length + 1 };
        setQuestions([...questions, newQ]);
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a quiz title.');
            return;
        }

        const isValid = questions.every(q =>
            q.questionString.trim() &&
            q.correctAnswer.trim() &&
            q.incorrectAnswers[0].trim() &&
            q.incorrectAnswers[1].trim()
        );

        if (!isValid) {
            Alert.alert('Incomplete Questions', 'Please fill in all fields for all questions.');
            return;
        }

        setIsSubmitting(true); // Start loading

        // Prepare the data payload for MongoDB 
        const quizPayload = {
            title: title.trim(),
            questions: questions.map(q => ({
                questionNumber: q.questionNumber,
                questionString: q.questionString.trim(),
                correctAnswer: q.correctAnswer.trim(),
                incorrectAnswers: q.incorrectAnswers.filter(a => a.trim()),
            })),
        };

        try {
            const url = `${API_BASE_URL}/api/quizzes`;

            if (quiz?._id) {
                await axios.patch(`${url}/${quiz._id}`, quizPayload);
                Alert.alert('Updated!', `Quiz "${title}" has been successfully updated.`);

            } else {
                await axios.post(url, quizPayload);
                Alert.alert('Saved!', `Quiz "${title}" has been saved.`);
            }

            navigation.goBack();

        } catch (error) {
            console.error('Error saving/updating quiz:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to save or update quiz on the server.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>
                    {typeof index === 'number' ? 'Edit Quiz' : 'Create New Quiz'}
                </Text>

                <Text style={styles.label}>Quiz Title</Text>
                <TextInput
                    placeholder="e.g., General Knowledge 101"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />

                {questions.map((q, i) => (
                    <View key={i} style={styles.questionBlock}>
                        <Text style={styles.questionLabel}>Question {i + 1}</Text>

                        <Text style={styles.label}>Question Text</Text>
                        <TextInput
                            placeholder="What is the capital of Vietnam?"
                            value={q.questionString}
                            onChangeText={(text) => handleChange(i, 'questionString', text)}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Correct Answer</Text>
                        <TextInput
                            placeholder="Hanoi"
                            value={q.correctAnswer}
                            onChangeText={(text) => handleChange(i, 'correctAnswer', text)}
                            style={[styles.input, styles.correctInput]}
                        />

                        <Text style={styles.label}>Incorrect Answer 1</Text>
                        <TextInput
                            placeholder="Ho Chi Minh City"
                            value={q.incorrectAnswers[0]}
                            onChangeText={(text) => handleChange(i, 'incorrectAnswers', text, 0)}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Incorrect Answer 2</Text>
                        <TextInput
                            placeholder="Da Nang City"
                            value={q.incorrectAnswers[1]}
                            onChangeText={(text) => handleChange(i, 'incorrectAnswers', text, 1)}
                            style={styles.input}
                        />
                    </View>
                ))}

                <TouchableOpacity onPress={addField} style={[styles.button, styles.addMoreButton]}>
                    <Text style={styles.buttonText}>+ Add Another Question</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Save Quiz</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    label: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
        marginBottom: 4,
    },
    questionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    correctInput: {
        backgroundColor: '#e6ffe6',
    },
    questionBlock: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    button: {
        backgroundColor: '#79bd9a',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    addMoreButton: {
        backgroundColor: '#5bc0de',
    },
    buttonDisabled: {
        backgroundColor: '#a8a8a8',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateQuiz;