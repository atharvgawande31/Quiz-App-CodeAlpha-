// app/index.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

// --- Style Map (Unchanged) ---
const categoryStyles = {
  9: { icon: "globe", color: "#4E89AE" },
  10: { icon: "book", color: "#C0392B" },
  11: { icon: "film", color: "#2C3E50" },
  12: { icon: "music", color: "#8E44AD" },
  14: { icon: "tv", color: "#2980B9" },
  15: { icon: "gamepad", color: "#D35400" },
  17: { icon: "flask", color: "#27AE60" },
  18: { icon: "laptop", color: "#3498DB" },
  21: { icon: "futbol-o", color: "#16A085" },
  22: { icon: "map-marker", color: "#F1C40F" },
  23: { icon: "hourglass-start", color: "#795548" },
  25: { icon: "paint-brush", color: "#E74C3C" },
  27: { icon: "paw", color: "#6D4C41" },
  default: { icon: "question-circle", color: "#7F8C8D" },
};

const getCategoryStyle = (id: number) => {
  return categoryStyles[id] || categoryStyles.default;
};

// --- API (Unchanged) ---
const CATEGORY_API = "https://opentdb.com/api_category.php";

// ✅ 1. --- Define types for your state ---
interface ApiCategory {
  id: number;
  name: string;
}

interface StyledCategory extends ApiCategory {
  icon: string;
  color: string;
  displayName: string;
}

export default function CategoriesScreen() {
  const router = useRouter();
  
  // ✅ 2. --- Use the 'StyledCategory' type for state ---
  const [categories, setCategories] = useState<StyledCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(CATEGORY_API);
        const data: { trivia_categories: ApiCategory[] } = await response.json();
        
        const styledCategories = data.trivia_categories.map((cat) => {
          const style = getCategoryStyle(cat.id);
          return {
            ...cat,
            icon: style.icon,
            color: style.color,
            displayName: cat.name.replace("Entertainment: ", "").replace("Science: ", ""),
          };
        });
        
        setCategories(styledCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // ✅ 3. --- Fix the 'handleCategoryPress' errors ---
  const handleCategoryPress = (categoryId: number) => {
    // TypeScript prefers a simple string for 'push'
    // This solves the 'pathname' and 'params' type errors.
    router.push(`/profile?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Categories...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Choose a Category</Text>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handleCategoryPress(item.id)} // This now correctly passes a number
          >
            <FontAwesome name={item.icon as any} size={32} color="#FFFFFF" />
            <Text style={styles.cardText}>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// --- Styles (Unchanged) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B15",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 4,
    elevation: 3,
    gap: 10,
    padding: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFFFFF",
  },
});