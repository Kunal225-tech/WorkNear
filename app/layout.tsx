import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../components/providers/SessionProvider";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import InteractiveGridBackground from "../components/ui/InteractiveGridBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkNear - Local Professional Services",
  description: "Find and book verified neighborhood service professionals and local gigs on demand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col relative z-10">
        <ThemeProvider>
          <AuthProvider>
            <InteractiveGridBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}