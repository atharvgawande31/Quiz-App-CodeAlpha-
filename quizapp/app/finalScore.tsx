import { View, Text } from "react-native";
import { useScore } from "@/hooks/score";

export default function FinalScorePage() {
  const { score, setScore } = useScore();

  return (
    <View>
      <Text style={{fontSize: 48}}>{score}</Text>
    </View>
  );
}
