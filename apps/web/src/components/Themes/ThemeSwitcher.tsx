// "use client";

// import { Button } from "@repo/ui/button";

// const ThemeSwitch = () => {
//   const theme = "light"; // <- TODO: Get the theme from the context

//   return (
//     <Button>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</Button>
//   );
// };

// export default ThemeSwitch;

"use client";

import { useTheme } from "./ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

