import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const FlashcardScreen = ({ route, navigation }) => {
    const { quiz } = route.params;
    const [revealed, setRevealed] = useState({}); // Track which cards are revealed

    const toggleReveal = (index) => {
        setRevealed((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{quiz.title}</Text>

            {quiz.questions.map((q, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => toggleReveal(index)}
                    style={[
                        styles.card,
                        revealed[index] && styles.revealedCard,
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.cardText}>
                        {revealed[index] ? q.answer : q.question}
                    </Text>
                </TouchableOpacity>
            ))}

            <View style={styles.controls}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#79bd9a',
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginVertical: 10,
                    }}
                    onPress={() => navigation.navigate('AnswerScreen', { quiz })}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
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
});

export default FlashcardScreen;