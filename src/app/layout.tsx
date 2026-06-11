import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Business Name Generator - Free & Creative Names Instantly",
  description: "Generate unique, creative business names in seconds with AI. Get 15 name ideas with taglines, memorability scores.",
  keywords: "AI business name generator, startup name generator, company name ideas, brand name generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  );
}
