import { auth } from "@/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeContent from "@/components/home/HomeContent";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar session={session} />
      <div className="grow">
        <HomeContent />
      </div>
      <Footer />
    </div>
  );
}