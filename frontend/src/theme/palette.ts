import type { PaletteOptions, PaletteMode } from "@mui/material/styles";

const getPalette = (mode: PaletteMode): PaletteOptions => ({
  mode,
  ...(mode === "light"
    ? {
        primary: {
          main: "#c47a4d",
          light: "#d99973",
          dark: "#a05f37",
          contrastText: "#fdfaf6",
        },
        secondary: {
          main: "#a88a55",
          light: "#c2a674",
          dark: "#86683d",
          contrastText: "#fdfaf6",
        },
        background: {
          default: "#fdfaf6",
          paper: "#ffffff",
        },
        text: {
          primary: "#1f1a16",
          secondary: "#5a4e44",
          disabled: "#a89789",
        },
        divider: "rgba(31, 26, 22, 0.1)",
        error: { main: "#c4543f" },
        warning: { main: "#c98a2a" },
        info: { main: "#5a8aa0" },
        success: { main: "#6a9a65" },
      }
    : {
        primary: {
          main: "#e8a87c",
          light: "#f0bd99",
          dark: "#c98660",
          contrastText: "#1a1714",
        },
        secondary: {
          main: "#c9a96e",
          light: "#d9bd87",
          dark: "#a88a55",
          contrastText: "#1a1714",
        },
        background: {
          default: "#1a1714",
          paper: "#221e1a",
        },
        text: {
          primary: "#f5ede3",
          secondary: "#a89789",
          disabled: "#6b5d52",
        },
        divider: "rgba(245, 237, 227, 0.08)",
        error: { main: "#e07b6a" },
        warning: { main: "#e8b04c" },
        info: { main: "#8ab4c9" },
        success: { main: "#8fb98a" },
      }),
});

export default getPalette;
