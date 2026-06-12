import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProMate | PartSelect Parts Assistant",
  description:
    "Shop refrigerator and dishwasher parts with AI-powered help for compatibility, installation, and troubleshooting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-white font-sans antialiased`}>
        <header className="border-b border-partselect-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-md bg-partselect-teal text-sm font-bold text-white"
                aria-hidden
              >
                PS
              </span>
              <div>
                <p className="text-lg font-semibold leading-tight text-partselect-teal">
                  PartSelect
                </p>
                <p className="text-xs text-partselect-gray-600">Powered by ProMate</p>
              </div>
            </div>
            <nav aria-label="Primary" className="hidden items-center gap-6 text-sm sm:flex">
              <span className="font-medium text-partselect-teal">Refrigerator Parts</span>
              <span className="font-medium text-partselect-teal">Dishwasher Parts</span>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-auto border-t border-partselect-gray-200 bg-partselect-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-partselect-gray-600 sm:px-6 lg:px-8">
            ProMate assists with refrigerator and dishwasher parts only.
          </div>
        </footer>
      </body>
    </html>
  );
}
