"use client";

import { useEffect, useState, type FC } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ThemeToggle: FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;

    // Enable transition on all elements
    root.style.setProperty("--theme-transition", "1");
    document.body.classList.add("theme-transitioning");

    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove("theme-transitioning");
    }, 500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="size-9 rounded-full"
      aria-label="Toggle theme"
    >
      <SunIcon className="size-4 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
};
