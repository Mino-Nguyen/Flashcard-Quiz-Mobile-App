import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const CreateQuiz = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { quiz, index } = route.params || {};

  const [title, setTitle] = useState(quiz?.title || '');
  const [questions, setQuestions] = useState(quiz?.questions || [{ question: '', answer: '' }]);

  const handleChange = (i, field, value) => {
    const updated = [...questions];
    updated[i][field] = value;
    setQuestions(updated);
  };

  const addField = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a quiz title.');
      return;
    }

    const newQuiz = {
      id: quiz?.id || uuidv4(),
      title,
      questions,
    };

    try {
      const stored = await AsyncStorage.getItem('quizzes');
      const parsed = stored ? JSON.parse(stored) : [];

      if (typeof index === 'number') {
        parsed[index] = newQuiz; // Edit existing
      } else {
        parsed.push(newQuiz); // Add new
      }

      await AsyncStorage.setItem('quizzes', JSON.stringify(parsed));
      Alert.alert('Saved!', `Quiz "${title}" has been saved.`);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving quiz:', error);
      Alert.alert('Error', 'Failed to save quiz.');
    }
  };


  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        {typeof index === 'number' ? 'Edit Quiz' : 'Create New Quiz'}
      </Text>

      <TextInput
        placeholder="Quiz Title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 15,
          borderRadius: 5,
        }}
      />

      {questions.map((q, i) => (
        <View key={i} style={{ marginBottom: 15 }}>
          <TextInput
            placeholder="Question"
            value={q.question}
            onChangeText={(text) => handleChange(i, 'question', text)}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              marginBottom: 5,
              borderRadius: 5,
            }}
          />
          <TextInput
            placeholder="Answer"
            value={q.answer}
            onChangeText={(text) => handleChange(i, 'answer', text)}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              borderRadius: 5,
            }}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={addField}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add More</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 10 }}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>Save Quiz</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = {
  button: {
    backgroundColor: '#79bd9a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};
export default CreateQuiz;