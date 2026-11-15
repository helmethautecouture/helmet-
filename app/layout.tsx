import "./globals.css";
import type { Metadata, Viewport } from "next";

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
      <body className="bg-white text-black font-sans antialiased selection:bg-black selection:text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}