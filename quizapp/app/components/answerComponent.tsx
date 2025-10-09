import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { data } from "@/assets/data/dummyData";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Answers() {
  const { id } = useLocalSearchParams();
  const questions = data.questions;
  const currentQuestion = questions.find((q) => q.id === id) || questions[1];

  const [selected, setSelected] = useState(null);

  function handleSelection(index : any) {
    setSelected(index);
  }

  return (
    <>
      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          onPress={() => handleSelection(index)}
          key={index}
          style={[
            styles.answers,
            selected === index && styles.selected,
          ]}
        >
          <Text style={styles.text}>{option}</Text>
          {selected === index ? (
            <FontAwesome name="check-circle" size={28} color="#d8e2ffff" />
          ) : (
            <FontAwesome name="circle-o" size={28} color="#3d4f85ff" />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  answers: {
    padding: 16,
    borderWidth: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#3d4f85ff",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    opacity: 0.8,
  },
  selected: {
    borderColor: "#2455e9ff",
  },
});