"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
  attribute?: "class" | "data-theme";
  defaultTheme?: "system" | "light" | "dark";
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
}: Props) {
  return (
    <NextThemesProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
