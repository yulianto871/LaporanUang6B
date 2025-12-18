import React, { createContext, useContext, useState, useMemo, useEffect } from 'https://aistudiocdn.com/react@^19.2.0';
import { Theme, Font } from '../types.ts';
import { THEMES, FONTS } from '../theme.ts';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeName: string) => void;
  font: string;
  setFont: (font: Font) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('app-theme') || THEMES[0].name;
  });
  const [font, setFont] = useState<Font>(() => {
    return (localStorage.getItem('app-font') as Font) || FONTS[0];
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
      // FIX: Cast value to string to fix: Argument of type 'unknown' is not assignable to parameter of type 'string'.
      root.style.setProperty(cssVarName, value as string);
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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};