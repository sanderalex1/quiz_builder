import { useState } from "react";
import { createQuiz } from "../api/quizApi";
import type { CreateQuizInput, Quiz } from "../types/quiz";

export const useCreateQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: CreateQuizInput): Promise<Quiz | null> => {
    setLoading(true);
    setError(null);
    try {
      return await createQuiz(input);
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
