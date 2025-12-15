// 📱 frontend/src/components/shared/Loading.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = ({ message = 'جاري التحميل...' }) => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/loading-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" color="#2196F3" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  animation: {
    width: 150,
    height: 150,
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    marginBottom: 20,
  },
  spinner: {
    marginTop: 10,
  },
});

export default Loading;
