import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';// Using Feather icons

const DURATION = 30; // The total time for the countdown

const Timer = ({ onComplete  } : any) => {
  const [timeLeft, setTimeLeft] = useState(DURATION);
  // Use useRef for the animation value to prevent re-renders
  const progressAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Start the interval when the component mounts
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          if (onComplete) {
            onComplete(); // Callback when time is up
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup: clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    // Animate the progress bar width whenever timeLeft changes
    const percentage = (timeLeft / DURATION) * 100;
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 500, // A short duration for a smooth update
      useNativeDriver: false, // 'width' is not supported by native driver
    }).start();
  }, [timeLeft, progressAnim]);

  // Interpolate the Animated.Value to a width string (e.g., '100%')
  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.progressBar, { width: animatedWidth }]}>
        <LinearGradient
          colors={['#ff4b8d', '#6a2c9b']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8}}>
         <Text style={styles.timeText}>{timeLeft}</Text>
            <FontAwesome style={{position: "absolute", left: 140}} name="clock-o" size={28} color="#d8e2ffff" />

      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 36,
    height: 40,
    backgroundColor: '#3a3f5a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: "relative"
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
  timeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    zIndex: 1, // Ensure text is above the progress bar
  },
  icon: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
});

export default Timer;