import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link, Stack, router } from "expo-router";
import { supabase } from "@/lib/supabse";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.replace("/(auth)/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleGoogleSignUp = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
        });
        if (error) throw error;
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Stack.Screen options={{ title: "Sign Up", headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Create Account ✨</Text>
        <Text style={styles.subtitle}>Join and start your adventure</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

         <TouchableOpacity style={styles.googleButton} onPress={() => handleGoogleSignUp()  }>
          <FontAwesome name="google" size={20} color="#fff" />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.bottomText}>
          <Text style={{ color: "#ccc" }}>Already have an account?</Text>
          <Link href="/(auth)/login" style={styles.linkText}>
            Login
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
    backgroundColor: "#18a226ff",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
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
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
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