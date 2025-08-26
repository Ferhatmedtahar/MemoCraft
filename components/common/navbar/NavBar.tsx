import { createClientForServer } from "@/utils/supabase/server";
import AuthForm from "./AuthForm";
import DashboardLogout from "./DashboardLogout";
import Logo from "./Logo";

async function NavBar() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-primary bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/0 sticky top-0 z-50">
      <div className=" mx-auto px-4 pr-8 py-4  bg-background">
        <div className="flex items-center justify-between">
          <Logo />

          {user ? <DashboardLogout /> : <AuthForm />}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
