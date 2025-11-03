import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';// import { LinearGradient } from 'expo-linear-gradient'; // For Expo projects

const NextButton = ({ onPress, title = 'Next',  } : any) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      {/* Using LinearGradient for the background effect.
        Ensure you have installed either 'react-native-linear-gradient'
        or 'expo-linear-gradient' based on your project type.
      */}
      <LinearGradient
        colors={['#efc631ff', '#ffd333ff']} // Blue gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%', // Adjust width as needed
    height: 60,   // Fixed height
    borderRadius: 30, // Half of height for fully rounded ends
    overflow: 'hidden', // Ensures the gradient stays within the rounded bounds
    shadowColor: '#000', // For a subtle shadow effect
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8, // For Android shadow
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NextButton;