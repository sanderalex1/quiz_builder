import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { QuestionType } from "../types/quiz";
import { useParams } from "react-router";
import { useGetQuizByIdQuery } from "../services/endpoints";
import { QuestionTypeChip } from "../components";

const QuizDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: quiz, isLoading } = useGetQuizByIdQuery(id);

  if (isLoading) {
    return (
      <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Quiz Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {quiz?.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                {quiz?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>
        </Grid>
        {quiz?.questions.map((question) => (
          <Grid size={{ xs: 12 }} key={question.id}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" gutterBottom>
                    Question {question.position + 1}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {question.text}
                  </Typography>
                  <Box>
                    <QuestionTypeChip type={question.type} />
                  </Box>
                  <Divider />
                  <Typography variant="h6" gutterBottom>
                    Answers
                  </Typography>
                  {question.type === QuestionType.MultipleChoice && (
                    <Stack direction="column" spacing={2}>
                      {question.answers.map((answer) => (
                        <Stack direction="row" spacing={2} key={answer.id}>
                          <Typography variant="body1" gutterBottom key={answer.id}>
                            {answer.text}
                          </Typography>
                          {answer.isCorrect && (
                            <Chip
                              size="small"
                              label={answer.isCorrect ? "Correct" : "Incorrect"}
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  )}
                  {question.type === QuestionType.TrueFalse && (
                    <Typography variant="body1" gutterBottom>
                      {question.answers.find((a) => a.isCorrect)?.text}
                    </Typography>
                  )}
                  {question.type === QuestionType.SingleText && (
                    <Typography variant="body1" gutterBottom>
                      {question.answers.find((a) => a.isCorrect)?.text}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuizDetailPage;
