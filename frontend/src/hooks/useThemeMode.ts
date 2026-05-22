import { useContext } from "react";
import { ThemeContext } from "../context/themeContextValue";

const useThemeMode = () => useContext(ThemeContext);

export default useThemeMode;
