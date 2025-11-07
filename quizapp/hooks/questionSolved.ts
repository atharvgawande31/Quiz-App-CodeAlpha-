import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const QUESTIONS_SOLVED_KEY = "@total_questions_solved";

export const useQuestionsSolved = () => {
  const [totalQuestionsSolved, setTotalQuestionsSolved] = useState(0);

  const loadQuestionsSolved = async () => {
    try {
      const value = await AsyncStorage.getItem(QUESTIONS_SOLVED_KEY);
      if (value !== null) {
        setTotalQuestionsSolved(parseInt(value, 10));
      }
    } catch (error) {
      console.error("Error loading questions solved:", error);
    }
  };

  // Refresh questions solved count when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadQuestionsSolved();
    }, [])
  );

  return { totalQuestionsSolved };
};