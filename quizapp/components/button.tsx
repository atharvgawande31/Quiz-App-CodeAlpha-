
import { Borders } from '@/constants/Border';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/FontSizes';
import { Spacing } from '@/constants/Spacing';
import { FontAwesome } from '@expo/vector-icons';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';

// Define all possible button variants and color schemes
type ButtonVariant = 'filled' | 'outlined' | 'text';
type ButtonColorScheme =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'error'
  | 'disabled';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  isLoading?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof FontAwesome.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[]; // Allow custom styles
  textStyle?: TextStyle | TextStyle[]; // Allow custom text styles
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'filled', // Default to a filled button
  colorScheme = 'primary',
  isLoading = false,
  disabled = false,
  iconName,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  // --- 1. Logic First ---

  const isDisabled = disabled || isLoading;
  
  // Use 'disabled' color scheme if button is disabled
  const disableColorScheme = isDisabled ? 'disabled' : colorScheme;

  // Determine colors based on variant and scheme
  const backgroundColor =
    variant === 'filled'
      ? Colors[disableColorScheme]
      : 'transparent';
      
  const foregroundColor = // Used for text and icons
    variant === 'filled'
      ? disableColorScheme === 'accent' // Yellow bg has dark text
        ? Colors.textPrimary
        : Colors.textLight // Most filled buttons have light text
      : Colors[disableColorScheme]; // Outlined/text buttons use the scheme color

  const borderColor =
    variant === 'outlined'
      ? Colors[disableColorScheme]

      : 'transparent';
      
  const borderWidth =
    variant === 'outlined'
      ? Borders.width.thin
      : 0;

  // Create dynamic style objects
  const buttonDynamicStyles: ViewStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
  };

  const textDynamicStyles: TextStyle = {
    color: foregroundColor,
  };

  const iconDynamicStyles: TextStyle = {
    color: foregroundColor,
  };
  
  const loaderColor = foregroundColor;

  // --- 2. Return Component ---

  return (
    <TouchableOpacity
      style={[
        styles.button, // 1. Base styles
        buttonDynamicStyles, // 2. Dynamic styles
        isDisabled && styles.disabledButton, // 3. Disabled override
        style, // 4. Custom styles from props
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <FontAwesome
              name={iconName}
              size={Typography.fontSizes.lg}
              style={[styles.icon, { marginRight: Spacing.sm }, iconDynamicStyles]}
            />
          )}
          <Text style={[styles.buttonText, textDynamicStyles, textStyle]}>
            {title}
          </Text>
          {iconName && iconPosition === 'right' && (
            <FontAwesome
              name={iconName}
              size={Typography.fontSizes.lg}
              style={[styles.icon, { marginLeft: Spacing.sm }, iconDynamicStyles]}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

// --- 3. Styling ---

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: Borders.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.semibold, // Use a standard bold-ish weight
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  icon: {
    // No base styles needed, color is handled dynamically
  },
});