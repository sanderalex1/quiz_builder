import { Outlet, Link as RouterLink } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../hooks";
import Notification from "./Notification";

const RootLayout = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Notification />
      <AppBar position="sticky" sx={{ backdropFilter: "blur(8px)" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            Quiz Builder
          </Typography>
          <Button color="inherit" component={RouterLink} to="/quizzes">
            Quizzes
          </Button>
          <Button color="inherit" component={RouterLink} to="/quizzes/create">
            Create
          </Button>
          <IconButton color="inherit" onClick={toggleMode} sx={{ ml: 1 }}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default RootLayout;
