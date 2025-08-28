"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/utils/actions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLogout() {
  const pathname = usePathname();

  return (
    <>
      {pathname.startsWith("/dashboard") ? (
        <form>
          {" "}
          <Button formAction={signOut} variant="secondary">
            LogOut
          </Button>
        </form>
      ) : (
        <Link href="/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      )}
    </>
  );
}
