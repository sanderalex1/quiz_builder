import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import { Link } from "react-router";
import { useQuizzes } from "../hooks/useQuizzes";
import QuizCard from "./QuizCard";

const QuizList = () => {
  const { data: quizzes, loading, error } = useQuizzes();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", pt: 8 }}>
        Failed to load quizzes: {error.message}
      </Typography>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", pt: 8 }}>
        No quizzes yet. Create your first one!
      </Typography>
    );
  }

  return (
    <Grid container spacing={4} sx={{ pt: 8, justifyContent: "center" }}>
      {quizzes.map((quiz) => (
        <Grid size={{ xs: 12, sm: 8, md: 6 }} key={quiz.id}>
          <Link to={`/quizzes/${quiz.id}`} style={{ textDecoration: "none" }}>
            <QuizCard quiz={quiz} />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuizList;
