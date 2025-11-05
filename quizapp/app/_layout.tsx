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
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "@/hooks/use-color-scheme";
import SplashScreenController from "@/component/splash-screen-controller";
  WebBrowser.maybeCompleteAuthSession();

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
            backgroundColor: Colors.backgroundDark
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
