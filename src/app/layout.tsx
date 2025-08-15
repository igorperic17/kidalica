import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export const metadata: Metadata = {
  title: "kidalica.app",
  description: "Organize and jam your guitar song library",
  metadataBase: new URL("https://kidalica.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <Link href="/" className="font-semibold">
                kidalica.app
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/library" className="text-sm hover:underline">
                  Library
                </Link>
                <Link href="/jam" className="text-sm hover:underline">
                  Jam
                </Link>
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


