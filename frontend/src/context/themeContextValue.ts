import { createContext } from "react";
import type { PaletteMode } from "@mui/material/styles";

export interface ThemeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  toggleMode: () => {},
});
