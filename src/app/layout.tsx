// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import { UserProvider } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import "./globals.css";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/ui/sonner";

/**
 * Import Work Sans font with multiple weights and define CSS variable.
 * 
 * This allows consistent typography across the application and supports
 * different font weights for headings, body text, and emphasis.
 */
const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/WorkSans-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/WorkSans-ExtraLight.ttf", weight: "100", style: "normal" },
  ],
  variable: "--font-work-sans", // CSS variable for global use
});

/**
 * Metadata for the application, used by Next.js for SEO and page info.
 */
export const metadata: Metadata = {
  title: "SGDirectory", // App name
  description: "Connect with trusted local service providers in Jeffreys Bay",
};

/**
 * RootLayout Component
 * 
 * Wraps all pages in the application and provides:
 * - Global font styling
 * - User context provider
 * - Navbar displayed on every page
 * - Main content area
 * - Toast notifications for alerts and messages
 * 
 * @param children - The page content to render within the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={workSans.variable}>
        {/* Provide user context for the entire app */}
        <UserProvider>
          {/* Navbar displayed on all pages */}
          <Navbar />

          {/* Main content area */}
          <main>{children}</main>

          {/* Global toaster notifications */}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
