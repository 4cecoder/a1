import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "A1 Cuts | Barber Shop in Columbia, SC",
  description: "A1 Cuts in Columbia, SC offers premium haircuts, fades, beard trims, and hot towel shaves.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "A1 Cuts | Barber Shop in Columbia, SC",
    description: "Premium cuts and classic barbering in Columbia, South Carolina.",
    type: "website",
    locale: "en_US",
    siteName: "A1 Cuts",
    url: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
