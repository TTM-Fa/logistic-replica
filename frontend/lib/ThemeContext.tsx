"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * ThemeContext — global light/dark theme state.
 *
 * Strategy:
 *   - The current theme is mirrored as `data-theme="light|dark"` on the
 *     <html> element, so CSS can target it via [data-theme="dark"] selectors.
 *   - Preference is persisted in localStorage so it survives page reloads.
 *   - On first load, we respect the user's OS-level preference if they
 *     haven't picked one in our app yet.
 *   - To avoid the brief white flash that would happen if we waited for
 *     React to hydrate before applying the theme, the actual <html>
 *     attribute is set by a tiny inline script in app/layout.tsx that
 *     runs BEFORE React mounts.
 */

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to "light" during SSR. We sync to the actual value once mounted
  // (the inline script in layout.tsx already painted the correct theme).
  const [theme, setThemeState] = useState<Theme>("light");

  // On mount, read the *actual* theme that the inline script applied to
  // the document, so React state matches what the user sees.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark") setThemeState("dark");
  }, []);

  // Whenever React state changes (user clicked the toggle), update the DOM
  // attribute and persist the choice.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      // localStorage might be unavailable (private browsing) — ignore.
    }
  }, [theme]);

  const toggle = () => setThemeState((t) => (t === "light" ? "dark" : "light"));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
