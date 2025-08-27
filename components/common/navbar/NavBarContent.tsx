"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import AuthForm from "./AuthForm";
import DashboardLogout from "./DashboardLogout";
import Logo from "./Logo";
import ThemeButton from "./ThemeButton";
import UserProfile from "./UserProfile";

type NavBarContentProps = {
  user: User | null;
};

export default function NavBarContent({ user }: NavBarContentProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <header className="border-b border-sidebar-border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/0 sticky top-0 z-50">
      <div className="mx-auto px-4 py-4 bg-background">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <ThemeButton />

            {user ? (
              <>
                <div className="flex items-center gap-3 ml-2">
                  {isDashboard && <UserProfile user={user} />}
                  {isDashboard && <div className="h-6 w-px bg-border" />}{" "}
                  <DashboardLogout />
                </div>
              </>
            ) : (
              <AuthForm />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
