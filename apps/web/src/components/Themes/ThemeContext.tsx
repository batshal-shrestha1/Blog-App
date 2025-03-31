// "use client";

// import { createContext } from "react";

// export type Theme = "light" | "dark";

// interface ThemeContextProps {
//   theme: Theme;
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// // TODOS:
// // 1. Create Theme Provider
// // 2. Create useTheme hook
// // 3. Use the provider in your layout

"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get the initial theme from localStorage or default to "light"
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    // Update the `data-theme` attribute on the `<html>` element
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Persist the theme in localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
