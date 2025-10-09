import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { data } from "@/assets/images/data/dummyData";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";



export default function Answers() {
 
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
    borderColor: "#2a8ff5ff",
    backgroundColor : "#2a8ff5ff"
  },
});