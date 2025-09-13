import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const AnswerScreen = () => {
    const navigation = useNavigation();
    const { quiz } = useRoute().params;
    const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(''));

    const handleChange = (i, value) => {
        const updated = [...answers];
        updated[i] = value;
        setAnswers(updated);
    };

    const handleSubmit = async () => {
        const correctCount = answers.reduce((acc, answer, i) => {
            const correctAnswer = quiz.questions[i].answer?.trim().toLowerCase();
            const userAnswer = answer?.trim().toLowerCase();
            return acc + (userAnswer === correctAnswer ? 1 : 0);
        }, 0);

        const result = {
            quizId: quiz.id,
            quizTitle: quiz.title,
            answers,
            correct: correctCount,
            total: quiz.questions.length,
            timestamp: new Date().toISOString(),
        };

        try {
            const stored = await AsyncStorage.getItem('results');
            const parsed = stored ? JSON.parse(stored) : [];
            parsed.push(result);
            await AsyncStorage.setItem('results', JSON.stringify(parsed));

            navigation.navigate('QuizReviewScreen', {
                quiz,
                answers,
                correct: correctCount,
                total: quiz.questions.length,
            });

        } catch (error) {
            console.error('Error saving result:', error);
            Alert.alert('Error', 'Failed to save your answers.');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Answer Quiz: {quiz.title}
            </Text>

            {quiz.questions.map((q, i) => (
                <View key={i} style={{ marginBottom: 15 }}>
                    <Text style={{ fontWeight: 'bold' }}>{q.question}</Text>
                    <TextInput
                        placeholder="Your answer"
                        value={answers[i]}
                        onChangeText={(text) => handleChange(i, text)}
                        style={{
                            borderWidth: 1,
                            borderColor: '#ccc',
                            padding: 10,
                            borderRadius: 5,
                            marginTop: 5,
                        }}
                    />
                </View>
            ))}

            <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    backgroundColor: '#79bd9a',
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 20,
                }}
            >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Submit Answers
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default AnswerScreen;