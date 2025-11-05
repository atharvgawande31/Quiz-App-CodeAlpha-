import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "text" | "email" | "password" | "number";
  icon?: string; // optional left icon (FontAwesome name)
  error?: string; // optional error message
  style?: ViewStyle; // allow overriding style
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = "text",
  icon,
  error,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
      ? "numeric"
      : "default";

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[styles.inputContainer, error && { borderColor: "#ff4d4d" }]}
      >
        {/* Left icon (optional) */}
        {icon && (
          <FontAwesome
            name={icon as any}
            size={20}
            color="#aaa"
            style={styles.leftIcon}
          />
        )}

        {/* Input field */}
        <TextInput
          style={[styles.input, icon && { paddingLeft: 40 }]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
        />

        {/* Password toggle (only for password fields) */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2b2b2b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3d4f85ff",
    position: "relative",
  },
  leftIcon: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: 14,
    paddingRight: 44, // space for eye icon
    color: "#fff",
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 14,
  },
  error: {
    color: "#ff4d4d",
    marginTop: 6,
    fontSize: 13,
  },
});
