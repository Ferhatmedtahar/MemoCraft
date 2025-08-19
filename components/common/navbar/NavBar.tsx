import { createClientForServer } from "@/utils/supabase/server";
import { MapPin } from "lucide-react";
import Link from "next/link";
import AuthForm from "./AuthForm";
import DashboardLogout from "./DashboardLogout";

async function NavBar() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-yellow-500 bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/0 sticky top-0 z-50">
      <div className=" mx-auto px-4 pr-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="text-xl font-bold text-yellow-500 ">
              CollabNotes
            </Link>
          </div>

          {user ? <DashboardLogout /> : <AuthForm />}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
