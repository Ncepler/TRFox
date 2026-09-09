import type { Metadata } from "next";
import { Schibsted_Grotesk, Newsreader } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "T.R. Fox Contracting",
    template: "%s — T.R. Fox Contracting",
  },
  description:
    "High-end residential interiors in Manhattan. Two or three projects a year, run by Todd Fox himself.",
};

export const viewport = {
  themeColor: "#E9E7E2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${schibstedGrotesk.variable} ${newsreader.variable} font-body antialiased`}>
        <a
          href="#main"
          className="fixed left-2 top-2 -translate-y-20 focus:translate-y-0 z-50 bg-canvas px-4 py-2 font-display text-sm transition-transform"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
