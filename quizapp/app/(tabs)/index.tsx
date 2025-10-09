import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import Answers from "../components/answerComponent";
import { data } from "@/assets/images/data/dummyData";
import { useLocalSearchParams } from "expo-router";
import Timer from "../components/timer";
import NextButton from "../components/button";
import { Colors } from "@/constants/Colors";

export default function Component() {
  const { id } = useLocalSearchParams();

  const questions = data.questions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion =
    questions.find((q) => q.id === id) || questions[currentQuestionIndex];

  const [selected, setSelected] = useState(null);

  function handleSelection(index: any) {
    setSelected(index);
  }

  const handleNext = () => {
    // Move to the next question, but don't go past the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <Timer />
      <Text style={styles.text}>
        Question {currentQuestionIndex + 1}
        <Text style={styles.supportText}>/10</Text>{" "}
      </Text>
      <Text style={styles.separator}>
        --------------------------------------------------------
      </Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <View style={styles.answerContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              onPress={() => handleSelection(index)}
              key={index}
              style={[styles.answers, selected === index && styles.selected]}
            >
              <Text style={styles.text}>{option}</Text>
              {selected === index ? (
                <FontAwesome name="check-circle" size={28} color="#ffff" />
              ) : (
                <FontAwesome name="circle-o" size={28} color="#3d4f85ff" />
              )}
            </TouchableOpacity>
          ))}
      </View>

      <View
        style={{
          justifyContent: "center",
          alignSelf: "center",
          width: "50%",
          marginTop: 16,
        }}
      >
        {currentQuestionIndex === questions.length - 1 ? <NextButton   title="Check Score" /> : <NextButton  onPress={() => handleNext()} title="Next" /> }
        
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
    fontSize: 24,
    fontWeight: 700,
    color: Colors.textPrimary,
    opacity: 0.5,

  },
  supportText: {
    fontSize: 16,
    fontWeight: 400,
  },

  separator: {
    height: 1,
    backgroundColor: Colors.textPrimary,
    marginVertical: 12,
    opacity: 0.3,
    marginTop: 16,
  },
  question: {
    fontSize: 30,
    fontWeight: 700,
    color: Colors.textPrimary,
    marginTop: 16,
    height: 110,
    
  },
  answerContainer: {
    marginTop: 96,
    width: "100%",
    position: "fixed"
  },
  answers: {
    padding: 16,
    borderWidth: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    
    borderColor: "#3d4f85ff",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,

  },

  selected: {
    borderColor: "#2a8ff5ff",
    backgroundColor: "#2a8ff5ff",
  },
});
