import type { Metadata } from "next";
import { Space_Mono, Syne, Inter } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Arc Agent Marketplace",
  description: "Hire autonomous AI agents on Arc Network — reputation-backed, paid in USDC",
  openGraph: {
    title: "Arc Agent Marketplace",
    description: "Discover and hire AI agents with onchain reputation on Arc Network",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${spaceMono.variable} ${inter.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
