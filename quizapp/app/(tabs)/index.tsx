import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,

} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router"; // Assuming you're using Expo Router
import Timer from "../components/timer";     // Assuming this component exists
import NextButton from "../components/button";   // Assuming this component exists
import { Colors } from "@/constants/Colors";     // Assuming this file exists
import { useScore } from "@/hooks/score";       // Assuming this hook exists
import { decode } from 'html-entities';         // Make sure to install: npm install html-entities

// ✅ 1. --- Define new constants for filtering ---
const REQUIRED_QUESTIONS = 10;
const MAX_QUESTION_LENGTH = 120; // Max characters. Adjust this to match "3 lines" on your UI.
const API_AMOUNT_TO_FETCH = 50;  // Fetch a larger batch to filter from

// ✅ 2. --- API URL now uses the larger amount ---
const API_URL = `https://opentdb.com/api.php?amount=${API_AMOUNT_TO_FETCH}&category=17&difficulty=easy&type=multiple`;

// Helper function to shuffle answers
const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function Component() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const { score, setScore } = useScore();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ✅ 3. --- fetchQuestions is updated with filtering logic ---
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();

      const shortQuestions: any[] = [];

      // Loop through all fetched questions
      for (const q of data.results) {
        // First, decode the question
        const decodedQuestion = decode(q.question);

        // Now, check its length
        if (decodedQuestion.length <= MAX_QUESTION_LENGTH) {
          // If it's short enough, format it and add it to our list
          const decodedCorrectAnswer = decode(q.correct_answer);
          const decodedIncorrectAnswers = q.incorrect_answers.map((a: string) => decode(a));
          
          const allOptions = shuffleArray([
            decodedCorrectAnswer,
            ...decodedIncorrectAnswers,
          ]);

          shortQuestions.push({
            question: decodedQuestion,
            options: allOptions,
            correctAnswer: decodedCorrectAnswer,
          });
        }
        
        // Stop once we have enough short questions
        if (shortQuestions.length === REQUIRED_QUESTIONS) {
          break;
        }
      }

      // Handle cases where we didn't find enough short questions
      if (shortQuestions.length < REQUIRED_QUESTIONS) {
        console.warn(
          `Could not find ${REQUIRED_QUESTIONS} short questions. Found only ${shortQuestions.length}.`
        );
      }

      setQuestions(shortQuestions); // Set state with our filtered list

    } catch (error) {
      console.error("Error fetching questions:", error);
      // You could add an error state here
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  function handleSelection(index: number) {
    if (selected !== null) return; 

    setSelected(index);
    const selectedOption = currentQuestion.options[index];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  }

  const handleCheckScore = () => {
    router.push("/finalScore");
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(null); 
    } else {
      handleCheckScore();
    }
  };

  // --- Render Logic (Unchanged) ---

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color={Colors.textPrimary} />
        <Text style={[styles.text, { marginTop: 10 }]}>Loading Quiz...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
     return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <Text style={styles.text}>Could not find enough short questions.</Text>
        <NextButton onPress={fetchQuestions} title="Try Again" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Timer key={currentQuestionIndex} duration={30} onComplete={handleNext} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.secText}>
            Question {currentQuestionIndex + 1}
            <Text style={styles.supportText}> / {questions.length}</Text>
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <FontAwesome name="trophy" size={22} color="#D3AF37" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      <Text style={styles.question}>{currentQuestion.question}</Text>

      <View style={styles.answerContainer}>
        {currentQuestion.options.map((option: any, index: any) => {
          const isSelected = selected === index;
          const isCorrect = option === currentQuestion.correctAnswer;
          
          const showCorrect = selected !== null && isCorrect;
          const showWrong = isSelected && !isCorrect;

          return (
            <TouchableOpacity
              onPress={() => handleSelection(index)}
              key={index}
              style={[
                styles.answers,
                isSelected && styles.selected,
                showCorrect && styles.correct,
                showWrong && styles.wrong,
              ]}
              disabled={selected !== null}
            >
              <Text 
                style={[
                  styles.text, 
                  (showCorrect || showWrong) && styles.selectedOptionText,
                  styles.optionTextContent 
                ]}
              >
                {option}
              </Text>
              
              {showCorrect ? (
                <FontAwesome name="check-circle" size={28} color="white" />
              ) : showWrong ? (
                <FontAwesome name="times-circle" size={28} color="white" />
              ) : (
                <FontAwesome name="circle-o" size={28} color="#3d4f85ff" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        {currentQuestionIndex === questions.length - 1 ? (
          <NextButton onPress={handleCheckScore} title="Check Score" />
        ) : (
          <NextButton onPress={handleNext} title="Next" />
        )}
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.primaryDark,
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#D3AF37",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  selectedOptionText: {
    color: "white",
    fontWeight: "700",
  },
  optionTextContent: {
    flex: 1, 
    flexWrap: 'wrap', 
    marginRight: 10, 
  },
  supportText: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.textPrimary,
  },
  secText: {
    opacity: 0.5,
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.textPrimary,
    marginVertical: 12,
    opacity: 0.3,
    marginTop: 16,
  },
  question: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 16,
    minHeight: 110,
  },
  answerContainer: {
    // I increased this from 24 to 64 for better spacing after the (potentially 3-line) question
    marginTop: 24, 
    width: "100%",
  },
  answers: {
    padding: 16,
    borderWidth: 3,
    flexDirection: "row",
    justifyContent: "flex-start", 
    alignItems: "center", 
    gap: 15, 
    borderRadius: 16,
    marginBottom: 12,
    borderColor: "#3d4f85ff",
  },
  selected: {
    borderColor: "#2a8ff5ff",
  },
  correct: {
    backgroundColor: "#18a226ff",
    borderColor: "#18a226ff",
  },
  wrong: {
    backgroundColor: "#ff4d4d",
    borderColor: "#ff4d4d",
  },
  buttonContainer: {
    justifyContent: "center",
    alignSelf: "center",
    width: "50%",
    marginTop: 16,
  },
});