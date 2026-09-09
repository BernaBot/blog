import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Libre_Caslon_Display,
  Libre_Caslon_Text,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import SecretListener from "@/components/SecretListener";

const masthead = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-masthead",
});
const caslonDisplay = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caslon-display",
});
const caslonText = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caslon-text",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Apatía mental — escritos desde la cama",
  description: "Escritos desde la cama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${masthead.variable} ${caslonDisplay.variable} ${caslonText.variable} ${plexMono.variable} font-texto`}
      >
        <SecretListener />
        {children}
      </body>
    </html>
  );
}
