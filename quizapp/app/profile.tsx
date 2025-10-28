import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
// ✅ 1. Import 'useLocalSearchParams' and 'useFocusEffect'
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import Timer from "./components/timer";    // Assuming this component exists
import NextButton from "./components/button";  // Assuming this component exists
import { Colors } from "@/constants/Colors";     // Assuming this file exists
import { useScore } from "@/hooks/score";       // Assuming this hook exists
import { decode } from 'html-entities';

// ⛔️ Remove the hardcoded API_URL
// const API_BASE_URL = '...';

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function QuizComponent() { // Renamed from "Component"
  // ✅ 2. Get the category ID passed from the menu
  const { category } = useLocalSearchParams();

  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const { score, setScore } = useScore();
  const [token, setToken] = useState<string | null>(null);

  // First effect: Runs ONCE to get the token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  // ✅ 3. Use 'useFocusEffect' to fetch questions every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      // Don't run if we don't have a token OR a category yet
      if (!token || !category) return;

      const fetchQuestions = async () => {
        setIsLoading(true);
        // Reset state for the new quiz
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelected(null);
        setScore(0); // Assuming useScore() hook provides setScore
        
        try {
          // ✅ 4. Build the API URL dynamically with the category and token
          const API_URL = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=easy&type=multiple&token=${token}`;
          
          const response = await fetch(API_URL);
          const data = await response.json();

          if (data.response_code !== 0) {
            console.warn("Could not retrieve questions. Response code:", data.response_code);
            setQuestions([]);
          } else {
            const formattedQuestions = data.results.map((q: any) => {
              const decodedQuestion = decode(q.question);
              const decodedCorrectAnswer = decode(q.correct_answer);
              const decodedIncorrectAnswers = q.incorrect_answers.map((a: string) => decode(a));
              
              const allOptions = shuffleArray([
                decodedCorrectAnswer,
                ...decodedIncorrectAnswers,
              ]);

              return {
                question: decodedQuestion,
                options: allOptions,
                correctAnswer: decodedCorrectAnswer,
              };
            });
            setQuestions(formattedQuestions);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestions();
      
    }, [token, category]) // Re-run this effect if the token or category changes
  );

  // --- All other logic (handleSelection, handleNext, etc.) is unchanged ---

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

  // --- Render Logic (with a small update for loading text) ---

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <ActivityIndicator size="large" color={Colors.textPrimary} />
        <Text style={[styles.text, { marginTop: 10 }]}>Loading Quiz...</Text>
      </SafeAreaView>
    );
  }

  if (!currentQuestion || questions.length === 0) {
     return (
      <SafeAreaView style={[styles.container, styles.centerAll]}>
        <Text style={[styles.text, { textAlign: 'center' }]}>
          Could not load questions for this category.
        </Text>
        <NextButton onPress={() => router.back()} title="Try Another" />
      </SafeAreaView>
    );
  }
  
  // ... rest of your return JSX ...

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

// --- Styles (Same as your quiz component) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.primaryDark,
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
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