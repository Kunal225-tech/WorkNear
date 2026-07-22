import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "WorkNear — Find Local Jobs & Hire Nearby Talent",
  description:
    "WorkNear connects you with verified local service professionals. Post jobs, find nearby gigs, and get work done in your neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} antialiased`}>
      <body suppressHydrationWarning className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          <I18nProvider>
            <Providers>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                }}
              />
            </Providers>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}