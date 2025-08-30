import { ThemeProvider } from "@/contexts/theme-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoCraft - Note Taking App",
  description:
    "MemoCraft is a all in one note taking app that allows you to create, edit, and share notes, atoms, and flashcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased font-mono  selection:bg-primary selection:text-primary-foreground`}
      >
        {" "}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
