import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GuitarTuner } from "@/components/guitar-tuner";
import { Logo } from "@/components/logo";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kidalica - Guitar Song Organizer",
  description: "A modern web app for organizing and playing guitar songs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                <Logo size="small" />
                <span>kidalica.app</span>
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/library" className="text-sm hover:underline transition-all duration-200 hover:text-primary">
                  Library
                </Link>
                <Link href="/jam" className="text-sm hover:underline transition-all duration-200 hover:text-primary">
                  Jam
                </Link>
                <Link href="/about" className="text-sm hover:underline transition-all duration-200 hover:text-primary">
                  About
                </Link>
                <GuitarTuner />
                <ThemeToggle />
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


