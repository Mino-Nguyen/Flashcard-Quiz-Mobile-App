import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QuizList from './QuizList';
import Header from './Header';
import ResultsTab from './ResultsTab';
import { StyleSheet } from 'react-native';

const Tabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('quizzes');

  return (
    <View>
      <Header />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <TouchableOpacity style={[
          styles.tabButton,
          activeTab === 'quizzes' && styles.activeTab,
        ]}
          onPress={() => setActiveTab('quizzes')}>
          <Text style={{ fontWeight: activeTab === 'quizzes' ? 'bold' : 'normal' }}>Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[
          styles.tabButton,
          activeTab === 'results' && styles.activeTab,
        ]}
          onPress={() => setActiveTab('results')}>
          <Text style={{ fontWeight: activeTab === 'results' ? 'bold' : 'normal' }}>Results</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'quizzes' && <QuizList navigation={navigation} />}
      {activeTab === 'results' && <ResultsTab navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'lightyellow'
  },
  activeTab: {
    backgroundColor: '#79bd9a',
  }
});

export default Tabs;