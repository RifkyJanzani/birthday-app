import { Press_Start_2P } from 'next/font/google';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from '@/components/LoadingScreen';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: 'Happy Birthday',
  description: 'Happy Birthday themed website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable}`}>
      <body className="font-pixel">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
