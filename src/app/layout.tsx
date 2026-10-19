import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { DESCRIPTOR, GITHUB_URL, NAME, SITE_TITLE, SITE_URL } from "@/content/profile";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: `${NAME}, ${DESCRIPTOR}. Projects and contact.`,
  authors: [{ name: NAME, url: GITHUB_URL }],
  openGraph: {
    title: SITE_TITLE,
    description: `${DESCRIPTOR}.`,
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
