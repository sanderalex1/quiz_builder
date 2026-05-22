import api from "../api";
import type { Quiz, QuizListItem, CreateQuizInput } from "../../types/quiz";

const tags = ["quiz"];

export const quizApi = api.enhanceEndpoints({ addTagTypes: tags }).injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<QuizListItem[], void>({
      query: () => "/quizzes",
      transformResponse: (response: { data: QuizListItem[] }) => response.data,
      providesTags: tags,
    }),
    getQuizById: builder.query<Quiz, string>({
      query: (id) => `/quizzes/${id}`,
      providesTags: tags,
    }),
    createQuiz: builder.mutation<Quiz, CreateQuizInput>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: tags,
    }),
    deleteQuiz: builder.mutation<void, string>({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: tags,
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useDeleteQuizMutation,
} = quizApi;
