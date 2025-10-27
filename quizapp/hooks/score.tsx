// hooks/useScore.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type ScoreContextType = {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  resetScore: () => void;
};

// Create the context
const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

// Provider component
export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);

  const resetScore = () => setScore(0);

  return (
    <ScoreContext.Provider value={{ score, setScore, resetScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

// Custom hook
export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error("useScore must be used inside a ScoreProvider");
  }
  return context;
};