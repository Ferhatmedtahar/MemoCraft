import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/navbar/NavBar";
import HomeScreen from "@/modules/home/HomeScreen";
import { createClientForServer } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClientForServer();
  const session = await supabase.auth.getUser();
  console.log(session);
  const user = session.data?.user;
  console.log(user);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HomeScreen />
      <Footer />
    </div>
  );
}
