import type { TypographyVariantsOptions } from "@mui/material/styles";

const sans = '"Inter Variable", system-ui, -apple-system, sans-serif';
const serif = '"Fraunces Variable", Georgia, "Times New Roman", serif';

const typography: TypographyVariantsOptions = {
  fontFamily: sans,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,

  h1: {
    fontFamily: serif,
    fontSize: "3.5rem",
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily: serif,
    fontSize: "2.75rem",
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: "-0.015em",
  },
  h3: {
    fontFamily: serif,
    fontSize: "2rem",
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontFamily: serif,
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h5: {
    fontFamily: sans,
    fontSize: "1.25rem",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  h6: { fontFamily: sans, fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 },

  subtitle1: { fontSize: "1.125rem", fontWeight: 400, lineHeight: 1.5 },
  subtitle2: { fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.6 },
  button: {
    fontSize: "0.95rem",
    fontWeight: 500,
    letterSpacing: "0.01em",
    textTransform: "none",
  },
  caption: { fontSize: "0.8rem", fontWeight: 400, lineHeight: 1.5 },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
};

export default typography;
