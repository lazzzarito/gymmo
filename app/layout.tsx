import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/ui/Preloader";
import { LiveBackground } from "@/components/ui/LiveBackground";
import { PageTransition } from "@/components/layout/PageTransition";

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gymmo | The RPG Fitness Game",
  description: "Level up your fitness in this RPG-style workout tracker.",
  manifest: "/manifest.json",
  themeColor: "#ff4d4d",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gymmo RPG"
  },
  icons: {
    icon: "/icon-512x512.png",
    apple: "/icon-512x512.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart.variable} ${vt323.variable} antialiased bg-background text-foreground font-vt323 transition-colors duration-500`}
      >
        <Preloader />
        <LiveBackground />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
