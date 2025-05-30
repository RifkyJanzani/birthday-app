import { Press_Start_2P } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";
import LoadingScreen from '@/components/LoadingScreen';
import AudioPlayer from '@/components/AudioPlayer';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
});

export const metadata: Metadata = {
  title: 'For U. Anjay',
  description: 'Biasalah iseng',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pressStart.variable}`}>
      <body className="font-pixel">
        <LoadingScreen />
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
