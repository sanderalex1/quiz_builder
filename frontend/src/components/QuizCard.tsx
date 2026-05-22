import { useState } from "react";
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material";
import { useDeleteQuizMutation } from "../services/endpoints";
import { useNavigate } from "react-router";
import type { FC } from "react";
import type { QuizListItem } from "../types/quiz";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface QuizCardProps {
  quiz: QuizListItem;
}

const QuizCard: FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [open, setOpen] = useState(false);

  const handleView = () => {
    navigate(`/quizzes/${quiz.id}`);
  };

  const handleDelete = async () => {
    await deleteQuiz(quiz.id);
    setOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {quiz.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {quiz.description}
          </Typography>
          <Typography variant="caption" gutterBottom>
            {quiz._count.questions} questions
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<InfoIcon />}
            onClick={handleView}
          >
            View
          </Button>
          <Button
            color="primary"
            startIcon={<DeleteIcon />}
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <ConfirmDeleteModal
        open={open}
        title="Delete quiz?"
        description={`"${quiz.title}" will be permanently removed.`}
        confirmLabel="Delete"
        onDelete={handleDelete}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default QuizCard;
