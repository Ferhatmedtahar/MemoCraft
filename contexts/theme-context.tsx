"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "blue" | "white" | "pink" | "green" | "purple" | "orange";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfigs = {
  blue: {
    name: "Ocean Blue",
    primary: "oklch(0.45 0.2 240)", // Blue
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
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("blue");

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("dashboard-theme") as Theme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("dashboard-theme", theme);

    // Apply theme to CSS custom properties
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

// type Theme = "blue" | "white" | "pink" | "green" | "purple" | "orange";

// interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// const themeConfigs = {
//   blue: {
//     name: "Ocean Blue",
//     primary: "oklch(0.45 0.2 240)", // Blue
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.05 240)", // Light blue
//     secondaryForeground: "oklch(0.2 0.1 240)", // Dark blue
//     background: "oklch(0.98 0.01 240)", // Very light blue
//     foreground: "oklch(0.15 0.1 240)", // Dark blue text
//     accent: "oklch(0.6 0.15 240)", // Medium blue
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.08 240)", // Light blue border
//     shadow: "0 4px 0 0 oklch(0.3 0.15 240)", // Dark blue shadow
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
//     shadow: "0 4px 0 0 oklch(0.4 0.2 340)", // Dark pink shadow
//   },
//   green: {
//     name: "Forest Green",
//     primary: "oklch(0.5 0.15 140)", // Green
//     primaryForeground: "oklch(1 0 0)", // White
//     secondary: "oklch(0.85 0.08 140)", // Light green
//     secondaryForeground: "oklch(0.25 0.12 140)", // Dark green
//     background: "oklch(0.98 0.01 140)", // Very light green
//     foreground: "oklch(0.2 0.1 140)", // Dark green text
//     accent: "oklch(0.6 0.12 140)", // Medium green
//     accentForeground: "oklch(1 0 0)", // White
//     border: "oklch(0.75 0.1 140)", // Light green border
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
//     shadow: "0 4px 0 0 oklch(0.35 0.15 50)", // Dark orange shadow
//   },
// };

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState<Theme>("blue");

//   useEffect(() => {
//     // Load theme from localStorage
//     const savedTheme = localStorage.getItem("dashboard-theme") as Theme;
//     if (savedTheme && themeConfigs[savedTheme]) {
//       setTheme(savedTheme);
//     }
//   }, []);

//   useEffect(() => {
//     // Save theme to localStorage
//     localStorage.setItem("dashboard-theme", theme);

//     // Apply theme to CSS custom properties
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
