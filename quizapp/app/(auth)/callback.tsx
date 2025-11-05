import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabse";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The current URL Supabase redirected to
        const buildSearchString = (p: Record<string, any> | undefined) => {
          const sp = new URLSearchParams();
          if (!p) return "";
          Object.entries(p).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v) => sp.append(key, String(v)));
            } else if (value != null) {
              sp.append(key, String(value));
            }
          });
          return sp.toString();
        };

        const fallback = `com.quizapp://auth/callback?${buildSearchString(params as Record<string, any>)}`;
        const url = typeof window !== "undefined" && window.location?.href ? window.location.href : fallback;

        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          console.error("Error exchanging code:", error);
          router.replace("/(auth)/login");
          return;
        }

        // ✅ Success — go to home
        router.replace("/");
      } catch (e) {
        console.error("Auth callback error:", e);
        router.replace("/(auth)/login");
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#2a8ff5" />
    </View>
  );
}