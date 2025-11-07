import { useState, useEffect } from "react";

// --- Types ---
interface ApiCategory {
  id: number;
  name: string;
}

export interface StyledCategory extends ApiCategory {
  icon: string;
  color: string;
  gradient: string[];
  displayName: string;
}

// --- Styles (Move this to a constants file if you prefer) ---
const categoryStyles: Record<number, { icon: string; color: string; gradient: string[] }> = {
  9: { icon: "globe", color: "#4E89AE", gradient: ["#4E89AE", "#5A9BCE"] },
  10: { icon: "book", color: "#C0392B", gradient: ["#C0392B", "#E74C3C"] },
  11: { icon: "film", color: "#2C3E50", gradient: ["#2C3E50", "#34495E"] },
  12: { icon: "music", color: "#8E44AD", gradient: ["#8E44AD", "#9B59B6"] },
  14: { icon: "tv", color: "#2980B9", gradient: ["#2980B9", "#3498DB"] },
  15: { icon: "gamepad", color: "#D35400", gradient: ["#D35400", "#E67E22"] },
  17: { icon: "flask", color: "#27AE60", gradient: ["#27AE60", "#FF6B35"] },
  18: { icon: "laptop", color: "#3498DB", gradient: ["#3498DB", "#5DADE2"] },
  21: { icon: "futbol-o", color: "#16A085", gradient: ["#16A085", "#1ABC9C"] },
  22: { icon: "map-marker", color: "#F1C40F", gradient: ["#F1C40F", "#F39C12"] },
  23: { icon: "hourglass-start", color: "#795548", gradient: ["#795548", "#8D6E63"] },
  27: { icon: "paw", color: "#324285ff", gradient: ["#324285ff", "#4A6FA5"] },
};

const getCategoryStyle = (id: number) => {
  return categoryStyles[id] || { icon: "question-circle", color: "#7F8C8D", gradient: ["#7F8C8D", "#95A5A6"] };
};


// --- The Hook ---
export const useCategories = () => {
  const [categories, setCategories] = useState<StyledCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://opentdb.com/api_category.php");
        const data: { trivia_categories: ApiCategory[] } = await response.json();

        const filteredCategories = data.trivia_categories
          .filter((cat) => categoryStyles.hasOwnProperty(cat.id.toString()))
          .map((cat) => {
            const style = getCategoryStyle(cat.id);
            return {
              ...cat,
              icon: style.icon,
              color: style.color,
              gradient: style.gradient,
              displayName: cat.name
                .replace("Entertainment: ", "")
                .replace("Science: ", ""),
            };
          });

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading };
};