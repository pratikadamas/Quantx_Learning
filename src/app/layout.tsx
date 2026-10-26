import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPU Student Portal | Academic Resources & Study Material",
  description:
    "A modern, student-focused academic portal for IPU students to access study material, previous-year papers, and question banks.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50 font-sans">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              IPU Student Portal • Open Source Academic Foundation
            </p>
            <p className="mt-1">
              Built for Guru Gobind Singh Indraprastha University students.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
