// QuizList.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; 
import { API_BASE_URL } from '../config'; 

const QuizList = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);   

  // Use useCallback
  const loadQuizzes = useCallback(async () => {
    setLoading(true); 
    setError(null);   
    
    try {
      const url = `${API_BASE_URL}/api/quizzes`;
      
      const response = await axios.get(url);
      
      setQuizzes(response.data);
      
    } catch (err) {
      console.error('Failed to load quizzes from backend:', err);
      setError('Could not connect to server or load quizzes. Is the backend running?');
      setQuizzes([]); 
    } finally {
      setLoading(false); 
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [loadQuizzes])
  );
  
  const deleteQuiz = (idToDelete) => {
    Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this quiz permanently?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const url = `${API_BASE_URL}/api/quizzes/${idToDelete}`;
                        await axios.delete(url);
                        setQuizzes(prevQuizzes => 
                            prevQuizzes.filter(quiz => (quiz._id || quiz.id) !== idToDelete)
                        );
                        
                        Alert.alert("Deleted", "Quiz successfully deleted.");

                    } catch (error) {
                        console.error('Failed to delete quiz:', error.response ? error.response.data : error.message);
                        Alert.alert('Error', 'Failed to delete quiz on the server.');
                        
                        loadQuizzes(); 
                    }
                }
            }
        ]
    );
};

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#79bd9a" />
        <Text style={{ marginTop: 10 }}>Loading Quizzes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadQuizzes}>
             <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.quizItem}>
      <TouchableOpacity onPress={() => navigation.navigate('FlashcardScreen', { quiz: item })}>
        <Text style={styles.quizTitle}>{item.title}</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateQuiz', { quiz: item, index })}
          style={styles.editButton}
        >
          <Text style={{ color: 'white' }}>Edit</Text>
        </TouchableOpacity>

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
    <View style={styles.mainContainer}> 
      
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateQuiz')}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Create Quiz</Text>
      </TouchableOpacity>

      {quizzes.length === 0 ? (
        <Text style={styles.noQuizzesText}>No quizzes found. Create one above!</Text>
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item._id} 
          renderItem={renderItem}
          style={{ flex: 1 }} 
          contentContainerStyle={styles.listContainer} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    paddingHorizontal: 20, 
  },
  listContainer: {
    paddingBottom: 20, 
  },
  centerContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b8686',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#3b8686',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizTitle: {
    fontSize: 18,
    maxWidth: '70%', 
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
    marginHorizontal:20,
  },
  createButtonText: {
    color: 'white', 
    fontWeight: 'bold'
  },
  noQuizzesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#666',
    marginHorizontal: 20,
  }
});

export default QuizList;