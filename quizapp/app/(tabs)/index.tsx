import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import Answers from "../components/answerComponent";
import { data } from "@/assets/data/dummyData";
import { useLocalSearchParams } from "expo-router";
import Timer from "../components/timer";

export default function Component() {
  const { id } = useLocalSearchParams();

  const questions = data.questions;
  const currentQuestion = questions.find((q) => q.id === id) || questions[1];

  return (
    <SafeAreaView style={StyleSheets.container}>
      <Timer />
      <Text style={StyleSheets.text}>
        Question 1 <Text style={StyleSheets.supportText}>/10</Text>{" "}
      </Text>
      <Text style={StyleSheets.separator}>
        --------------------------------------------------------
      </Text>
      <Text style={StyleSheets.question}>{currentQuestion.question}</Text>
      <View style={StyleSheets.answerContainer}>
        <Answers />
      </View>
    </SafeAreaView>
  );
}

const StyleSheets = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 24,
    backgroundColor: "#22283fff",
  },
  text: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    opacity: 0.5,
    marginTop: 48,
  },
  supportText: {
    fontSize: 16,
    fontWeight: 400,
  },

  separator: {
    height: 1,
    backgroundColor: "#ffffff",
    marginVertical: 12,
    opacity: 0.3,
    marginTop: 16,
  },
  question: {
    fontSize: 30,
    fontWeight: 700,
    color: "#ffffff",
    marginTop: 16,
  },
  answerContainer: {
    marginTop: 140,
    width: "100%",
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
});
