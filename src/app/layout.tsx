import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Navu",
  description: "Discover your idea through conversation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
