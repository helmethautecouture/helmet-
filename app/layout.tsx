import "./globals.css";
import type { Metadata, Viewport } from "next";
import GlobalAudio from "./GlobalAudio";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Helmet — Haute Couture",
  description: "Helmet Haute Couture Paris — Edition -01",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-black antialiased selection:bg-black selection:text-white overflow-x-hidden">
        <GlobalAudio />
        {children}
      </body>
    </html>
  );
}