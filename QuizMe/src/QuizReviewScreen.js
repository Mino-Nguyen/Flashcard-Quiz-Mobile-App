import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const QuizReviewScreen = ({ route }) => {
  const { quiz, answers } = route.params;
const navigation = useNavigation();

useFocusEffect(
  React.useCallback(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      navigation.navigate('Main'); 
    });

    return unsubscribe;
  }, [navigation])
);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review: {quiz.title}</Text>

      {quiz.questions.map((q, i) => {
        const userAnswer = answers[i]?.trim().toLowerCase();
        const correctAnswer = q.answer?.trim().toLowerCase();
        const isCorrect = userAnswer === correctAnswer;

        return (
          <View key={i} style={styles.card}>
            <Text style={styles.question}>Q{i + 1}: {q.question}</Text>
            <Text style={styles.answer}>
              Your answer: <Text style={{ fontWeight: 'bold' }}>{answers[i]}</Text>
            </Text>
            <Text style={styles.answer}>
              Correct answer: <Text style={{ fontWeight: 'bold' }}>{q.answer}</Text>
            </Text>
            <Text style={{ color: isCorrect ? 'green' : 'red', marginTop: 5 }}>
              {isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </Text>
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
});

export default QuizReviewScreen;