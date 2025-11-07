import { Colors } from "@/constants/Colors";
import { useScore } from "@/hooks/score";
import { supabase } from "@/lib/supabse";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react"; // 1. Import useState
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { SafeAreaView } from "react-native-safe-area-context";

const QUESTIONS_SOLVED_KEY = "@total_questions_solved";
const QUESTIONS_PER_QUIZ = 10;


type NextButtonProps = {
  onPress: () => void;
  title: string;
  secondary?: boolean;
};

const NextButton: React.FC<NextButtonProps> = ({
  onPress,
  title,
  secondary = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      secondary ? styles.secondaryButton : styles.primaryButton,
    ]}
  >
    <Text style={[styles.buttonText, secondary && styles.secondaryButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function FinalScorePage() {
  const router = useRouter();
  const { score } = useScore();
  const { category } = useLocalSearchParams();

  const [showScore, setShowScore] = useState(false);

  // Track total questions solved when quiz is completed
  useEffect(() => {
    const updateQuestionsSolved = async () => {
      try {
        const currentValue = await AsyncStorage.getItem(QUESTIONS_SOLVED_KEY);
        const currentTotal = currentValue ? parseInt(currentValue, 10) : 0;
        const newTotal = currentTotal + QUESTIONS_PER_QUIZ;
        await AsyncStorage.setItem(QUESTIONS_SOLVED_KEY, newTotal.toString());
      } catch (error) {
        console.error("Error updating questions solved:", error);
      }
    };

    updateQuestionsSolved();
  }, []);

  const handleRestart = () => {
    router.push(`/quiz?category=${category}`);
  };

  const handleGoHome = () => {
    router.push("/home");
  };

  const handleLogOut = () => {
    supabase.auth.signOut();
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      {!showScore && (
        <ConfettiCannon
          count={150} 
          origin={{ x: 0.5, y: -0.1 }} 
          autoStart={true}
          fadeOut={true}
          onAnimationEnd={() => setShowScore(true)}
          explosionSpeed={400} 
          fallSpeed={3000} 
          gravity={0.4} 
          angle={90} 
          spread={70} 
          colors={["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]} 
        />
      )}

      {showScore && (
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Quiz Complete!</Text>

          <FontAwesome name="trophy" size={150} color={Colors.accent} />

          <Text style={styles.scoreLabel}>Your Final Score</Text>

          <Text style={styles.scoreText}>{score}</Text>

          <View style={styles.buttonContainer}>
            <NextButton onPress={handleRestart} title="Play Again" />
            <NextButton
              onPress={handleGoHome}
              title="Categories"
              secondary={true}
            />
            <NextButton onPress={handleLogOut} title="Log Out"/>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// 7. Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  // New container for the content
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textLight,
    marginBottom: 40,
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: 24,
    color: Colors.textLight,
    opacity: 0.7,
    marginTop: 40,
  },
  scoreText: {
    fontSize: 72,
    fontWeight: "bold",
    color: Colors.accent, // Will now use the vivid #FFD700
    marginBottom: 50,
  },
  buttonContainer: {
    width: "80%",
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: Colors.accent,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
  },
});