import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Quiz Detail
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Viewing quiz: {id}
      </Typography>
    </Box>
  );
}
