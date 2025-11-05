import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";
import { Link, Stack, router } from "expo-router";
import { InputField } from "@/component/Input";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabse"; // make sure you have Supabase client setup
import { Colors } from "@/constants/Colors";
import { Button } from "@/component/button";


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
      router.replace("/(tabs)/categories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

   WebBrowser.maybeCompleteAuthSession();

   
  const handleGoogleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const redirectTo = Linking.createURL("/auth/callback"); 
    // ✅ This becomes com.quizapp://auth/callback

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo, // ✅ tell Supabase to come back here
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (res.type === "success" && res.url) {
        const { error: sessionError } =
          await supabase.auth.exchangeCodeForSession(res.url);
        if (sessionError) throw sessionError;
        router.replace("/(tabs)/categories");
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

        <InputField
          label="Email"
          placeholder="Enter your email"
          type="email"
          icon="envelope"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          label="Password"
          placeholder="Enter Password"
          type="password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
        />

        <Button
          onPress={() => handleLogin()}
          title="Login"
          style={{width: "100%"}}

        />

        <Text style={{ color: "white", paddingTop: 12, paddingBottom: 12, fontSize: 20 }}>or</Text>

        <Button
        title="Login with google" 
        iconName="google"
        iconPosition="left"
          onPress={handleGoogleLogin}
          disabled={loading}
          style={{width: "100%", borderColor: Colors.inputBorder}}
          textStyle={{color: Colors.textLight}}
          variant="outlined"

    />

        <View style={styles.bottomText}>
          <Text style={{ color: "#ccc" }}>Don’t have an account?</Text>
          <Link href="/(auth)/signup" style={styles.linkText}>
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
    backgroundColor: Colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    color: Colors.textLight,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#bbb",
    marginBottom: 32,
  },

  button: {
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  googleText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomText: {
    flexDirection: "row",
    marginTop: 24,
    gap: 6,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  error: {
    color: Colors.error,
    marginBottom: 12,
  },
});
