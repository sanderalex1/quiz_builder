import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout";
import {
  HomePage,
  QuizListPage,
  QuizDetailPage,
  CreateQuizPage,
  NotFoundPage,
} from "./pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "quizzes", element: <QuizListPage /> },
      { path: "quizzes/create", element: <CreateQuizPage /> },
      { path: "quizzes/:id", element: <QuizDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
