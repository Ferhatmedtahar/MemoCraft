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
import {
  Atom,
  Bot,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitGraph,
  LayoutDashboard,
  Notebook,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Atoms",
    href: "/dashboard/atoms",
    icon: Atom,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: Notebook,
  },
  {
    title: "Decks",
    href: "/dashboard/decks",
    icon: Clock,
  },
  {
    title: "Assistant",
    href: "/dashboard/ai-assistant",
    icon: Bot,
  },
  {
    title: "Graph View",
    href: "/dashboard/graph-view",
    icon: GitGraph,
  },
];

export default function Sidebar() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const handleToggle = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    }
  };

  const isCollapsed = isMobile || collapsed;

  return (
    <div
      className={cn(
        "flex flex-col h-[101%] sm:h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : " md:w-46 lg:w-50 xl:w-58"
      )}
    >
      {isMobile ? null : (
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              Dashboard
            </h2>
          )}

          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="text-sidebar-foreground hover:bg-sidebar-accent/20"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "px-3",
                  !isActive &&
                    "text-sidebar-foreground hover:bg-sidebar-accent/20"
                )}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Theme Selector */}
      <div className="p-2 py-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start  text-sidebar-foreground hover:bg-sidebar-accent/20",
                isCollapsed && "px-2"
              )}
            >
              <Palette className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Theme</span>}
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
      </div>
    </div>
  );
}
