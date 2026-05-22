import type { CreateQuizInput, UpdateQuizInput, Quiz, QuizListItem } from "../types/quiz";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const getQuizzes = () => request<QuizListItem[]>("/quizzes");

export const getQuizById = (id: string) => request<Quiz>(`/quizzes/${id}`);

export const createQuiz = (data: CreateQuizInput) =>
  request<Quiz>("/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateQuiz = (id: string, data: UpdateQuizInput) =>
  request<Quiz>(`/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteQuiz = (id: string) =>
  request<null>(`/quizzes/${id}`, { method: "DELETE" });
