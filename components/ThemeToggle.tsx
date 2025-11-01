"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  const current = mounted ? (theme === "system" ? systemTheme : resolvedTheme) : "light";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => setTheme(current === "dark" ? "light" : "dark")}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <span className="inline-flex h-4 w-4 items-center justify-center">
          {/* Sun / Moon glyph swap */}
          {current === "dark" ? (
            // Sun for dark (tap to go light)
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0 4a1 1 0 0 1-1-1v-1.25a1 1 0 1 1 2 0V21a1 1 0 0 1-1 1Zm0-18a1 1 0 0 1-1-1V1.75a1 1 0 1 1 2 0V3a1 1 0 0 1-1 1Zm11 7h-1.25a1 1 0 1 1 0-2H23a1 1 0 1 1 0 2Zm-18 0H1.75a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2Zm14.95 7.778-0.884-0.884a1 1 0 0 1 1.414-1.414l0.884 0.884a1 1 0 1 1-1.414 1.414Zm-12.132-12.132-0.884-0.884a1 1 0 1 1 1.414-1.414l0.884 0.884a1 1 0 1 1-1.414 1.414Zm12.132 0a1 1 0 0 1-1.414-1.414l0.884-0.884a1 1 0 1 1 1.414 1.414l-0.884 0.884ZM5.818 19.778a1 1 0 1 1-1.414-1.414l0.884-0.884a1 1 0 1 1 1.414 1.414l-0.884 0.884Z" />
            </svg>
          ) : (
            // Moon for light (tap to go dark)
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M21.752 15.002A9 9 0 1 1 9 2.248 7 7 0 1 0 21.752 15.002Z" />
            </svg>
          )}
        </span>
        <span className="hidden sm:inline">
          {current === "dark" ? "Light" : "Dark"}
        </span>
      </button>

      {/* Optional system switch */}
      <button
        type="button"
        onClick={() => setTheme("system")}
        className="inline-flex items-center rounded-full border border-slate-300 bg-white/70 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        title="Use system theme"
      >
        System
      </button>
    </div>
  );
}
