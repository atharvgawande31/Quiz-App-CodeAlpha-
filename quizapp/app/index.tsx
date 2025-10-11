import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Sample category data
const categories = [
  { id: "1", name: "Science", color: "#FF6B6B" },
  { id: "2", name: "History", color: "#4ECDC4" },
  { id: "3", name: "Technology", color: "#FFD93D" },
  { id: "4", name: "Sports", color: "#1A535C" },
  { id: "5", name: "Art", color: "#FF9F1C" },
  { id: "6", name: "Music", color: "#2EC4B6" },
];

export default function CategoriesScreen() {
  const router = useRouter();

  const handleCategoryPress = () => {
    // Navigate to another screen or pass category as param
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Category</Text>

      <FlatList
        data={categories}
        numColumns={2} // Two columns layout
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handleCategoryPress()}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

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
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});