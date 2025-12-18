import React, { createContext, useContext, useState, useMemo, useEffect } from 'https://aistudiocdn.com/react@^19.2.0';
import { THEMES, FONTS } from '../theme.js';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('app-theme') || THEMES[0].name;
  });
  const [font, setFont] = useState(() => {
    return localStorage.getItem('app-font') || FONTS[0];
  });

  useEffect(() => {
    localStorage.setItem('app-theme', themeName);
  }, [themeName]);

  useEffect(() => {
    localStorage.setItem('app-font', font);
  }, [font]);
  
  const theme = useMemo(() => THEMES.find(t => t.name === themeName) || THEMES[0], [themeName]);
  
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: setThemeName,
    font: FONTS.includes(font) ? `"${font}", sans-serif` : 'sans-serif',
    setFont,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};