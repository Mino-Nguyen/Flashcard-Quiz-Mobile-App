//ResultTab.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ResultsTab = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadResults = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${API_BASE_URL}/api/attempts`;
            const response = await axios.get(url);

            setResults(response.data);

        } catch (error) {
            console.error('Failed to load results from backend:', error.message);
            setError('Could not fetch results. Is the backend running?');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadResults();
        }, [loadResults])
    );

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.headerText}>All Quiz Results</Text>

            {loading && (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#79bd9a" />
                    <Text style={styles.statusText}>Loading results...</Text>
                </View>
            )}

            {error && <Text style={styles.statusText}>{error}</Text>}

            {!loading && !error && (
                results.length === 0 ? (
                    <Text style={styles.statusText}>No results yet. Go take a quiz!</Text>
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item._id} // Key by the MongoDB ID
                        renderItem={({ item }) => (
                            <View style={styles.resultItem}>
                                <Text style={styles.quizTitle}>
                                    {/* Accessing the populated Quiz title and the stored percentage */}
                                    {item.quizId.title}: <Text style={styles.resultPercentage}>{item.resultPercentage}%</Text>
                                </Text>
                                <Text style={styles.timestampText}>
                                    Attempted: {new Date(item.attemptedAt).toLocaleString()}
                                </Text>
                            </View>
                        )}
                        style={styles.flatList}
                        contentContainerStyle={styles.listContent}
                    />
                )
            )}
        </View>
    );
};

// ResultsTab.js (Add these styles)

const styles = StyleSheet.create({
    mainContainer: { 
        flex: 1, 
        backgroundColor: '#f0f0f0', 
    },
    headerText: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        paddingHorizontal: 20, 
        paddingTop: 10 
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        paddingHorizontal: 20,
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    flatList: { 
        flex: 1 
    },
    listContent: { 
        paddingHorizontal: 20, 
        paddingBottom: 20 
    },
    resultItem: { 
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    quizTitle: { 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    resultPercentage: {
        color: '#3b8686', // Accent color
        fontWeight: '900',
    },
    timestampText: { 
        fontSize: 12, 
        color: '#999', 
        marginTop: 4 
    },
});

export default ResultsTab;