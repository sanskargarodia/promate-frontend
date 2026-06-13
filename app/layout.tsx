import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProMate Assistant",
  description:
    "AI assistant for PartSelect appliance parts — compatibility, install help, troubleshooting, and purchase handoff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} h-full overflow-hidden bg-app-gradient font-sans antialiased`}
      >
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
