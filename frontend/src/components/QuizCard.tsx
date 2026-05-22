import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import type { QuizListItem } from "../types/quiz";

type Props = {
  quiz: QuizListItem;
};

const QuizCard = ({ quiz }: Props) => {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" component="h2">
            {quiz.title}
          </Typography>
          <Chip
            label={`${quiz._count.questions} questions`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        {quiz.description && (
          <Typography variant="body2" color="text.secondary">
            {quiz.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizCard;
