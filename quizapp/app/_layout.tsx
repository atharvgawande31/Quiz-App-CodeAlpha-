import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ScoreProvider } from "@/hooks/score";
import { Colors } from "@/constants/Colors";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Header } from "@react-navigation/elements";
import SplashScreenController from "./components/splash-screen-controller";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <SplashScreenController />
      <ScoreProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen
  name="quiz"
   options={{
          title: '',
          headerBackTitle: "Categories",
          headerStyle: {
            backgroundColor: Colors.primaryDark,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
/>
          <Stack.Screen name="finalScore" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </ScoreProvider>
    </>
  );
}
