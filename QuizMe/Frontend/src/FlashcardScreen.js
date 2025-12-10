// FlashcardScreen.js
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FlashcardScreen = ({ route, navigation }) => {
    const { quiz } = route.params;
    const initialShuffledQuestions = useMemo(() => shuffleArray(quiz.questions), [quiz.questions]);

    const [shuffledQuestions, setShuffledQuestions] = useState(initialShuffledQuestions);
    const [revealed, setRevealed] = useState({});

    const toggleReveal = (index) => {
        setRevealed((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    
    // Shuffle the cards again
    const handleShuffle = useCallback(() => {
        setShuffledQuestions(shuffleArray(quiz.questions));
        setRevealed({}); 
    }, [quiz.questions]);

    // Reset all cards to non-revealed state
    const handleReset = useCallback(() => {
        setRevealed({});
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{quiz.title}</Text>

            {shuffledQuestions.map((q, index) => (
                <TouchableOpacity
                    key={q.questionString + index}
                    onPress={() => toggleReveal(index)}
                    style={[
                        styles.card,
                        revealed[index] && styles.revealedCard,
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cardText}>
                        {revealed[index] ? q.correctAnswer : q.questionString} 
                    </Text>
                </TouchableOpacity>
            ))}

            <View style={styles.controls}>
                
                <TouchableOpacity
                    style={[styles.controlButton, styles.shuffleButton]}
                    onPress={handleShuffle}
                >
                    <Text style={styles.controlButtonText}>Shuffle Cards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, styles.resetButton]}
                    onPress={handleReset}
                >
                    <Text style={styles.controlButtonText}>Reset View</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.answerQuizButton} 
                    onPress={() => navigation.navigate('AnswerScreen', { quiz })}
                >
                    <Text style={styles.answerQuizButtonText}>
                        Answer This Quiz
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#a8dba8',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 30,
        borderRadius: 12,
        marginVertical: 10,
        width: '100%',
        elevation: 3,
        minHeight: 150, 
        justifyContent: 'center',
    },
    revealedCard: {
        backgroundColor: '#dcedc1',
    },
    cardText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    controls: {
        marginTop: 30,
        width: '100%',
    },
controls: {
        marginTop: 30,
        width: '100%',
    },
    controlButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
        borderWidth: 1,
    },
    shuffleButton: {
        backgroundColor: '#3b8686', 
        borderColor: '#3b8686',
    },
    resetButton: {
        backgroundColor: '#f5f5f5', 
        borderColor: '#3b8686',
    },
    controlButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    answerQuizButton: {
        backgroundColor: '#79bd9a',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    answerQuizButtonText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    }
});

export default FlashcardScreen;