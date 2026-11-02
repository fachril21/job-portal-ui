import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Dibimbing Career Hub",
  description: "Prototype UI/UX job portal untuk student dan hiring partner Dibimbing. Data sintetis, bukan produk fungsional.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#007378" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geist.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
