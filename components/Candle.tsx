'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

export default function BlowCandlePage() {
  const [blown, setBlown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({ width, height });
  }, []);

  const handleBlow = () => {
    setBlown(true);
    setShowConfetti(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-800">
      {showConfetti && (
        <ReactConfetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-200 w-full max-w-[350px] rounded-2xl p-2 sm:p-4 shadow-2xl flex flex-col justify-between max-h-full overflow-y-auto mx-4"
      >
        {/* Alert Popup */}
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowAlert(false)} />
              <motion.div 
                className="bg-[#18192b] border-4 border-yellow-300 rounded-xl px-4 sm:px-8 py-4 sm:py-6 flex flex-col items-center shadow-2xl relative z-10"
                style={{minWidth: 260}}
              >
                <div className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-yellow-300" style={{fontFamily: 'Press Start 2P, monospace'}}>
                  Oops!
                </div>
                <div className="text-green-400 text-center mb-6 font-mono">
                  Tiup lilin dulu kocak
                </div>
                <button
                  onClick={() => setShowAlert(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded px-6 py-2 border-2 border-blue-300 shadow transition-colors"
                  style={{fontFamily: 'Press Start 2P, monospace'}}
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-black text-green-400 p-4 rounded-lg mt-1 mb-4 flex flex-col gap-4">

          <div className="flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl font-bold mb-6 text-yellow-300 text-center"
            >
              AYOO TIUP DULUU
            </motion.h1>

            {/* Kue Ulang Tahun */}
                <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative w-40 sm:w-48 h-48 sm:h-56 flex items-end justify-center"
                >
                {/* Base Cake */}
                <div className="absolute bottom-0 w-40 h-20 bg-pink-300 rounded-t-[30px] border-[5px] border-pink-400 shadow-inner" />

                {/* Middle Layer */}
                <div className="absolute bottom-14 w-36 h-16 bg-white rounded-t-[20px] border-[4px] border-pink-200 shadow-md" />

                {/* Top Layer */}
                <div className="absolute bottom-[100px] w-28 h-10 bg-yellow-100 rounded-t-[15px] border-[3px] border-yellow-200 shadow-sm z-10" />

                {/* Icing Drip */}
                <div className="absolute bottom-[100px] w-28 h-6 bg-pink-200 rounded-b-full blur-[1px] opacity-90 z-10" />

                {/* Candle */}
                <div className="absolute bottom-[110px] w-2 h-10 bg-gradient-to-b from-red-500 to-red-800 rounded-sm shadow-md z-20" />

                {/* Flame */}
                <AnimatePresence>
                    {!blown && (
                    <motion.div
                        key="flame"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{
                        opacity: 1,
                        y: [0, -1.5, 0],
                        scale: [1, 1.2, 1],
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: "easeInOut"
                        }}
                        className="absolute bottom-[150px] w-4 h-6 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full shadow-lg z-30"
                    >
                        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-sm opacity-70 animate-ping" />
                    </motion.div>
                    )}
                </AnimatePresence>

                {/* Sprinkle Decoration */}
                <div className="absolute bottom-20 w-full flex justify-around px-2 z-20">
                    {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ['#ff6347', '#ffa500', '#00ced1', '#9370db', '#3cb371'][i % 5] }}
                    />
                    ))}
                </div>
                </motion.div>

            {/* Tombol */}
            {!blown ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBlow}
                className="mt-8 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-full shadow-md tracking-wide"
              >
                TIUP
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-8 text-xl font-bold text-yellow-300 text-center"
              >
                 Yaaayyy!! Happy Birthday!!
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link href={blown ? "/message" : "#"}>
            <button 
              onClick={(e) => {
                if (!blown) {
                  e.preventDefault();
                  setShowAlert(true);
                }
              }}
              className={`w-full py-2 rounded font-bold text-sm shadow-md ${
                blown 
                  ? "bg-green-700 text-white hover:bg-green-800" 
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              SELANJUTNYA
            </button>
          </Link>
          <Link href="/">
            <button className="bg-orange-700 text-white w-full py-2 rounded font-bold text-sm shadow-md">
              KEMBALI
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}