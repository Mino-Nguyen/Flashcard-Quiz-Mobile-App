// Header.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

const Header = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.row}>
          <Image source={require('./assets/logo.png')} style={styles.logo} /> 
          <Text style={styles.title}>QUIZ APP</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#79bd9a', 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerContent: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'lightyellow',
  },
});

export default Header;