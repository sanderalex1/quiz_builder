import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router";

const HomePage = () => {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Quiz Builder
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create, manage, and take quizzes with ease.
      </Typography>
      <Button component={RouterLink} to="/quizzes" variant="contained" size="large">
        Browse Quizzes
      </Button>
    </Box>
  );
};

export default HomePage;
