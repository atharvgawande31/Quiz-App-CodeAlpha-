// 1. Import useFonts
// (Keep all your other imports)
import { Colors } from "@/constants/Colors";
import { ScoreProvider } from "@/hooks/score";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { HeroOutline, HeroSolid } from '@nandorojo/heroicons';


 // Use FA5 for solid/regular styles
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: "(tabs)",
};

function AnimatedTabBarButton(props: BottomTabBarButtonProps) {
  const { children, onPress, onLongPress, accessibilityRole, accessibilityState, accessibilityLabel, testID } = props;

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSequence(
      withTiming(1.05, { duration: 350, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 350, easing: Easing.inOut(Easing.quad) })
    );
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        onPressIn={handlePressIn}
        // single bounce; no spring and no additional press-out animation
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [{ paddingVertical: 6, paddingHorizontal: 2 }, pressed && { opacity: 0.95 }]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ScoreProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Colors.accent,
              tabBarInactiveTintColor: "#9CA3AF",
              tabBarItemStyle: {
                alignItems: "center",
                justifyContent: "center",

              },
              tabBarLabelStyle: {
                textAlign: "center",
              },
              tabBarStyle: {
                backgroundColor: Colors.backgroundDark,
                borderTopColor: "transparent",
                paddingHorizontal: 8,

              },
              tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
              // Tab navigator doesn't support slide transitions directly
              // For slide animations between pages, use a Stack within tabs
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: "Home",
                tabBarLabelStyle: {
                  fontSize: 14, // 👈 increase this to make it bigger
                  fontWeight: "600", // optional
                },
                tabBarIcon: ({ color, focused, size }) => (
                  focused ? (
                    <HeroSolid.Home color={Colors.accent} width={size} height={size} /> 

                  ) : (
                    <HeroOutline.Home color={color} width={size} height={size} />
                  )
                ),
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: "Categories",
                tabBarIcon: ({ color, focused, size }) => (
                  focused ? (
                    <HeroSolid.AcademicCap color={Colors.accent} width={size} height={size} />
                  ) : (
                    <HeroOutline.AcademicCap color={color} width={size} height={size} />
                  )
                ),
              }}
            />
            <Tabs.Screen
              name="leaderboard"
              options={{
                title: "Leaderboard",
                tabBarIcon: ({ color, focused, size }) => (
                  focused ? (
                    <HeroSolid.Trophy color={Colors.accent} width={size} height={size} />
                  ) : (
                    <HeroOutline.Trophy color={color} width={size} height={size} />
                  )
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, focused, size }) => (
                  focused ? (
                    <HeroSolid.User color={Colors.accent} width={size} height={size} />
                  ) : (
                    <HeroOutline.User color={color} width={size} height={size} />
                  )
                ),
              }}
            />
          </Tabs>
          <StatusBar style="dark" />
        </ThemeProvider>
      </ScoreProvider>
    </>
  );
}