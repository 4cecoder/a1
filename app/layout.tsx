import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A1 Cuts",
  description: "Premium cuts. Classic style.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
