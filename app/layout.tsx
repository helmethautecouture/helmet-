import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import GlobalAudio from "./GlobalAudio";

const fontScript1610 = localFont({
  src: "../public/fonts/1610-cancellaresca.ttf",
  variable: "--font-script-1610",
  display: "block",
});

const fontBordeaux1589 = localFont({
  src: "../public/fonts/1589-humane-bordeaux-regular.ttf",
  variable: "--font-bordeaux-1589",
  display: "block",
});

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
    <html
      lang="fr"
      className={`${fontScript1610.variable} ${fontBordeaux1589.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-bordeaux-1589), serif",
          fontWeight: 600,
          WebkitTextStroke: "0.25px currentColor",
        }}
        className="bg-white text-black antialiased selection:bg-black selection:text-white overflow-x-hidden"
      >
        <GlobalAudio />
        {children}
      </body>
    </html>
  );
}