import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated, // 1. Import Animated
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// --- Style Map ---
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
  27: { icon: "paw", color: "#324285ff" },
  default: { icon: "question-circle", color: "#7F8C8D" },
};

const getCategoryStyle = (id: number) => {
  const key = id.toString() as keyof typeof categoryStyles;
  return categoryStyles[key] || categoryStyles.default;
};

// --- Wrap FlatList with Animated.createAnimatedComponent ---
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// --- API ---
const CATEGORY_API = "https://opentdb.com/api_category.php";

interface ApiCategory {
  id: number;
  name: string;
}

interface StyledCategory extends ApiCategory {
  icon: string;
  color: string;
  displayName: string;
}

export default function CategoriesScreen( {item } : any) {
  const router = useRouter();
  const [categories, setCategories] = useState<StyledCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Remove hasScrolled state, add Animated.Value
  const scrollY = useRef(new Animated.Value(0)).current;

  const { top: safeAreaTop } = useSafeAreaInsets();
  const HEADER_HEIGHT = 120; // Adjust this height as needed

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(CATEGORY_API);
        const data: { trivia_categories: ApiCategory[] } = await response.json();

        const filteredCategories = data.trivia_categories.filter((cat) => {
          const key = cat.id.toString() as keyof typeof categoryStyles;
          return categoryStyles.hasOwnProperty(key) && key !== "default";
        });

        const styledCategories = filteredCategories.map((cat) => {
          const style = getCategoryStyle(cat.id);
          return {
            ...cat,
            icon: style.icon,
            color: style.color,
            displayName: cat.name
              .replace("Entertainment: ", "")
              .replace("Science: ", ""),
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

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/quiz?category=${categoryId}`);
  };


  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 70], 
    outputRange: [0, 1], 
    extrapolate: 'clamp', 
  });



  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color={Colors.textPrimary} />
        <Text style={[styles.text, { marginTop: 10 }]}>Loading Categories...</Text>
      </SafeAreaView>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <FontAwesome name="exclamation-triangle" size={32} color="#FFD700" />
        <Text style={[styles.text, { marginTop: 16, textAlign: 'center' }]}>
          Could not load categories.
        </Text>
      </SafeAreaView>
    );
  }

  // Main component render
  return (
    <View style={styles.container}>
      <AnimatedFlatList
        style={{ flex: 1 }}
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 20, // Start content below the header
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
        // 5. Use Animated.event to update scrollY
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => handleCategoryPress(item.id)}
          >
            <FontAwesome name={item.icon as any} size={32} color="#FFFFFF" />
            <Text style={styles.cardText}>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 6. Render ONE animated header */}
      <Animated.View
        style={[
          styles.blurHeader,
          {
            height: HEADER_HEIGHT,
            paddingTop: safeAreaTop,
            opacity: blurOpacity, // Apply the animated opacity
          },
        ]}
      >
        {/* The BlurView fills the container */}
        <BlurView
          intensity={90}
          tint="dark"
          style={StyleSheet.absoluteFill} 
        />
        {/* The Text sits on top of the blur */}
        <Text style={styles.header}>Choose a Category</Text>
      </Animated.View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B15",
  },
  blurHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-end", // Pushes text to the bottom
    paddingBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
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
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: "#0B0B15",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
  }
});