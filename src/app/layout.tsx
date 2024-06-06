import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import GoogleAnalytics from "@/components/googleAnalytics";
import { NextDevtoolsProvider } from "@next-devtools/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "6-НДФЛ",
  description: "6-ндфл",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body className={inter.className}>
        {children}s
        <Toaster />
      </body>
    </html>
  );
}
