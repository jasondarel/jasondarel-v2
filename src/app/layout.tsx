import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jason Darel — Full-Stack Developer",
  description:
    "Portfolio & interactive scroll experiments powered by Next.js, Lenis, and GSAP.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
