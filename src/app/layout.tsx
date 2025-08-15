import "./globals.css";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "kidalica.app",
  description: "Organize and jam your guitar song library",
  metadataBase: new URL("https://kidalica.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased")}>{children}</body>
    </html>
  );
}


