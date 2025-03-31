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
      className="p-2 border rounded"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
