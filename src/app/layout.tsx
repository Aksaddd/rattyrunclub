import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ratty Run — NYC",
  description: "A community run club based in New York City. @therattyrun",
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
