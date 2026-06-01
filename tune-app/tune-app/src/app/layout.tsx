import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AudioProvider } from "@/context/AudioContext"; // ✅ Added Global Audio State Context Provider
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import ParticleBackground from "@/components/ParticleBackground"; // 🌟 Global background added here

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "nmg-_-Tunes",
  description: "Hybrid Digital Marketplace and Service Portal for High-Quality Tunes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable}`} suppressHydrationWarning>
      <body>
        {/* 🔮 The glowing stars will now follow you seamlessly across every single page route! */}
        <ParticleBackground />

        <AuthProvider>
          <ThemeProvider>
            <AudioProvider> {/* ✅ Wrapped Context to orchestrate song selections globally */}
              <Navbar />
              <main style={{ position: "relative", zIndex: 2, padding: "0 1rem" }}>
                {children}
              </main>
              <AudioPlayer />
            </AudioProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}