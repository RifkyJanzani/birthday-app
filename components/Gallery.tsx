'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GalleryScreen() {
  const TOTAL_PHOTOS = 6;
  const PHOTO_HEIGHT = 240;
  const STEP_COUNT = TOTAL_PHOTOS * 10;
  const [stage, setStage] = useState<'initial' | 'preparing' | 'printing' | 'done'>('initial');
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [visibleFrames, setVisibleFrames] = useState<number[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const playfulColors = [
  'text-pink-500',
  'text-yellow-500',
  'text-green-500',
  'text-blue-500',
  'text-purple-500',
  'text-orange-500',
];

  const playfulLabels = [
  'Anjayy',
  'Cantiknyo',
  'Deemm',
  'Cool',
  'Just Wow',
  'Sheeesh',
];

  const photoUrls = [
    '/img/foto1.jpg',
    '/img/foto2.jpg',
    '/img/foto3.jpg',
    '/img/foto4.jpg',
    '/img/foto5.jpg',
    '/img/foto6.jpg',
  ];

  const handleClick = () => {
    setStage('preparing');
    setProgress(0);
    setVisibleFrames([]);
    setCurrentPhotoIndex(0);
  };

  useEffect(() => {
    if (stage === 'preparing') {
      const dotsInterval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      const prepareTimeout = setTimeout(() => {
        setStage('printing');
      }, 2000);

      return () => {
        clearInterval(dotsInterval);
        clearTimeout(prepareTimeout);
      };
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'printing') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 100 / STEP_COUNT;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'printing' || stage === 'done') {
      const newVisible = Array.from({ length: TOTAL_PHOTOS }, (_, i) => {
        const photoStart = (100 / TOTAL_PHOTOS) * i;
        return progress >= photoStart ? i : -1;
      }).filter((v) => v !== -1);

      setVisibleFrames(newVisible);

      if (progress >= 100 && stage !== 'done') {
        setStage('done');
      }
    }
  }, [progress]);

  const photoIndex = Math.min(TOTAL_PHOTOS, Math.floor(progress / (100 / TOTAL_PHOTOS)) + 1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-[380px] md:max-w-[460px] bg-gray-100 rounded-[28px] p-2 shadow-2xl border-[5px] border-gray-200"
      >
        <div className="bg-[#0c0e25] rounded-xl p-4 flex flex-col gap-3">
          <div className="bg-[#7a819b] text-yellow-400 font-bold text-center text-3xl rounded-md px-2 py-1 tracking-wide">
            Gallery
          </div>
          <div className="bg-[#555b6e] text-yellow-300 text-center text-sm rounded-md px-2 py-1 tracking-wide">
            PHOTOBOX CERITANYA
          </div>

          {/* Frame Area */}
          <div className="bg-[#15182e] border border-gray-500 rounded-md px-2 sm:px-4 py-4 h-[320px] md:h-[400px] flex flex-col items-center text-white text-xs text-center gap-3 overflow-y-auto scrollbar scrollbar-thumb-green-400 scrollbar-track-gray-800 rounded">
            {stage === 'initial' && (
              <>
                <p className="mb-3">Photobox siap digunakan</p>
                <button
                  onClick={handleClick}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-1 rounded shadow-md tracking-widest"
                >
                  MULAI CETAK
                </button>
              </>
            )}

            {stage === 'preparing' && (
              <p className="text-yellow-400 text-base">Mempersiapkan photobox{dots}</p>
            )}

            {(stage === 'printing' || stage === 'done') && (
              <>
                <div className="flex flex-col gap-4 items-center w-full">
                  {Array.from({ length: TOTAL_PHOTOS }).map((_, i) => {
                    const photoStart = (100 / TOTAL_PHOTOS) * i;
                    const photoEnd = (100 / TOTAL_PHOTOS) * (i + 1);

                    if (!visibleFrames.includes(i)) return null;

                    let currentHeight = PHOTO_HEIGHT;
                    if (progress < photoEnd) {
                      const localProgress = (progress - photoStart) / (photoEnd - photoStart);
                      currentHeight = Math.floor(PHOTO_HEIGHT * localProgress);
                    }

                    return (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          ease: 'easeOut',
                          delay: i * 0.2,
                        }}
                        className="relative origin-top bg-white shadow-md rounded-[10px] border w-[180px] flex flex-col items-center overflow-hidden"
                      >
                        {/* Efek wipe */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                          <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: '100%' }}
                            transition={{
                              duration: 0.8,
                              ease: 'easeInOut',
                              delay: i * 0.2,
                            }}
                            className="w-full h-full bg-gradient-to-b from-yellow-200 via-yellow-100 to-transparent opacity-50"
                          />
                        </div>

                        {/* Garis atas */}
                        <div className="w-full h-[4px] bg-gradient-to-r from-white via-gray-300 to-white animate-pulse" />

                        {/* Gambar */}
                        <img
                          src={photoUrls[i]}
                          alt={`Foto ${i + 1}`}
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/240x180?text=Fallback')}
                          className="w-full object-cover transition-all duration-200 ease-in-out"
                          style={{ height: `${Math.max(currentHeight - 60, 0)}px` }}
                        />

                        {/* Footer Polaroid */}
                        <div className={`bg-white w-full h-[60px] flex items-center justify-center text-[18px] font-extrabold tracking-wide ${playfulColors[i % playfulColors.length]}`}>
                            {playfulLabels[i % playfulLabels.length]}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden mt-4">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-yellow-400 text-xs mt-1">
                  {stage === 'done'
                    ? 'Selesai mencetak semua foto'
                    : `Mencetak foto ${photoIndex} dari ${TOTAL_PHOTOS} (${Math.floor(progress)}%)`}
                </p>
              </>
            )}
          </div>

          {/* Navigasi */}
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/tetris">
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold w-full py-2 rounded text-sm tracking-widest shadow">
                SELANJUTNYA
              </button>
            </Link>
            <Link href="/">
              <button className="bg-orange-700 hover:bg-orange-800 text-white font-bold w-full py-2 rounded text-sm tracking-widest shadow">
                KEMBALI
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
