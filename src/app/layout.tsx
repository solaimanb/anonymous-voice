import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const openSans = localFont({
  src: [
    {
      path: "./fonts/OpenSans-Regular.woff",
      weight: "400",
    },
    {
      path: "./fonts/OpenSans-SemiBold.ttf",
      weight: "600",
    },
    {
      path: "./fonts/OpenSans-Bold.ttf",
      weight: "700",
    },
    {
      path: "./fonts/OpenSans-ExtraBold.ttf",
      weight: "800",
    }
  ],
  variable: "--font-open-sans",
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Anonymous Voice',
  description: 'Your safe space for mental health support and anonymous communication',
  keywords: ['mental health', 'anonymous chat', 'support', 'counseling'],
  authors: [{ name: 'Anonymous Voice Team' }],
  creator: 'Anonymous Voice',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anonymous-voice.com',
    title: 'Anonymous Voice',
    description: 'Your safe space for mental health support and anonymous communication',
    siteName: 'Anonymous Voice',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anonymous Voice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anonymous Voice',
    description: 'Your safe space for mental health support and anonymous communication',
    images: ['/images/twitter-card.png'],
    site: '@anonymousvoice',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${geistSans.variable} antialiased bg-base-100 text-base-content`}
      >
        {children}
      </body>
    </html>
  );
}
