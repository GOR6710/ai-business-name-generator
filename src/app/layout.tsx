import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Business Name Generator - Free & Creative Names Instantly",
  description:
    "Generate unique, creative business names in seconds with AI. Get 15 name ideas with taglines, memorability scores, and domain availability. Free to use.",
  keywords:
    "AI business name generator, business name generator, startup name generator, company name ideas, brand name generator",
  openGraph: {
    title: "AI Business Name Generator - Free & Creative Names Instantly",
    description:
      "Generate unique, creative business names in seconds with AI. Get 15 name ideas instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
