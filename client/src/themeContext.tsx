import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
interface IProviderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}
export const ThemeContext = createContext<IProviderProps>({
  isDarkMode: false,
  toggleTheme: () => {},
});
type Props = {
  /**
   * A React component.
   */
  children?: React.ReactNode;
};
export const ThemeProvider = ({ children }: Props) => {
  const mediaQueryObj = window.matchMedia("(prefers-color-scheme: dark)");
  const browserPreference = mediaQueryObj.matches ? "dark" : "light";
  const [isDarkMode, setIsDarkMode] = useState(
    browserPreference === "dark" ? true : false,
  );

  useEffect(() => {
    document.body.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? false : true;
    setIsDarkMode(newTheme);
  };

  const themeValue: IProviderProps = {
    isDarkMode: isDarkMode,
    toggleTheme: toggleTheme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
