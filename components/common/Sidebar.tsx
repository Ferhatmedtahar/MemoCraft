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
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: Clock,
  },
  {
    title: "Graph View",
    href: "/dashboard/graph-view",
    icon: GitGraph,
  },
  {
    title: "AI Assistant",
    href: "/dashboard/ai-assistant",
    icon: Bot,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-48 lg:w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            Dashboard
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent/20"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2  flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "px-2",
                  !isActive &&
                    "text-sidebar-foreground hover:bg-sidebar-accent/20"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Theme Selector */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/20",
                collapsed && "px-2"
              )}
            >
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
      </div>
    </div>
  );
}
// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "@/contexts/theme-context";
// import { cn } from "@/lib/utils";
// import {
//   Atom,
//   Bot,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   GitGraph,
//   LayoutDashboard,
//   Notebook,
//   Palette,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// const sidebarItems = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     title: "Atoms",
//     href: "/dashboard/atoms",
//     icon: Atom,
//   },
//   {
//     title: "Notes",
//     href: "/dashboard/notes",
//     icon: Notebook,
//   },
//   {
//     title: "Flashcards",
//     href: "/dashboard/flashcards",
//     icon: Clock,
//   },
//   {
//     title: "Graph View",
//     href: "/dashboard/graph-view",
//     icon: GitGraph,
//   },
//   {
//     title: "AI Assistant",
//     href: "/dashboard/ai-assistant",
//     icon: Bot,
//   },
//   {
//     title: "Profile",
//     href: "/dashboard/profile",
//     icon: User,
//   },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();
//   const { theme, setTheme } = useTheme();

//   const themeOptions = [
//     { value: "blue" as const, label: "Blue", color: "bg-blue-500" },
//     { value: "white" as const, label: "White", color: "bg-gray-100 border" },
//     { value: "pink" as const, label: "Pink", color: "bg-pink-500" },
//   ];

//   return (
//     <div
//       className={cn(
//         "flex flex-col h-full  border-r border-white transition-all duration-300",
//         collapsed ? "w-16" : "w-48 lg:w-64"
//       )}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
//         {!collapsed && (
//           <h2 className="text-lg font-semibold text-sidebar-foreground">
//             Dashboard
//           </h2>
//         )}
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-sidebar-foreground hover:bg-sidebar-accent"
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4" />
//           ) : (
//             <ChevronLeft className="h-4 w-4" />
//           )}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-4 space-y-2">
//         {sidebarItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.href;

//           return (
//             <Link key={item.href} href={item.href}>
//               <Button
//                 variant={isActive ? "default" : "outline"}
//                 className={cn(
//                   "w-full justify-start ",
//                   collapsed && "px-2",
//                   !isActive && "bg-white text-black"
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//                 {!collapsed && <span className="ml-2">{item.title}</span>}
//               </Button>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Theme Selector */}
//       <div className="p-4 border-t border-sidebar-border">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
//                 collapsed && "px-2"
//               )}
//             >
//               <Palette className="h-4 w-4" />
//               {!collapsed && <span className="ml-2">Theme</span>}
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-48">
//             {themeOptions.map((option) => (
//               <DropdownMenuItem
//                 key={option.value}
//                 onClick={() => setTheme(option.value)}
//                 className="flex items-center gap-2"
//               >
//                 <div className={cn("w-4 h-4 rounded-full", option.color)} />
//                 {option.label}
//                 {theme === option.value && <span className="ml-auto">✓</span>}
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </div>
//   );
// }
