import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultsTab = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const loadResults = async () => {
  try {
    const stored = await AsyncStorage.getItem('results');
    const parsed = stored ? JSON.parse(stored) : [];

    const filtered = parsed.filter(
      item =>
        typeof item.correct === 'number' &&
        typeof item.total === 'number' &&
        item.correct <= item.total &&
        item.quizTitle
    );

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setResults(filtered);
  } catch (error) {
    console.error('Failed to load results:', error);
  }
};

        loadResults();
    }, []);

    return (
        <View style={{ padding: 20, backgroundColor: 'lightyellow' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
                All Quiz Results
            </Text>

            {results.length === 0 ? (
                <Text>No results yet.</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 15 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                {item.quizTitle}: {item.correct}/{item.total}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#666' }}>
                                {new Date(item.timestamp).toLocaleString()}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default ResultsTab;