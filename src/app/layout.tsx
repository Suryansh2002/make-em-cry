import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Make-Em-Cry",
  description: "Make the cartoon cry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
