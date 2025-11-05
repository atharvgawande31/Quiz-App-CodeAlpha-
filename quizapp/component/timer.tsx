import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

interface TimerProps {
  duration?: number;
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration = 30, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progressAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Reset time whenever duration changes
    setTimeLeft(duration);
    progressAnim.setValue(100);

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onComplete?.(); // ✅ Trigger when timer ends
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  // Animate the progress bar as time decreases
  useEffect(() => {
    const percentage = (timeLeft / duration) * 100;
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [timeLeft]);

  const animatedWidth = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
      }),
    [progressAnim] // Dependency array
  );

  return (
    <View style={styles.container}>
      {/* Progress animation */}
      <Animated.View style={[styles.progressBar, { width: animatedWidth }]}>
        <LinearGradient
          colors={["#ff4b8d", "#6a2c9b"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>

      {/* Timer text & icon */}
      <View style={styles.timerContent}>
        <Text style={styles.timeText}>{timeLeft}</Text>
        <FontAwesome
          style={styles.icon}
          name="clock-o"
          size={24}
          color="#d8e2ff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
    height: 40,
    backgroundColor: "#3a3f5a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
  timerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 1,
  },
  timeText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 6,
  },
});

export default Timer;
