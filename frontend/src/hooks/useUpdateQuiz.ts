import { useState } from "react";
import { updateQuiz } from "../api/quizApi";
import type { UpdateQuizInput, Quiz } from "../types/quiz";

export const useUpdateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string, input: UpdateQuizInput): Promise<Quiz | null> => {
    setLoading(true);
    setError(null);
    try {
      return await updateQuiz(id, input);
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
