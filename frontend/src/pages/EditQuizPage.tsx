import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";

export default function EditQuizPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Edit Quiz
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Editing quiz: {id}
      </Typography>
    </Box>
  );
}
