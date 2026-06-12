import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteHeader } from "@/components/layout/SiteHeader";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProMate | PartSelect Parts Assistant Demo",
  description:
    "Demo chat agent for PartSelect refrigerator and dishwasher parts — compatibility, install help, and purchase handoff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-white font-sans antialiased`}>
        <SiteHeader />
        <main>{children}</main>
        <ChatWidget />
        <footer className="mt-auto border-t border-partselect-gray-200 bg-partselect-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-partselect-gray-600 sm:px-6 lg:px-8">
            ProMate demo — conversational bridge to PartSelect.com. Not a full storefront.
          </div>
        </footer>
      </body>
    </html>
  );
}
