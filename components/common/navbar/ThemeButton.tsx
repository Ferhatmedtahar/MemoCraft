"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme-context";
import { themeOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  console.log(pathname);
  if (pathname !== "/") return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"md"}>
          <Palette className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-background border-border"
      >
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="flex items-center gap-2 text-foreground hover:bg-accent"
          >
            <div className={cn("w-4 h-4 rounded-full", option.color)} />
            {option.label}
            {theme === option.value && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeButton;
