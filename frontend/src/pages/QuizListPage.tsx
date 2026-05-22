import { Typography, CircularProgress, Grid } from "@mui/material";
import { useGetQuizzesQuery } from "../services/endpoints";
import { QuizCard } from "../components";

const QuizListPage = () => {
  const { data: quizzes, isLoading } = useGetQuizzesQuery();

  if (isLoading) {
    return (
      <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <Grid container spacing={2} sx={{ py: 4 }}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h3" gutterBottom>
          Quizzes
        </Typography>
      </Grid>
      {quizzes?.map((quiz) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={quiz.id}>
          <QuizCard quiz={quiz} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuizListPage;
