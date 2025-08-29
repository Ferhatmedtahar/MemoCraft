"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "blue"
  | "white"
  | "pink"
  | "green"
  | "purple"
  | "orange"
  | "dark"
  | "slate"
  | "teal"
  | "amber"
  | "crimson"
  | "emerald"
  | "cyber"
  | "matrix";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs = {
  blue: {
    name: "Ocean Blue",
    primary: "oklch(0.5 0.2 240)", // Blue
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.85 0.05 240)", // Light blue
    secondaryForeground: "oklch(0.2 0.1 240)", // Dark blue
    background: "oklch(0.98 0.01 240)", // Very light blue
    foreground: "oklch(0.15 0.1 240)", // Dark blue text
    accent: "oklch(0.6 0.15 240)", // Medium blue
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.08 240)", // Light blue border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.15 0.1 240)", // Card text (dark blue)
    mutedForeground: "oklch(0.5 0.05 240)", // Muted text
    shadow: "0 4px 0 0 oklch(0.3 0.15 240)", // Dark blue shadow
    chartFirst: "oklch(0.55 0.25 240)", // Vibrant blue
    chartSecond: "oklch(0.7 0.15 220)", // Light blue-purple
  },
  white: {
    name: "Clean White",
    primary: "oklch(0.2 0.02 240)", // Very dark gray
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.95 0.01 240)", // Very light gray
    secondaryForeground: "oklch(0.2 0.02 240)", // Dark gray
    background: "oklch(1 0 0)", // Pure white
    foreground: "oklch(0.1 0.01 240)", // Almost black
    accent: "oklch(0.85 0.02 240)", // Light gray
    accentForeground: "oklch(0.2 0.02 240)", // Dark gray
    border: "oklch(0.8 0.01 240)", // Light gray border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.1 0.01 240)", // Card text (almost black)
    mutedForeground: "oklch(0.5 0.01 240)", // Muted text
    shadow: "0 4px 0 0 oklch(0.6 0.01 240)", // Gray shadow
    chartFirst: "oklch(0.35 0.08 240)", // Dark gray-blue
    chartSecond: "oklch(0.65 0.05 240)", // Medium gray
  },
  pink: {
    name: "Bubblegum Pink",
    primary: "oklch(0.65 0.25 340)", // Pink
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.9 0.1 340)", // Light pink
    secondaryForeground: "oklch(0.25 0.15 340)", // Dark pink
    background: "oklch(0.98 0.02 340)", // Very light pink
    foreground: "oklch(0.2 0.1 340)", // Dark pink text
    accent: "oklch(0.7 0.2 340)", // Medium pink
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.8 0.12 340)", // Light pink border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.2 0.1 340)", // Card text (dark pink)
    mutedForeground: "oklch(0.5 0.1 340)", // Muted text
    shadow: "0 4px 0 0 oklch(0.4 0.2 340)", // Dark pink shadow
    chartFirst: "oklch(0.7 0.28 340)", // Vibrant pink
    chartSecond: "oklch(0.75 0.2 360)", // Rose pink
  },
  green: {
    name: "Forest Green",
    primary: "oklch(0.5 0.15 140)", // Green
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.85 0.07 140)", // Light green
    secondaryForeground: "oklch(0.25 0.12 140)", // Dark green
    background: "oklch(0.98 0.01 140)", // Very light green
    foreground: "oklch(0.2 0.1 140)", // Dark green text
    accent: "oklch(0.6 0.12 140)", // Medium green
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 140)", // Light green border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.2 0.1 140)", // Card text (dark green)
    mutedForeground: "oklch(0.5 0.08 140)", // Muted text
    shadow: "0 4px 0 0 oklch(0.3 0.12 140)", // Dark green shadow
    chartFirst: "oklch(0.6 0.18 140)", // Forest green
    chartSecond: "oklch(0.7 0.15 120)", // Yellow-green
  },
  purple: {
    name: "Royal Purple",
    primary: "oklch(0.5 0.2 280)", // Purple
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.85 0.08 280)", // Light purple
    secondaryForeground: "oklch(0.25 0.15 280)", // Dark purple
    background: "oklch(0.98 0.01 280)", // Very light purple
    foreground: "oklch(0.2 0.12 280)", // Dark purple text
    accent: "oklch(0.6 0.15 280)", // Medium purple
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 280)", // Light purple border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.2 0.12 280)", // Card text (dark purple)
    mutedForeground: "oklch(0.5 0.1 280)", // Muted text
    shadow: "0 4px 0 0 oklch(0.3 0.15 280)", // Dark purple shadow
    chartFirst: "oklch(0.6 0.22 280)", // Royal purple
    chartSecond: "oklch(0.65 0.18 300)", // Violet
  },
  orange: {
    name: "Sunset Orange",
    primary: "oklch(0.6 0.18 50)", // Orange
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.9 0.08 50)", // Light orange
    secondaryForeground: "oklch(0.25 0.12 50)", // Dark orange
    background: "oklch(0.98 0.01 50)", // Very light orange
    foreground: "oklch(0.2 0.1 50)", // Dark orange text
    accent: "oklch(0.65 0.15 50)", // Medium orange
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 50)", // Light orange border
    card: "oklch(1 0 0)", // Card background (white)
    cardForeground: "oklch(0.2 0.1 50)", // Card text (dark orange)
    mutedForeground: "oklch(0.5 0.08 50)", // Muted text
    shadow: "0 4px 0 0 oklch(0.35 0.15 50)", // Dark orange shadow
    chartFirst: "oklch(0.65 0.2 50)", // Sunset orange
    chartSecond: "oklch(0.7 0.18 30)", // Warm coral
  },
  dark: {
    name: "Midnight Dark",
    primary: "oklch(0.8 0.1 240)", // Light blue accent
    primaryForeground: "oklch(0.1 0.05 240)", // Dark blue-gray
    secondary: "oklch(0.15 0.02 240)", // Dark gray
    secondaryForeground: "oklch(0.9 0.05 240)", // Light gray
    background: "oklch(0.08 0.01 240)", // Very dark gray
    foreground: "oklch(0.95 0.02 240)", // Almost white
    accent: "oklch(0.7 0.15 240)", // Blue accent
    accentForeground: "oklch(0.1 0.05 240)", // Dark text
    border: "oklch(0.25 0.02 240)", // Dark border
    card: "oklch(0.12 0.01 240)", // Dark card background
    cardForeground: "oklch(0.95 0.02 240)", // Light card text
    mutedForeground: "oklch(0.6 0.02 240)", // Muted text
    shadow: "0 4px 0 0 oklch(0.35 0.08 240)", // Visible shadow - much lighter
    chartFirst: "oklch(0.75 0.12 240)", // Bright blue
    chartSecond: "oklch(0.65 0.15 200)", // Cyan blue
  },
  cyber: {
    name: "Cyber Dark",
    primary: "oklch(0.75 0.18 320)", // Bright magenta
    primaryForeground: "oklch(0.05 0.02 320)", // Very dark
    secondary: "oklch(0.18 0.03 320)", // Dark purple-gray
    secondaryForeground: "oklch(0.85 0.08 320)", // Light purple-gray
    background: "oklch(0.06 0.02 320)", // Very dark with purple tint
    foreground: "oklch(0.92 0.05 320)", // Light with purple tint
    accent: "oklch(0.65 0.2 320)", // Vibrant purple
    accentForeground: "oklch(0.05 0.02 320)", // Dark text
    border: "oklch(0.22 0.04 320)", // Purple border
    card: "oklch(0.1 0.02 320)", // Dark card with purple tint
    cardForeground: "oklch(0.92 0.05 320)", // Light card text
    mutedForeground: "oklch(0.55 0.04 320)", // Muted purple
    shadow: "0 4px 0 0 oklch(0.35 0.15 320)", // Visible purple shadow
    chartFirst: "oklch(0.8 0.2 320)", // Electric magenta
    chartSecond: "oklch(0.7 0.25 340)", // Hot pink
  },
  matrix: {
    name: "Matrix Dark",
    primary: "oklch(0.7 0.2 140)", // Bright green
    primaryForeground: "oklch(0.05 0.02 140)", // Very dark
    secondary: "oklch(0.16 0.03 140)", // Dark green-gray
    secondaryForeground: "oklch(0.82 0.08 140)", // Light green-gray
    background: "oklch(0.04 0.02 140)", // Almost black with green tint
    foreground: "oklch(0.88 0.06 140)", // Light green tint
    accent: "oklch(0.6 0.18 140)", // Matrix green
    accentForeground: "oklch(0.05 0.02 140)", // Dark text
    border: "oklch(0.2 0.04 140)", // Green border
    card: "oklch(0.08 0.02 140)", // Dark card with green tint
    cardForeground: "oklch(0.88 0.06 140)", // Light card text
    mutedForeground: "oklch(0.52 0.05 140)", // Muted green
    shadow: "0 4px 0 0 oklch(0.3 0.12 140)", // Visible green shadow
    chartFirst: "oklch(0.75 0.22 140)", // Matrix green
    chartSecond: "oklch(0.65 0.18 160)", // Jade green
  },
  slate: {
    name: "Professional Slate",
    primary: "oklch(0.45 0.08 240)", // Slate blue
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.85 0.02 240)", // Light slate
    secondaryForeground: "oklch(0.3 0.05 240)", // Dark slate
    background: "oklch(0.97 0.01 240)", // Off-white with slate tint
    foreground: "oklch(0.2 0.05 240)", // Dark slate text
    accent: "oklch(0.55 0.1 240)", // Medium slate
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.03 240)", // Slate border
    card: "oklch(1 0 0)", // White card
    cardForeground: "oklch(0.2 0.05 240)", // Dark slate text
    mutedForeground: "oklch(0.5 0.03 240)", // Muted slate
    shadow: "0 4px 0 0 oklch(0.35 0.08 240)", // Slate shadow
    chartFirst: "oklch(0.5 0.1 240)", // Professional blue
    chartSecond: "oklch(0.6 0.08 220)", // Steel blue
  },
  teal: {
    name: "Ocean Teal",
    primary: "oklch(0.55 0.18 180)", // Teal
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.88 0.08 180)", // Light teal
    secondaryForeground: "oklch(0.25 0.12 180)", // Dark teal
    background: "oklch(0.98 0.01 180)", // Very light teal
    foreground: "oklch(0.2 0.1 180)", // Dark teal text
    accent: "oklch(0.65 0.15 180)", // Medium teal
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 180)", // Teal border
    card: "oklch(1 0 0)", // White card
    cardForeground: "oklch(0.2 0.1 180)", // Dark teal text
    mutedForeground: "oklch(0.5 0.08 180)", // Muted teal
    shadow: "0 4px 0 0 oklch(0.35 0.15 180)", // Dark teal shadow
    chartFirst: "oklch(0.6 0.2 180)", // Ocean teal
    chartSecond: "oklch(0.7 0.15 200)", // Aqua blue
  },
  amber: {
    name: "Golden Amber",
    primary: "oklch(0.65 0.15 80)", // Amber
    primaryForeground: "oklch(0.1 0.05 80)", // Dark amber text
    secondary: "oklch(0.9 0.08 80)", // Light amber
    secondaryForeground: "oklch(0.25 0.12 80)", // Dark amber
    background: "oklch(0.98 0.02 80)", // Very light amber
    foreground: "oklch(0.2 0.1 80)", // Dark amber text
    accent: "oklch(0.7 0.12 80)", // Medium amber
    accentForeground: "oklch(0.1 0.05 80)", // Dark text
    border: "oklch(0.75 0.1 80)", // Amber border
    card: "oklch(1 0 0)", // White card
    cardForeground: "oklch(0.2 0.1 80)", // Dark amber text
    mutedForeground: "oklch(0.5 0.08 80)", // Muted amber
    shadow: "0 4px 0 0 oklch(0.4 0.12 80)", // Dark amber shadow
    chartFirst: "oklch(0.7 0.18 80)", // Golden amber
    chartSecond: "oklch(0.75 0.15 60)", // Honey gold
  },
  crimson: {
    name: "Deep Crimson",
    primary: "oklch(0.55 0.2 20)", // Crimson red
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.88 0.08 20)", // Light crimson
    secondaryForeground: "oklch(0.25 0.15 20)", // Dark crimson
    background: "oklch(0.98 0.01 20)", // Very light crimson
    foreground: "oklch(0.2 0.12 20)", // Dark crimson text
    accent: "oklch(0.65 0.18 20)", // Medium crimson
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 20)", // Crimson border
    card: "oklch(1 0 0)", // White card
    cardForeground: "oklch(0.2 0.12 20)", // Dark crimson text
    mutedForeground: "oklch(0.5 0.1 20)", // Muted crimson
    shadow: "0 4px 0 0 oklch(0.35 0.18 20)", // Dark crimson shadow
    chartFirst: "oklch(0.6 0.22 20)", // Deep crimson
    chartSecond: "oklch(0.65 0.2 0)", // Ruby red
  },
  emerald: {
    name: "Emerald Green",
    primary: "oklch(0.55 0.18 160)", // Emerald
    primaryForeground: "oklch(1 0 0)", // White
    secondary: "oklch(0.88 0.08 160)", // Light emerald
    secondaryForeground: "oklch(0.25 0.12 160)", // Dark emerald
    background: "oklch(0.98 0.01 160)", // Very light emerald
    foreground: "oklch(0.2 0.1 160)", // Dark emerald text
    accent: "oklch(0.65 0.15 160)", // Medium emerald
    accentForeground: "oklch(1 0 0)", // White
    border: "oklch(0.75 0.1 160)", // Emerald border
    card: "oklch(1 0 0)", // White card
    cardForeground: "oklch(0.2 0.1 160)", // Dark emerald text
    mutedForeground: "oklch(0.5 0.08 160)", // Muted emerald
    shadow: "0 4px 0 0 oklch(0.35 0.15 160)", // Dark emerald shadow
    chartFirst: "oklch(0.6 0.2 160)", // Emerald green
    chartSecond: "oklch(0.7 0.18 140)", // Spring green
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("purple");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("dashboard-theme") as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard-theme", theme);

    const config = themeConfigs[theme];
    const root = document.documentElement;

    root.style.setProperty("--color-primary", config.primary);
    root.style.setProperty(
      "--color-primary-foreground",
      config.primaryForeground
    );
    root.style.setProperty("--color-secondary", config.secondary);
    root.style.setProperty(
      "--color-secondary-foreground",
      config.secondaryForeground
    );
    root.style.setProperty("--color-background", config.background);
    root.style.setProperty("--color-foreground", config.foreground);
    root.style.setProperty("--color-accent", config.accent);
    root.style.setProperty(
      "--color-accent-foreground",
      config.accentForeground
    );
    root.style.setProperty("--color-border", config.border);
    root.style.setProperty("--color-card", config.card);
    root.style.setProperty("--color-card-foreground", config.cardForeground);
    root.style.setProperty("--color-muted-foreground", config.mutedForeground);
    root.style.setProperty("--theme-shadow", config.shadow);
    root.style.setProperty("--color-chart-first", config.chartFirst);
    root.style.setProperty("--color-chart-second", config.chartSecond);

    // Update sidebar colors to match theme
    root.style.setProperty("--color-sidebar", config.secondary);
    root.style.setProperty("--color-sidebar-foreground", config.foreground);
    root.style.setProperty("--color-sidebar-border", config.border);
    root.style.setProperty("--color-sidebar-accent", config.accent);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { themeConfigs };
export type { Theme };
// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";

// type Theme =
//   | "blue"
//   | "white"
//   | "pink"
//   | "green"
//   | "purple"
//   | "orange"
//   | "dark"
//   | "slate"
//   | "teal"
//   | "amber"
//   | "crimson"
//   | "emerald"
//   | "cyber"
//   | "matrix";

// interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// const themeConfigs = {
//   blue: {
//     name: "Ocean Blue",
//     primary: "oklch(0.5 0.2 240)", // Blue
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.05 240)", // Light blue
//     secondaryForeground: "oklch(0.2 0.1 240)", // Dark blue
//     background: "oklch(0.98 0.01 240)", // Very light blue
//     foreground: "oklch(0.15 0.1 240)", // Dark blue text
//     accent: "oklch(0.6 0.15 240)", // Medium blue
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.08 240)", // Light blue border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.15 0.1 240)", // Card text (dark blue)
//     mutedForeground: "oklch(0.5 0.05 240)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.3 0.15 240)", // Dark blue shadow
//     chartFirst: "",
//     chartSecond: "",
//   },
//   white: {
//     name: "Clean White",
//     primary: "oklch(0.2 0.02 240)", // Very dark gray
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.95 0.01 240)", // Very light gray
//     secondaryForeground: "oklch(0.2 0.02 240)", // Dark gray
//     background: "oklch(1 0 0)", // Pure white
//     foreground: "oklch(0.1 0.01 240)", // Almost black
//     accent: "oklch(0.85 0.02 240)", // Light gray
//     accentForeground: "oklch(0.2 0.02 240)", // Dark gray
//     border: "oklch(0.8 0.01 240)", // Light gray border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.1 0.01 240)", // Card text (almost black)
//     mutedForeground: "oklch(0.5 0.01 240)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.6 0.01 240)", // Gray shadow
//   },
//   pink: {
//     name: "Bubblegum Pink",
//     primary: "oklch(0.65 0.25 340)", // Pink
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.9 0.1 340)", // Light pink
//     secondaryForeground: "oklch(0.25 0.15 340)", // Dark pink
//     background: "oklch(0.98 0.02 340)", // Very light pink
//     foreground: "oklch(0.2 0.1 340)", // Dark pink text
//     accent: "oklch(0.7 0.2 340)", // Medium pink
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.8 0.12 340)", // Light pink border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.2 0.1 340)", // Card text (dark pink)
//     mutedForeground: "oklch(0.5 0.1 340)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.4 0.2 340)", // Dark pink shadow
//   },
//   green: {
//     name: "Forest Green",
//     primary: "oklch(0.5 0.15 140)", // Green
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.07 140)", // Light green
//     secondaryForeground: "oklch(0.25 0.12 140)", // Dark green
//     background: "oklch(0.98 0.01 140)", // Very light green
//     foreground: "oklch(0.2 0.1 140)", // Dark green text
//     accent: "oklch(0.6 0.12 140)", // Medium green
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 140)", // Light green border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.2 0.1 140)", // Card text (dark green)
//     mutedForeground: "oklch(0.5 0.08 140)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.3 0.12 140)", // Dark green shadow
//   },
//   purple: {
//     name: "Royal Purple",
//     primary: "oklch(0.5 0.2 280)", // Purple
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.08 280)", // Light purple
//     secondaryForeground: "oklch(0.25 0.15 280)", // Dark purple
//     background: "oklch(0.98 0.01 280)", // Very light purple
//     foreground: "oklch(0.2 0.12 280)", // Dark purple text
//     accent: "oklch(0.6 0.15 280)", // Medium purple
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 280)", // Light purple border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.2 0.12 280)", // Card text (dark purple)
//     mutedForeground: "oklch(0.5 0.1 280)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.3 0.15 280)", // Dark purple shadow
//   },
//   orange: {
//     name: "Sunset Orange",
//     primary: "oklch(0.6 0.18 50)", // Orange
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.9 0.08 50)", // Light orange
//     secondaryForeground: "oklch(0.25 0.12 50)", // Dark orange
//     background: "oklch(0.98 0.01 50)", // Very light orange
//     foreground: "oklch(0.2 0.1 50)", // Dark orange text
//     accent: "oklch(0.65 0.15 50)", // Medium orange
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 50)", // Light orange border
//     card: "oklch(1 0 0)", // Card background (white)
//     cardForeground: "oklch(0.2 0.1 50)", // Card text (dark orange)
//     mutedForeground: "oklch(0.5 0.08 50)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.35 0.15 50)", // Dark orange shadow
//   },
//   dark: {
//     name: "Midnight Dark",
//     primary: "oklch(0.8 0.1 240)", // Light blue accent
//     primaryForeground: "oklch(0.1 0.05 240)", // Dark blue-gray
//     secondary: "oklch(0.15 0.02 240)", // Dark gray
//     secondaryForeground: "oklch(0.9 0.05 240)", // Light gray
//     background: "oklch(0.08 0.01 240)", // Very dark gray
//     foreground: "oklch(0.95 0.02 240)", // Almost white
//     accent: "oklch(0.7 0.15 240)", // Blue accent
//     accentForeground: "oklch(0.1 0.05 240)", // Dark text
//     border: "oklch(0.25 0.02 240)", // Dark border
//     card: "oklch(0.12 0.01 240)", // Dark card background
//     cardForeground: "oklch(0.95 0.02 240)", // Light card text
//     mutedForeground: "oklch(0.6 0.02 240)", // Muted text
//     shadow: "0 4px 0 0 oklch(0.35 0.08 240)", // Visible shadow - much lighter
//   },
//   cyber: {
//     name: "Cyber Dark",
//     primary: "oklch(0.75 0.18 320)", // Bright magenta
//     primaryForeground: "oklch(0.05 0.02 320)", // Very dark
//     secondary: "oklch(0.18 0.03 320)", // Dark purple-gray
//     secondaryForeground: "oklch(0.85 0.08 320)", // Light purple-gray
//     background: "oklch(0.06 0.02 320)", // Very dark with purple tint
//     foreground: "oklch(0.92 0.05 320)", // Light with purple tint
//     accent: "oklch(0.65 0.2 320)", // Vibrant purple
//     accentForeground: "oklch(0.05 0.02 320)", // Dark text
//     border: "oklch(0.22 0.04 320)", // Purple border
//     card: "oklch(0.1 0.02 320)", // Dark card with purple tint
//     cardForeground: "oklch(0.92 0.05 320)", // Light card text
//     mutedForeground: "oklch(0.55 0.04 320)", // Muted purple
//     shadow: "0 4px 0 0 oklch(0.35 0.15 320)", // Visible purple shadow
//   },

//   // Option 2: "Matrix Dark" - Green accents
//   matrix: {
//     name: "Matrix Dark",
//     primary: "oklch(0.7 0.2 140)", // Bright green
//     primaryForeground: "oklch(0.05 0.02 140)", // Very dark
//     secondary: "oklch(0.16 0.03 140)", // Dark green-gray
//     secondaryForeground: "oklch(0.82 0.08 140)", // Light green-gray
//     background: "oklch(0.04 0.02 140)", // Almost black with green tint
//     foreground: "oklch(0.88 0.06 140)", // Light green tint
//     accent: "oklch(0.6 0.18 140)", // Matrix green
//     accentForeground: "oklch(0.05 0.02 140)", // Dark text
//     border: "oklch(0.2 0.04 140)", // Green border
//     card: "oklch(0.08 0.02 140)", // Dark card with green tint
//     cardForeground: "oklch(0.88 0.06 140)", // Light card text
//     mutedForeground: "oklch(0.52 0.05 140)", // Muted green
//     shadow: "0 4px 0 0 oklch(0.3 0.12 140)", // Visible green shadow
//   },
//   slate: {
//     name: "Professional Slate",
//     primary: "oklch(0.45 0.08 240)", // Slate blue
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.02 240)", // Light slate
//     secondaryForeground: "oklch(0.3 0.05 240)", // Dark slate
//     background: "oklch(0.97 0.01 240)", // Off-white with slate tint
//     foreground: "oklch(0.2 0.05 240)", // Dark slate text
//     accent: "oklch(0.55 0.1 240)", // Medium slate
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.03 240)", // Slate border
//     card: "oklch(1 0 0)", // White card
//     cardForeground: "oklch(0.2 0.05 240)", // Dark slate text
//     mutedForeground: "oklch(0.5 0.03 240)", // Muted slate
//     shadow: "0 4px 0 0 oklch(0.35 0.08 240)", // Slate shadow
//   },

//   teal: {
//     name: "Ocean Teal",
//     primary: "oklch(0.55 0.18 180)", // Teal
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.88 0.08 180)", // Light teal
//     secondaryForeground: "oklch(0.25 0.12 180)", // Dark teal
//     background: "oklch(0.98 0.01 180)", // Very light teal
//     foreground: "oklch(0.2 0.1 180)", // Dark teal text
//     accent: "oklch(0.65 0.15 180)", // Medium teal
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 180)", // Teal border
//     card: "oklch(1 0 0)", // White card
//     cardForeground: "oklch(0.2 0.1 180)", // Dark teal text
//     mutedForeground: "oklch(0.5 0.08 180)", // Muted teal
//     shadow: "0 4px 0 0 oklch(0.35 0.15 180)", // Dark teal shadow
//   },
//   amber: {
//     name: "Golden Amber",
//     primary: "oklch(0.65 0.15 80)", // Amber
//     primaryForeground: "oklch(0.1 0.05 80)", // Dark amber text
//     secondary: "oklch(0.9 0.08 80)", // Light amber
//     secondaryForeground: "oklch(0.25 0.12 80)", // Dark amber
//     background: "oklch(0.98 0.02 80)", // Very light amber
//     foreground: "oklch(0.2 0.1 80)", // Dark amber text
//     accent: "oklch(0.7 0.12 80)", // Medium amber
//     accentForeground: "oklch(0.1 0.05 80)", // Dark text
//     border: "oklch(0.75 0.1 80)", // Amber border
//     card: "oklch(1 0 0)", // White card
//     cardForeground: "oklch(0.2 0.1 80)", // Dark amber text
//     mutedForeground: "oklch(0.5 0.08 80)", // Muted amber
//     shadow: "0 4px 0 0 oklch(0.4 0.12 80)", // Dark amber shadow
//   },

//   crimson: {
//     name: "Deep Crimson",
//     primary: "oklch(0.55 0.2 20)", // Crimson red
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.88 0.08 20)", // Light crimson
//     secondaryForeground: "oklch(0.25 0.15 20)", // Dark crimson
//     background: "oklch(0.98 0.01 20)", // Very light crimson
//     foreground: "oklch(0.2 0.12 20)", // Dark crimson text
//     accent: "oklch(0.65 0.18 20)", // Medium crimson
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 20)", // Crimson border
//     card: "oklch(1 0 0)", // White card
//     cardForeground: "oklch(0.2 0.12 20)", // Dark crimson text
//     mutedForeground: "oklch(0.5 0.1 20)", // Muted crimson
//     shadow: "0 4px 0 0 oklch(0.35 0.18 20)", // Dark crimson shadow
//   },

//   emerald: {
//     name: "Emerald Green",
//     primary: "oklch(0.55 0.18 160)", // Emerald
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.88 0.08 160)", // Light emerald
//     secondaryForeground: "oklch(0.25 0.12 160)", // Dark emerald
//     background: "oklch(0.98 0.01 160)", // Very light emerald
//     foreground: "oklch(0.2 0.1 160)", // Dark emerald text
//     accent: "oklch(0.65 0.15 160)", // Medium emerald
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 160)", // Emerald border
//     card: "oklch(1 0 0)", // White card
//     cardForeground: "oklch(0.2 0.1 160)", // Dark emerald text
//     mutedForeground: "oklch(0.5 0.08 160)", // Muted emerald
//     shadow: "0 4px 0 0 oklch(0.35 0.15 160)", // Dark emerald shadow
//   },
// };

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState<Theme>("purple");

//   useEffect(() => {
//     // Load theme from localStorage
//     const savedTheme = localStorage.getItem("dashboard-theme") as Theme;
//     if (savedTheme && themeConfigs[savedTheme]) {
//       setTheme(savedTheme);
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("dashboard-theme", theme);

//     const config = themeConfigs[theme];
//     const root = document.documentElement;

//     root.style.setProperty("--color-primary", config.primary);
//     root.style.setProperty(
//       "--color-primary-foreground",
//       config.primaryForeground
//     );
//     root.style.setProperty("--color-secondary", config.secondary);
//     root.style.setProperty(
//       "--color-secondary-foreground",
//       config.secondaryForeground
//     );
//     root.style.setProperty("--color-background", config.background);
//     root.style.setProperty("--color-foreground", config.foreground);
//     root.style.setProperty("--color-accent", config.accent);
//     root.style.setProperty(
//       "--color-accent-foreground",
//       config.accentForeground
//     );
//     root.style.setProperty("--color-border", config.border);
//     root.style.setProperty("--color-card", config.card);
//     root.style.setProperty("--color-card-foreground", config.cardForeground);
//     root.style.setProperty("--color-muted-foreground", config.mutedForeground);
//     root.style.setProperty("--theme-shadow", config.shadow);

//     // Update sidebar colors to match theme
//     root.style.setProperty("--color-sidebar", config.secondary);
//     root.style.setProperty("--color-sidebar-foreground", config.foreground);
//     root.style.setProperty("--color-sidebar-border", config.border);
//     root.style.setProperty("--color-sidebar-accent", config.accent);
//   }, [theme]);

//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error("useTheme must be used within a ThemeProvider");
//   }
//   return context;
// }

// export { themeConfigs };
// export type { Theme };
