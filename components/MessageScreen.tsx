'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function MessageScreen() {
  const greeting = 'Halooo Tireekk.';
  const wish = 'Hows ur day going?';
  const paragraphs = [
    'Semoga harimu selalu baik walau kadang tanpa aku di dalemnya. anjay hahahaha alay cok.',
    'Proud of you karena kamu udah bangun setiap harinya.',
    'Proud of you karena kamu ada disini.',
    'Aku harap kamu gak pernah lupa untuk apresiasi diri kamu sendiri, karena kamu udah berjuang setiap harinya walau terasa berat. You have done a great job! I always proud of u',
    'Di hari yang spesial buat aku ini (ga trlalu spesial juga sih jir) aku cuma mau bilang makasii yaa udah jadi teman baikku, maafin jugaa kalo aku kadang suka ngeselin dan annoying',
    'Seneng bisa jadi orang yang bisa hadir di kehidupan kamu, aku juga seneng kamu bisa hadir dan selalu ada di my kisah',
    'Seneng kalo ditanyain "gimana hari ini?" atau kek sekedar di tmi in. Seneng karena kamu masih inget aku masih ada di dunia ini.',
    'Ga yang harus selalu minta dipahami sepenuhnya, tapi kalo bisa dipeluk walau cuma lewat obrolan ringan, itu udah cukup bikin aku ngerasa gak sendirian.',
    'Sebuah keberuntungan banget bisa kenal dan temenan sama kamu sampai sejauh ini.',
    'Deeeem absolute cinema gasi kata kata aku dari tadi awal',
    'Maaf yyy kalo belakangan ini aku agak gimana gituu',
    'Jangan baeudan lagi plis',
  ];

  const [greetingShown, setGreetingShown] = useState(0);
  const [wishShown, setWishShown] = useState(0);
  const [paraShown, setParaShown] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fullParagraph = paragraphs.join('\n\n');

  useEffect(() => {
    if (done) return;
    if (greetingShown < greeting.length) {
      intervalRef.current = setTimeout(() => setGreetingShown(greetingShown + 1), 50);
    } else if (wishShown < wish.length) {
      intervalRef.current = setTimeout(() => setWishShown(wishShown + 1), 50);
    } else if (paraShown < fullParagraph.length) {
      intervalRef.current = setTimeout(() => setParaShown(paraShown + 1), 30);
    } else {
      setDone(true);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [greetingShown, wishShown, paraShown, done]);

  const handleSkip = () => {
    if (!done) {
      setGreetingShown(greeting.length);
      setWishShown(wish.length);
      setParaShown(fullParagraph.length);
      setDone(true);
    }
  };

  const getBlinkingCursor = () => <span className="animate-blink">|</span>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-200 w-[350px] rounded-2xl p-2 sm:p-4 shadow-2xl flex flex-col justify-between mx-4"
        style={{ maxHeight: '90vh' }}
      >
        <div className="bg-black text-green-400 p-2 sm:p-4 rounded-lg mt-1 mb-4 flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-green-500 text-center">Message</h1>

          <div className="text-left h-48 sm:h-56 overflow-y-auto pr-2 font-mono whitespace-pre-wrap text-xs sm:text-sm leading-relaxed scroll-smooth scrollbar scrollbar-thumb-green-400 scrollbar-track-gray-800 rounded">
            <p className="mb-2 min-h-[1.5em]">
              {greeting.slice(0, greetingShown)}
              {!done && greetingShown < greeting.length ? getBlinkingCursor() : ''}
            </p>
            <p className="mb-4 min-h-[1.5em]">
              {wish.slice(0, wishShown)}
              {!done && greetingShown === greeting.length && wishShown < wish.length ? getBlinkingCursor() : ''}
            </p>
            {fullParagraph.slice(0, paraShown).split('\n\n').map((para, idx) => (
              <p key={idx} className="mb-3 min-h-[1.5em]">
                {para}
              </p>
            ))}
            {!done && greetingShown === greeting.length && wishShown === wish.length && paraShown < fullParagraph.length && getBlinkingCursor()}
          </div>

          <button
            onClick={handleSkip}
            className="bg-blue-600 text-white text-sm font-bold py-2 rounded shadow-md w-full hover:bg-blue-700 transition-colors"
          >
            SKIP
          </button>
        </div>

        <div className="flex flex-col gap-2 w-full mt-auto">
          <Link href="/gallery">
            <button className="bg-green-700 text-white w-full py-2 rounded font-bold text-sm shadow-md hover:bg-green-800 transition-colors">
              SELANJUTNYA
            </button>
          </Link>
          <Link href="/">
            <button className="bg-orange-700 text-white w-full py-2 rounded font-bold text-sm shadow-md hover:bg-orange-800 transition-colors">
              KEMBALI
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
