import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useQuestionsSolved } from "@/hooks/questionSolved";

export default function HomeHeader() {
  const { totalQuestionsSolved } = useQuestionsSolved(); // Hook handles logic

  return (
    <View style={[styles.topSection]}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <FontAwesome name="user" size={24} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>Sean Bram</Text>
      </View>
      <View style={styles.questionsSolvedContainer}>
        <FontAwesome name="question-circle" size={20} color={Colors.primary} />
        <Text style={styles.questionsSolvedText}>
          {totalQuestionsSolved.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  questionsSolvedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionsSolvedText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});