import { useState, useEffect } from "react";
import { getQuizzes } from "../api/quizApi";
import type { QuizListItem } from "../types/quiz";

export const useQuizzes = () => {
  const [data, setData] = useState<QuizListItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Bumping this triggers a refetch
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getQuizzes()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { data, loading, error, reload };
};
