import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khan Car Rentals & Sales - Premium Vehicle Services",
  description: "Your trusted partner for premium car rental and sales services across Australia. Quality, reliability, and customer satisfaction guaranteed. Browse our fleet of luxury vehicles available for rental or purchase.",
  keywords: "car rental, vehicle sales, car hire, luxury cars, premium vehicles, Australia, Brisbane, Sydney, Melbourne",
  authors: [{ name: "Khan Car Rentals" }],
  creator: "Khan Car Rentals",
  publisher: "Khan Car Rentals",
  robots: "index, follow",
  openGraph: {
    title: "Khan Car Rentals & Sales - Premium Vehicle Services",
    description: "Your trusted partner for premium car rental and sales services across Australia. Quality, reliability, and customer satisfaction guaranteed.",
    type: "website",
    locale: "en_AU",
    siteName: "Khan Car Rentals",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khan Car Rentals & Sales - Premium Vehicle Services",
    description: "Your trusted partner for premium car rental and sales services across Australia.",
  },
  viewport: "width=device-width, initial-scale=1",
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
        {children}
      </body>
    </html>
  );
}
