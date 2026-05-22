import { createTheme } from "@mui/material/styles";
import breakpoints from "./breakpoints";
import components from "./components";
import getPalette from "./palette";
import type { PaletteMode } from "@mui/material/styles";

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: getPalette(mode),
    breakpoints,
    components,
    shape: { borderRadius: 4 },
  });
