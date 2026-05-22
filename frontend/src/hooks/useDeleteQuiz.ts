import { useState } from "react";
import { deleteQuiz } from "../api/quizApi";

export const useDeleteQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteQuiz(id);
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
