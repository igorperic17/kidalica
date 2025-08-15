import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GuitarTuner } from "@/components/guitar-tuner";
import { Logo } from "@/components/logo";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kidalica.app - Guitar Song Organizer",
  description: "Organize and jam your guitar songs with a modern, beautiful interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
              <div className="container-modern flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-3 font-semibold hover:opacity-80 transition-opacity">
                  <Logo size="small" />
                  <span className="text-lg">kidalica.app</span>
                </Link>
                <nav className="flex items-center gap-6">
                  <Link href="/about" className="body-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">About</Link>
                  <GuitarTuner />
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


