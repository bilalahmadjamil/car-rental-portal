import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { ConfirmationProvider } from "../contexts/ConfirmationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlifDrives - Premium Vehicle Services",
  description: "Your trusted partner for premium car rental and sales services across Australia. Quality, reliability, and customer satisfaction guaranteed. Browse our fleet of luxury vehicles available for rental or purchase.",
  keywords: "car rental, vehicle sales, car hire, luxury cars, premium vehicles, Australia, Brisbane, Sydney, Melbourne",
  authors: [{ name: "AlifDrives" }],
  creator: "AlifDrives",
  publisher: "AlifDrives",
  robots: "index, follow",
  openGraph: {
    title: "AlifDrives - Premium Vehicle Services",
    description: "Your trusted partner for premium car rental and sales services across Australia. Quality, reliability, and customer satisfaction guaranteed.",
    type: "website",
    locale: "en_AU",
    siteName: "AlifDrives",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlifDrives - Premium Vehicle Services",
    description: "Your trusted partner for premium car rental and sales services across Australia.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ConfirmationProvider>
            {children}
          </ConfirmationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
