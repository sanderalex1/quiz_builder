import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router";

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Page not found.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
