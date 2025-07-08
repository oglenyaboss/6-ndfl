import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "6-НДФЛ",
  description: "Мощный инструмент для работы с налоговыми декларациями",
  keywords: "6-НДФЛ, налоговая декларация, налоги, налоговая отчетность",
  applicationName: "6-НДФЛ",
  creator: "@oglenya",
  category: "Business",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SpeedInsights />
      <body className="">{/* {inter.className} */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
