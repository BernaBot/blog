import type { Metadata } from "next";
import { Libre_Caslon_Display, Libre_Caslon_Text, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SecretListener from "@/components/SecretListener";

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
        className={`${caslonDisplay.variable} ${caslonText.variable} ${plexMono.variable} font-texto`}
      >
        <SecretListener />
        {children}
      </body>
    </html>
  );
}
