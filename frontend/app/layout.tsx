import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contract Negotiator",
  description: "Upload two contracts and get AI-powered compromise suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f0f0f] text-[#e5e5e5] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
