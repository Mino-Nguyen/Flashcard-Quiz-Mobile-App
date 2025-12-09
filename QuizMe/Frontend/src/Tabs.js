// Tabs.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuizList from './QuizList';
import Header from './Header';
import ResultsTab from './ResultsTab';

const Tabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('quizzes');

  return (
    <View style={styles.mainContainer}> 
      <Header />
      
      <View style={styles.tabBar}>
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

      <View style={styles.contentArea}> 
        {activeTab === 'quizzes' && <QuizList navigation={navigation} />}
        {activeTab === 'results' && <ResultsTab navigation={navigation} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'lightyellow',
  },
  activeTab: {
    backgroundColor: '#79bd9a',
  },
  contentArea: {
    flex: 1, 
  }
});

export default Tabs;