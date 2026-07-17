import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row mx-auto w-full max-w-7xl">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
