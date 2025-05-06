import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

export default function ThemeToggle() {
  let isDark = getCookie("isDark");
  const [isDarkMode, setIsDarkMode] = useState(
    isDark === "true" ? isDark : false
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center">
      <button
        onClick={() => {
          isDarkMode
            ? setCookie("isDark", "false", 10000)
            : setCookie("isDark", "true", 10000);
          setIsDarkMode(!isDarkMode);
        }}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isDarkMode ? "bg-slate-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`${
            isDarkMode ? "translate-x-8" : "translate-x-1"
          } inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform duration-200 ease-in-out`}
        >
          {isDarkMode ? (
            <Moon className="h-3 w-3 text-slate-800" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
}
