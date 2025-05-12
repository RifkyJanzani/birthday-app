'use client';

import { useEffect, useState } from 'react';
import { Press_Start_2P } from 'next/font/google';

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
});

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cek apakah sudah pernah loading
    const hasLoaded = typeof window !== 'undefined' && localStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem('hasLoaded', 'true');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-800">
      <div
        className="flex flex-col items-center justify-center px-10 py-8"
        style={{
          background: '#101426',
          border: '4px solid #fff',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      >
        <div className={`${pressStart.className} text-white text-lg mb-6 tracking-widest`}>
          BENTAR, PERSIAPAN DULU
        </div>
        <div
          className="w-72 h-8 flex items-center justify-center mb-6"
        >
          <div
            className="w-full h-full bg-white border-2 border-[#fff] flex items-center"
            style={{ position: 'relative' }}
          >
            <div
              className="h-full bg-[#101426]"
              style={{
                width: `${100 - progress}%`,
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                transition: 'width 0.3s',
                zIndex: 2,
              }}
            />
            <div
              className="h-full bg-white"
              style={{
                width: `${progress}%`,
                transition: 'width 0.3s',
                zIndex: 1,
              }}
            />
          </div>
        </div>
        <div className={`${pressStart.className} text-white text-lg mt-2 tracking-widest`}>
          SENYUM DONG!
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 