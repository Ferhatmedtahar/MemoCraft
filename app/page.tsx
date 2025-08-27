import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/navbar/NavBar";
import HomeScreen from "@/modules/home/HomeScreen";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-background ">
      <NavBar />
      <HomeScreen />
      <Footer />
    </div>
  );
}
