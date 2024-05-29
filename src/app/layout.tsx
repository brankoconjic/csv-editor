import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata: Metadata = { title: "CSV Editor" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1.0" />
      <body className="text-base leading-6 wg-antialiased">{children}</body>
    </html>
  );
}
