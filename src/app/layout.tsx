import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import FavoriteToastHost from "@/components/dashboard/FavoriteToastHost";
import { PersistentMusicProvider } from "@/components/dashboard/PersistentMusicProvider";
import "./globals.css";
import "./visual-editor.generated.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phil's studio",
  description: "Your tools, one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PersistentMusicProvider>
          {children}
          <FavoriteToastHost />
        </PersistentMusicProvider>
      </body>
    </html>
  );
}
