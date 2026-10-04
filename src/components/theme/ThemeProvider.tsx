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

  const applyTheme = (t: Theme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      if (body) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
      }
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      if (body) {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || localStorage.getItem("signalflow_theme");
    const initialTheme: Theme = saved === "light" ? "light" : "dark";
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    try {
      localStorage.setItem("theme", next);
      localStorage.setItem("signalflow_theme", next);
    } catch (e) {}
    applyTheme(next);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem("theme", t);
      localStorage.setItem("signalflow_theme", t);
    } catch (e) {}
    applyTheme(t);
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
