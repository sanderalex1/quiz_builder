import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import QuizListPage from "./pages/QuizListPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import EditQuizPage from "./pages/EditQuizPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "quizzes", element: <QuizListPage /> },
      { path: "quizzes/create", element: <CreateQuizPage /> },
      { path: "quizzes/:id", element: <QuizDetailPage /> },
      { path: "quizzes/:id/edit", element: <EditQuizPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
