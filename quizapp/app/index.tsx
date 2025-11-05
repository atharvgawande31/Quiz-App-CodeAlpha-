// app/WelcomeScreen.tsx (or app/index.tsx if this is your entry)

import { Borders } from "@/constants/Border";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/FontSizes";
import { Spacing } from "@/constants/Spacing";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/component/button";
import { useRouter } from "expo-router";

const WelcomeIllustration = require("../assets/images/react-logo.png"); // Use an existing asset

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <Image
            source={WelcomeIllustration} // Use your actual image source
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeTitle}>Welcome to SeekJob</Text>
          <Text style={styles.welcomeText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          {/* Buttons */}
          <Button
            title="Get Started"
            onPress={handleLoginPress}
            colorScheme="secondary"
            iconName="arrow-right"
            iconPosition="right"
            style={styles.button}
          />
          {/* Removed the grey Register button as requested */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.welcomeBackground, // The light grey background from the image
  },
  container: {
    flex: 1,
    backgroundColor: Colors.welcomeBackground,
    justifyContent: "space-between", // Pushes content and illustration apart
    alignItems: "center",
  },
  illustrationContainer: {
    flex: 1, // Takes up available space
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  illustration: {
    width: "90%", // Adjust based on your image dimensions
    height: 250, // Adjust height as needed
    maxWidth: 350,
  },
  contentContainer: {
    width: "100%",
    backgroundColor: Colors.textLight, // White background for the bottom section
    borderTopLeftRadius: Borders.radius.xl,
    borderTopRightRadius: Borders.radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    alignItems: "center",
    paddingBottom: Spacing.xxxl + Spacing.lg, // Extra padding for safe area bottom inset
    elevation: 10, // Shadow for Android
    shadowColor: Colors.textPrimary, // Shadow for iOS
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  welcomeTitle: {
    fontSize: Typography.fontSizes.h2,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: Typography.fontSizes.md,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xxl,
    lineHeight: Typography.fontSizes.md * 1.5,
    maxWidth: 300,
  },
  button: {
    width: "100%",
    marginBottom: Spacing.md, // Spacing between buttons
  },
});
