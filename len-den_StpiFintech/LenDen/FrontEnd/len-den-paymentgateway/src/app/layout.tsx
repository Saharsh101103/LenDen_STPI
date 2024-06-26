import type { Metadata } from "next";
import { Ubuntu as Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";

const inter = Inter({weight: "400", display: "auto", style: "normal", subsets: ["greek"]});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
      <Toaster/>
      </body>
    </html>
  );
}
