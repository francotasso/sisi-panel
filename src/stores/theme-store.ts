import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("sisi_theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("sisi_theme", theme);
}

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getInitialTheme();
  if (typeof window !== "undefined") applyTheme(initial);

  return {
    theme: initial,
    setTheme: (theme: Theme) => {
      applyTheme(theme);
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const next = state.theme === "light" ? "dark" : "light";
        applyTheme(next);
        return { theme: next };
      });
    },
  };
});
