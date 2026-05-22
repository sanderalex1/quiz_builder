import { createTheme } from "@mui/material/styles";
import { typography } from "./typography";
import { breakpoints } from "./breakpoints";
import { components } from "./components";
import { getPalette } from "./palette";
import type { PaletteMode } from "@mui/material/styles";

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: getPalette(mode),
    typography,
    breakpoints,
    components,
    shape: { borderRadius: 4 },
  });
