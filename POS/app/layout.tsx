import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";
import { getSession } from "next-auth/react";
import { Poppins } from 'next/font/google';
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
    title: 'RestroPOS - Custom POS for Restaurants',
    description:
        'Create a tailored POS system for your restaurant. Multi-tenant, affordable, and scalable.',
    keywords:
        'restaurant POS, multi-tenant POS, custom POS, restaurant management',
    openGraph: {
        title: 'RestroPOS',
        description: 'Empower your restaurant with a custom POS system.',
        url: 'http://localhost',
        images: ['/images/og-image.jpg'],
    },
};

export default async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession()
  return (
      <html lang="en">
          <body
              className={`${geistSans.variable} ${poppins.className} ${geistMono.variable} antialiased`}
          >
              <MainLayout session={session}>{children}</MainLayout>
          </body>
      </html>
  );
}
