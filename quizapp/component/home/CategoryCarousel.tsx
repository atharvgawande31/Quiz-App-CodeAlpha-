import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
  Animated,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { StyledCategory } from "@/hooks/useCategory"; 
import CategoryCard from "./CategoryCard"; 

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// --- CORRECTED LAYOUT CONSTANTS ---
const CARD_WIDTH = SCREEN_WIDTH * 0.7; // Main card is 70% of screen
const SPACING = SCREEN_WIDTH * 0.05; // Space between cards

// This is the padding needed on the left/right to center the 70% card.
// (100% - 70%) / 2 = 15%
const HORIZONTAL_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// The snap interval is now the card width + the spacing
const SNAP_INTERVAL = CARD_WIDTH + SPACING; 

interface CarouselProps {
  categories: StyledCategory[];
  isLoading: boolean;
}

export default function CategoryCarousel({ categories, isLoading }: CarouselProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleSeeAll = () => {
    router.push("/(tabs)/categories" as any);
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/quiz?category=${categoryId}`);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    // We check viewableItems[0] because it's the most prominent
    if (viewableItems[0] && viewableItems[0].isViewable) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  if (isLoading || categories.length === 0) {
return(
  <ActivityIndicator/>
)
  }


  return (
    <View style={styles.gameSection}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>Choose your game</Text>
        <TouchableOpacity onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.carouselContainer}>
        <Animated.FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: HORIZONTAL_PADDING,
          }}
          
          // 2. Add an ItemSeparatorComponent to create spacing
          ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
          
          style={styles.flatList}
          snapToInterval={SNAP_INTERVAL} // Use the correct snap interval
          decelerationRate="fast"
          bounces={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true } 
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          renderItem={({ item, index }) => (
            <CategoryCard
              item={item}
              index={index}
              scrollX={scrollX}
              onPress={handleCategoryPress}
            />
          )}
        />
      </View>

      {/* Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {categories.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              index === currentIndex && styles.indicatorDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// ... (styles are mostly the same, no changes needed)
const styles = StyleSheet.create({
  gameSection: {
    paddingLeft: 20, 
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingRight: 20, 
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  loadingContainer: {
    height: 350, 
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    height: 380, 
  },
  flatList: {
    overflow: "visible", 
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingRight: 20, 
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: Colors.accent,
  },
  emptyContainer: {
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});