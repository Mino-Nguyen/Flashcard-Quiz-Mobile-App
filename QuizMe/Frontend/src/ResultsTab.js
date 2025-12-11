//ResultTab.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ResultsTab = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFetchingReview, setIsFetchingReview] = useState(false);
    const navigation = useNavigation();


    const handleResultPress = async (attemptId) => {
        if (isFetchingReview) return;

        setIsFetchingReview(true);
        try {
            // Call the new backend route to get the full attempt details
            const url = `${API_BASE_URL}/api/attempts/${attemptId}/review`;
            const response = await axios.get(url);

            const reviewData = response.data;

            if (reviewData && reviewData.quiz && reviewData.answers) {
                // Navigate to the review screen with the fetched quiz and answers
                navigation.navigate('QuizReviewScreen', {
                    quiz: reviewData.quiz,
                    answers: reviewData.answers,
                });
            } else {
                Alert.alert('Error', 'Review data is incomplete.');
            }

        } catch (error) {
            console.error('Failed to fetch review data:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Could not load quiz review details.');
        } finally {
            setIsFetchingReview(false);
        }
    };

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

    if (loading || isFetchingReview) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#79bd9a" />
                <Text style={styles.statusText}>
                    {isFetchingReview ? 'Loading Review...' : 'Loading results...'}
                </Text>
            </View>
        );
    }

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
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                            const dateString = item.attemptedAt || item.createdAt;
                            let dateDisplay = 'N/A';
                            if (dateString) {
                                try {
                                    const dateObj = new Date(dateString);

                                    if (isNaN(dateObj.getTime())) {
                                        dateDisplay = dateString.slice(0, 10);
                                    } else {
                                        dateDisplay = dateObj.toLocaleString();
                                    }
                                } catch (e) {
                                    dateDisplay = dateString.slice(0, 10) || 'N/A';
                                }
                            }

                            return (
                                <TouchableOpacity
                                    style={styles.resultItem}
                                    onPress={() => handleResultPress(item._id)}
                                    disabled={isFetchingReview}
                                >
                                    <Text style={styles.quizTitle}>
                                        {item.quizId
                                            ? (item.quizId.title || item.quizId.category)
                                            : 'Deleted Quiz'}
                                        : <Text style={styles.resultPercentage}>{item.resultPercentage}%</Text>
                                    </Text>
                                    <Text style={styles.timestampText}>
                                        Attempted: {dateDisplay}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
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
        color: '#3b8686',
        fontWeight: '900',
    },
    timestampText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
});

export default ResultsTab;