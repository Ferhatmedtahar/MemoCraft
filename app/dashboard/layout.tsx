import Sidebar from "@/components/common/Sidebar";
import NavBar from "@/components/common/navbar/NavBar";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type React from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Dashboard - MemoCraft",
  description:
    "MemoCraft is a all in one note taking app that allows you to create, edit, and share notes, atoms, and flashcards.",
};
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
    <div className="font-mono min-h-screen bg-background">
      <Toaster
        richColors
        closeButton
        className="bg-popover text-popover-foreground [&>li]:!rounded-none [&>li>div]:!rounded-none"
      />
      <NavBar />
      <div className="flex h-[calc(100vh-73px)]">
        <Sidebar />
        <main className="flex-1 overflow-auto py-6 px-2 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
