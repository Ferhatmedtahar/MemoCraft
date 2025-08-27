import { createClientForServer } from "@/utils/supabase/server";
import NavBarContent from "./NavBarContent";

async function NavBar() {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <NavBarContent user={user} />;
}

export default NavBar;
