import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { data } from "@/assets/images/data/dummyData";
import { useLocalSearchParams } from "expo-router";
import Timer from "../components/timer";
import NextButton from "../components/button";
import { Colors } from "@/constants/Colors";

export default function Component() {
  const { id } = useLocalSearchParams();
  const questions = data.questions;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const currentQuestion =
    questions.find((q) => q.id === id) || questions[currentQuestionIndex];

  function handleSelection(index: number) {
    // Only allow one selection
    if (selected === null) {
      setSelected(index);
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(null); // reset selection for next question
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Timer key={currentQuestionIndex} />

      <Text style={styles.secText}>
        Question {currentQuestionIndex + 1}
        <Text style={styles.supportText}> / 10</Text>
      </Text>

      <Text style={styles.separator}>
        --------------------------------------------------------
      </Text>

      <Text style={styles.question}>{currentQuestion.question}</Text>

      <View style={styles.answerContainer}>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = option === currentQuestion.correctAnswer;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = isSelected && !isCorrect;

          return (
            <TouchableOpacity
              onPress={() => handleSelection(index)}
              key={index}
              style={[
                styles.answers,
                isSelected && styles.selected,
                showCorrect && styles.correct,
                showWrong && styles.wrong,
              ]}
              disabled={selected !== null} // disable after selection
            >
              <Text style={styles.text}>{option}</Text>

              {showCorrect ? (
                <FontAwesome name="check-circle" size={28} color="white" />
              ) : showWrong ? (
                <FontAwesome name="times-circle" size={28} color="white" />
              ) : (
                <FontAwesome name="circle-o" size={28} color="#3d4f85ff" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          justifyContent: "center",
          alignSelf: "center",
          width: "50%",
          marginTop: 16,
        }}
      >
        {currentQuestionIndex === questions.length - 1 ? (
          <NextButton title="Check Score" />
        ) : (
          <NextButton onPress={handleNext} title="Next" />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 24,
    backgroundColor: Colors.primaryDark,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  supportText: {
    fontSize: 16,
    fontWeight: "400",
  },
  secText: {
    opacity: 0.5,
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.textPrimary,
    marginVertical: 12,
    opacity: 0.3,
    marginTop: 16,
  },
  question: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 16,
    height: 110,
  },
  answerContainer: {
    marginTop: 64,
    width: "100%",
  },
  answers: {
    padding: 16,
    borderWidth: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#3d4f85ff",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,
  },
  selected: {
    borderColor: "#2a8ff5ff",
  },
  correct: {
    backgroundColor: "#18a226ff",
    borderColor: "#18a226ff",
  },
  wrong: {
    backgroundColor: "#ff4d4d",
    borderColor: "#ff4d4d",
  },
});
