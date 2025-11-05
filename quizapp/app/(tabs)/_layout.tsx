// 1. Import useFonts
import { useFonts } from "expo-font";

// (Keep all your other imports)
import { Colors } from "@/constants/Colors";
import { ScoreProvider } from "@/hooks/score";
import { useColorScheme } from "@/hooks/use-color-scheme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // 2. Keep this import
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import "react-native-reanimated";

WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // 3. Load the fonts
  const [fontsLoaded, fontError] = useFonts({
    ...FontAwesome5.font, // This loads all the FontAwesome 5 styles
  });

  // 4. Wait for fonts to load before rendering the app.
  // This replaces your <SplashScreenController />
  // You can also add SplashScreen.hideAsync() here
  if (!fontsLoaded && !fontError) {
    return null; // Show nothing (or a <View />) while fonts load
  }

  // 5. Your app now renders, and the font is guaranteed to be loaded.
  return (
    <>
      {/* <SplashScreenController /> We replaced this with the hook above */}
      <ScoreProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: Colors.accent,
              tabBarInactiveTintColor: "#9CA3AF",
              tabBarStyle: {
                backgroundColor: Colors.backgroundDark,
                borderTopColor: "transparent",
              },
            }}
          >
            <Tabs.Screen
              name="Home"
              options={{
                title: "Home",
                // This 'solid' prop will now work perfectly
                tabBarIcon: ({ color, focused, size }) => (
                  <FontAwesome5
                    name="home"
                    solid={focused} // <-- This is correct
                    size={size}
                    color={focused ? Colors.accent : color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Categories"
              options={{
                title: "Categories",
                tabBarIcon: ({ color, focused, size }) => (
                  <FontAwesome5
                    name="th-large"
                    solid={focused} // <-- This is correct
                    size={size}
                    color={focused ? Colors.accent : color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Leaderboard"
              options={{
                title: "Leaderboard",
                tabBarIcon: ({ color, focused, size }) => (
                  <FontAwesome5
                    name="trophy"
                    solid={focused} // <-- This is correct
                    size={size}
                    color={focused ? Colors.accent : color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="Profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, focused, size }) => (
                  <FontAwesome5
                    name="user"
                    solid={focused} // <-- This is correct
                    size={size}
                    color={focused ? Colors.accent : color}
                  />
                ),
              }}
            />
          </Tabs>
          <StatusBar style="light" />
        </ThemeProvider>
      </ScoreProvider>
    </>
  );
}