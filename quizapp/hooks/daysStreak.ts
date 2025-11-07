import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";

const LAST_ACTIVITY_DATE_KEY = "@last_activity_date";
const STREAK_COUNT_KEY = "@days_streak_count";

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Returns YYYY-MM-DD
};

const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const useDaysStreak = () => {
  const [daysStreak, setDaysStreak] = useState(0);

  const loadStreak = async () => {
    try {
      const lastActivityDate = await AsyncStorage.getItem(LAST_ACTIVITY_DATE_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_COUNT_KEY);
      const today = getTodayDateString();

      if (!lastActivityDate) {
        // First time - initialize streak
        await AsyncStorage.setItem(LAST_ACTIVITY_DATE_KEY, today);
        await AsyncStorage.setItem(STREAK_COUNT_KEY, "1");
        setDaysStreak(1);
        return;
      }

      const streakCount = savedStreak ? parseInt(savedStreak, 10) : 0;

      if (lastActivityDate === today) {
        // Already active today - return current streak
        setDaysStreak(streakCount || 1);
        return;
      }

      const daysDiff = getDaysDifference(lastActivityDate, today);

      if (daysDiff === 1) {
        // Consecutive day - increment streak
        const newStreak = streakCount + 1;
        await AsyncStorage.setItem(LAST_ACTIVITY_DATE_KEY, today);
        await AsyncStorage.setItem(STREAK_COUNT_KEY, newStreak.toString());
        setDaysStreak(newStreak);
      } else if (daysDiff > 1) {
        // Streak broken - reset to 1
        await AsyncStorage.setItem(LAST_ACTIVITY_DATE_KEY, today);
        await AsyncStorage.setItem(STREAK_COUNT_KEY, "1");
        setDaysStreak(1);
      } else {
        // Same day or future date (shouldn't happen) - keep current streak
        setDaysStreak(streakCount || 1);
      }
    } catch (error) {
      console.error("Error loading days streak:", error);
      setDaysStreak(0);
    }
  };

  // Refresh streak count when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStreak();
    }, [])
  );

  return { daysStreak };
};

