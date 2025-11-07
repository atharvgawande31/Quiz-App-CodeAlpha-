import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import HomeHeader from "@/component/home/HomeHeader";
import HomeSearchBar from "@/component/home/HomeSearchBar";
import CategoryCarousel from "@/component/home/CategoryCarousel";// New component
import { useCategories, StyledCategory } from "@/hooks/useCategory";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom hooks handle their own logic (fetching, loading)
  const { categories, isLoading } = useCategories();

  const filteredCategories = categories.filter((cat) =>
    cat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
     
      >
        {/* Component 1: Header */}
        <HomeHeader />

        {/* Component 2: Search Bar */}
        <HomeSearchBar query={searchQuery} onQueryChange={setSearchQuery} />

        {/* Component 3: Carousel */}
        <CategoryCarousel
          categories={filteredCategories}
          isLoading={isLoading}
        />
        
        {/* You can add more sections here easily */}
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.welcomeBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});