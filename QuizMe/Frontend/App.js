import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './src/Tabs';
import CreateQuiz from './src/CreateQuiz';
import './App.css';
import FlashcardScreen from './src/FlashcardScreen';
import AnswerScreen from './src/AnswerScreen';
import QuizReviewScreen from './src/QuizReviewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="CreateQuiz" component={CreateQuiz} options={{ title: 'Create New Quiz' }} />
        <Stack.Screen name="FlashcardScreen" component={FlashcardScreen} />
        <Stack.Screen name="AnswerScreen" component={AnswerScreen} />
        <Stack.Screen name="QuizReviewScreen" component={QuizReviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}