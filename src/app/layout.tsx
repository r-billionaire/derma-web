import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { clinicInfo } from "@/content";
import { theme } from "@/content/theme";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: `${clinicInfo.name} — Medical & Cosmetic Dermatology`,
  description: "Expert medical and cosmetic dermatology care.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{
          ['--background' as any]: theme.colors.background,
          ['--foreground' as any]: theme.colors.foreground,
          ['--accent-primary' as any]: theme.colors.accentPrimary,
          ['--accent-secondary' as any]: theme.colors.accentSecondary,
          ['--neutral' as any]: theme.colors.neutral,
        }}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
