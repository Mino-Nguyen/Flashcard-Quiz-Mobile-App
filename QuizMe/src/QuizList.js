import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const QuizList = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);

  const loadQuizzes = async () => {
    try {
      const stored = await AsyncStorage.getItem('quizzes');
      if (stored) setQuizzes(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    }
  };

  const deleteQuiz = async (idToDelete) => {
    try {
      const updated = quizzes.filter((quiz) => quiz.id !== idToDelete);
      await AsyncStorage.setItem('quizzes', JSON.stringify(updated));
      setQuizzes(updated);
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadQuizzes();
    }, [])
  );


  const renderItem = ({ item, index }) => (
    <View style={styles.quizItem}>
      {/* Title opens FlashcardScreen */}
      <TouchableOpacity onPress={() => navigation.navigate('FlashcardScreen', { quiz: item })}>
        <Text style={styles.quizTitle}>{item.title}</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        {/* Edit button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateQuiz', { quiz: item, index })}
          style={styles.editButton}
        >
          <Text style={{ color: 'white' }}>Edit</Text>
        </TouchableOpacity>

        {/* Delete button */}
        <TouchableOpacity
          onPress={() => deleteQuiz(item.id)}
          style={styles.deleteButton}
        >
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateQuiz')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Create Quiz</Text>
      </TouchableOpacity>

      <FlatList
        data={quizzes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },

  editButton: {
    backgroundColor: '#3b8686',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  quizItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#3b8686',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'lightcoral',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  createButton: {
    backgroundColor: '#79bd9a',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default QuizList;