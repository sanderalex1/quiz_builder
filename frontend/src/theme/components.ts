import type { Components, Theme } from "@mui/material/styles";

const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 10, paddingInline: 18, paddingBlock: 9 },
      sizeLarge: { paddingInline: 24, paddingBlock: 12 },
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: "none" },
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: "transparent" },
  },
  MuiTextField: {
    defaultProps: { variant: "outlined", size: "small" },
  },
  MuiLink: {
    defaultProps: { underline: "hover" },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: { fontSize: "0.8rem", borderRadius: 6 },
    },
  },
};

export default components;
