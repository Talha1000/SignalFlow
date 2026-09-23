"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("signalflow_theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    localStorage.setItem("signalflow_theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("signalflow_theme", t);
    document.documentElement.classList.toggle("light", t === "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
