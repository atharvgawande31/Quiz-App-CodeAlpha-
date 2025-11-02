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
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import Timer from "./components/timer";
import NextButton from "./components/button";
import { Colors } from "@/constants/Colors";
import { useScore } from "@/hooks/score";
import { decode } from "html-entities";

// --- Type Definitions ---

interface OpenTDBQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

type QuizParams = {
  category?: string;
};

interface ScoreContextType {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

// --- Helper Function ---

const shuffleArray = (array: string[]): string[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- No more sessionToken variable ---

export default function QuizComponent() {
  // --- State and Hooks ---
  const { category } = useLocalSearchParams<QuizParams>();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const { score, setScore } = useScore() as ScoreContextType;

  useFocusEffect(
    useCallback(() => {
      if (!category) return;

      // --- Token fetch function is removed ---

      const fetchQuestions = async () => {
        setIsLoading(true);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setSelected(null);
        setScore(0);

        try {
          // --- No token logic ---

          // Build API URL without difficulty or token
          const API_URL = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;

          let response = await fetch(API_URL);
          let data = await response.json();

          // --- Token retry logic is removed ---

          // Handle final API response codes
          if (data.response_code !== 0) {
            console.warn(
              "Could not retrieve questions. Final response code:",
              data.response_code
            );
            setQuestions([]); 
          } else {
            // Process successful response
            const formattedQuestions: QuizQuestion[] = data.results.map(
              (q: OpenTDBQuestion) => {
                const decodedQuestion = decode(q.question);
                const decodedCorrectAnswer = decode(q.correct_answer);
                const decodedIncorrectAnswers = q.incorrect_answers.map(
                  (a: string) => decode(a)
                );

                const allOptions = shuffleArray([
                  decodedCorrectAnswer,
                  ...decodedIncorrectAnswers,
                ]);

                return {
                  question: decodedQuestion,
                  options: allOptions,
                  correctAnswer: decodedCorrectAnswer,
                };
              }
            );
            setQuestions(formattedQuestions);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
          setQuestions([]); 
        } finally {
          setIsLoading(false);
        }
      };

      fetchQuestions();

    }, [category, setScore])
  );

  const currentQuestion = questions[currentQuestionIndex];

  // --- Event Handlers ---

  function handleSelection(index: number): void {
    if (selected !== null) return; 
    setSelected(index);
    const selectedOption = currentQuestion.options[index];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev: number) => prev + 1);
    }
  }

  const handleCheckScore = (): void => {
    router.push({
      pathname: "/finalScore",
      params: { category: category },
    });
  };

  const handleNext = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelected(null);
    } else {
      handleCheckScore();
    }
  };

  // --- Render Logic ---

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
        <Text style={[styles.text, { textAlign: "center" }]}>
          Could not load questions for this category. Please try again.
        </Text>
        <NextButton onPress={() => router.back()} title="Try Another Category" />
      </SafeAreaView>
    );
  }

  // Use SafeAreaView for the main quiz view as well
  return (
    <View style={styles.container}>
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
        {currentQuestion.options.map((option: string, index: number) => {
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
                  styles.optionTextContent,
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
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.primaryDark,
  },
  centerAll: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryDark,
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
    flexWrap: "wrap",
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