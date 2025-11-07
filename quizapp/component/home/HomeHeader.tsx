import { Colors } from "@/constants/Colors";
import { useDaysStreak } from "@/hooks/daysStreak";
import { HeroSolid } from "@nandorojo/heroicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeHeader() {
  const { daysStreak } = useDaysStreak(); // Hook handles logic

  return (
    <View style={[styles.topSection]}>
      <View style={styles.userSection}>
        <Text style={styles.greeting}>Hello</Text>
        <Text style={styles.userName}>Sean Bram</Text>
      </View>
      <View style={styles.questionsSolvedContainer}>
        <HeroSolid.Fire color={Colors.primary} width={20} height={20} />
        <Text style={styles.questionsSolvedText}>
          {daysStreak} {daysStreak === 1 ? "day" : "days"}
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
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
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
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
  },
  userName: {
    fontSize: 24,
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
