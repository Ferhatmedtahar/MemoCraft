import Sidebar from "@/components/common/Sidebar";
import NavBar from "@/components/common/navbar/NavBar";
import { ThemeProvider } from "@/contexts/theme-context";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex h-[calc(100vh-73px)]">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
