import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileDashboardMenu } from "@/components/dashboard/mobile-menu";

import { DashboardModeProvider } from "@/components/dashboard/mode-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardModeProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />

      <div className="flex-1 flex flex-col md:flex-row mx-auto w-full max-w-7xl">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Mobile sidebar/menu */}
        <MobileDashboardMenu />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
    </DashboardModeProvider>
  );
}
