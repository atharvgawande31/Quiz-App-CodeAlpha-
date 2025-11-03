import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, Stack, router } from "expo-router";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabse"; // make sure you have Supabase client setup
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import NextButton from "../components/button";
import SplashScreenController from "../components/splash-screen-controller";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const redirectTo = Linking.createURL("/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
        if (res.type === "success" && res.url) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(res.url);
          if (sessionError) throw sessionError;
          router.replace("/");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login", headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue your journey</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <NextButton
          isLoading={<ActivityIndicator />}
          onPress={() => handleLogin()}
          title="Login"
        />

        <Text style={{ color: "white", paddingTop: 12, fontSize: 20 }}>or</Text>

        <Pressable
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name="google" size={20} color="#fff" />
              <Text style={styles.googleText}>Sign in with Google</Text>
            </>
          )}
        </Pressable>

        <View style={styles.bottomText}>
          <Text style={{ color: "#ccc" }}>Don’t have an account?</Text>
          <Link href="/auth/signup" style={styles.linkText}>
            Sign up
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    color: Colors.textPrimary,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#bbb",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3d4f85ff",
  },
  button: {
    backgroundColor: "#2a8ff5ff",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#db4437",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  googleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomText: {
    flexDirection: "row",
    marginTop: 24,
    gap: 6,
  },
  linkText: {
    color: "#2a8ff5ff",
    fontWeight: "600",
  },
  error: {
    color: "#ff4d4d",
    marginBottom: 12,
  },
});
