import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { StyledCategory } from "@/hooks/useCategory";



const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const SPACING = SCREEN_WIDTH * 0.03;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

interface CardProps {
  item: StyledCategory;
  index: number;
  scrollX: Animated.Value;
  onPress: (id: number) => void;
}

export default function CategoryCard({ item, index, scrollX, onPress }: CardProps) {
  
  // This is the core animation logic
  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8], // Side cards are 80%
    extrapolate: "clamp",
  });

  const rotateY = scrollX.interpolate({
    inputRange,
    outputRange: ["-30deg", "0deg", "30deg"], // 3D rotation
    extrapolate: "clamp",
  });

  const dimOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 0, 0.5], // Side cards are 50% dimmed
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          // Apply the 3D animations
          transform: [{ scale }, { rotateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(item.id)}
        style={styles.card}
      >
        <LinearGradient
          colors={item.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Decorative elements */}
          <View style={styles.decorativeContainer}>
            <View style={styles.star}>
              <FontAwesome name="star" size={20} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={[styles.star, { top: 40, right: 30 }]}>
              <FontAwesome name="star" size={15} color="rgba(255,255,255,0.2)" />
            </View>
            <View style={styles.squiggle}>
              <Text style={styles.squiggleText}>~</Text>
            </View>
          </View>

          {/* Category Icon */}
          <View style={styles.iconContainer}>
            <FontAwesome name={item.icon as any} size={48} color="#FFFFFF" />
          </View>

          {/* Category Title */}
          <Text style={styles.cardTitle}>{item.displayName}</Text>

          {/* Play Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => onPress(item.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF6B35", "#FF8C42"] as const}
              style={styles.playButtonGradient}
            >
              <FontAwesome name="play" size={16} color="#FFFFFF" />
              <Text style={styles.playButtonText}>Play</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      {/* Dimming Overlay */}
      <Animated.View
        style={[
          styles.dimOverlay,
          { opacity: dimOpacity }
        ]}
        pointerEvents="none" // Lets taps go through to the card
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: CARD_WIDTH,
        height: 350, 
        // marginRight: SPACING, // 👈 REMOVE THIS LINE
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    overflow: "hidden",
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    position: "relative",
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  squiggle: {
    position: "absolute",
    bottom: 60,
    left: 20,
  },
  squiggleText: {
    fontSize: 40,
    color: "rgba(255,255,255,0.2)",
    transform: [{ rotate: "45deg" }],
  },
  iconContainer: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  playButton: {
    alignSelf: "center",
    borderRadius: 25,
    overflow: "hidden",
  },
  playButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
  },
});