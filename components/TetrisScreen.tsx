'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import TetrisGame, { TetrisGameHandle } from './TetrisGame';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TetrisScreen() {
  const gameRef = useRef<TetrisGameHandle>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRef.current || !isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          gameRef.current.moveLeft();
          break;
        case 'ArrowRight':
          gameRef.current.moveRight();
          break;
        case 'ArrowUp':
          gameRef.current.rotate();
          break;
        case 'ArrowDown':
          gameRef.current.dropDown();
          break;
        case ' ':
          gameRef.current.dropDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  const handleStartGame = () => {
    if (gameRef.current) {
      gameRef.current.resetGame();
      setIsPlaying(true);
      setGameOver(false);
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
  };

  const handleConfirm = () => {
    setGameOver(false);
    setIsPlaying(false);
    setScore(0);
    setShowReminder(true);
  };

  const handleReminderOk = () => {
    setShowReminder(false);
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-[#2e2e2e] text-green-400 p-4 rounded-2xl w-[360px] h-[600px] flex flex-col justify-between border-[8px] border-gray-200 shadow-lg"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-2"
      >
        <h1 className="text-3xl text-green-500 font-bold">Tetris</h1>
        <p className="text-yellow-400 text-base mt-1">Score: {score}</p>
      </motion.div>

      {/* Game Area */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex-1 flex items-center justify-center relative"
      >
        <TetrisGame ref={gameRef} onScoreChange={setScore} onGameOver={handleGameOver} />
        {!isPlaying && !gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75"
          >
            <div className="text-center">
              <p className="text-yellow-400 text-xl mb-4">Press</p>
              <button
                onClick={handleStartGame}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded font-bold text-lg transition-colors"
              >
                START GAME
              </button>
            </div>
          </motion.div>
        )}
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="bg-[#18192b] border-4 border-yellow-300 rounded-xl px-8 py-8 flex flex-col items-center shadow-2xl" style={{minWidth: 260}}>
              <div className="text-5xl font-bold mb-6" style={{color: '#e25a1b', fontFamily: 'Press Start 2P, monospace', letterSpacing: 2}}>GAME<br/>OVER</div>
              <button
                onClick={handleConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded px-8 py-2 border-2 border-blue-300 shadow transition-colors tracking-widest"
                style={{fontFamily: 'Press Start 2P, monospace'}}
              >
                CONFIRM
              </button>
            </div>
          </motion.div>
        )}
        {showReminder && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="bg-[#18192b] border-4 border-yellow-300 rounded-xl px-6 py-8 flex flex-col items-center shadow-2xl" style={{minWidth: 260}}>
              <div className="text-4xl font-bold mb-4" style={{color: '#ffe14b', fontFamily: 'Press Start 2P, monospace', letterSpacing: 2}}>REMINDER</div>
              <div className="text-green-400 text-lg mb-6 text-center font-mono" style={{lineHeight: '1.3', fontFamily: 'Press Start 2P, monospace'}}>
                Aaanjay, kereenn. Tapi walaupun kamu kalah,<br/>kamu selalu menang kok di hatiku.<br/>deeeemmmm.<br/>*ini yang urang tunjukin tea wkwkwk
              </div>
              <button
                onClick={handleReminderOk}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded px-8 py-2 border-2 border-blue-300 shadow transition-colors tracking-widest"
                style={{fontFamily: 'Press Start 2P, monospace'}}
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-3 gap-1">
        <button
          onClick={() => isPlaying && gameRef.current?.moveLeft()}
          className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 text-xl rounded transition-colors"
        >
          ‹
        </button>
        <button
          onClick={() => isPlaying && gameRef.current?.rotate()}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-1 h-10 text-sm font-bold rounded transition-colors"
        >
          ROTATE
        </button>
        <button
          onClick={() => isPlaying && gameRef.current?.moveRight()}
          className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 text-xl rounded transition-colors"
        >
          ›
        </button>
      </div>

      {/* Drop & Start */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => isPlaying && gameRef.current?.dropDown()}
          className="bg-purple-700 hover:bg-purple-800 text-white py-2 w-1/2 rounded font-bold text-sm transition-colors"
        >
          DROP
        </button>
        <button
          onClick={handleStartGame}
          className="bg-green-700 hover:bg-green-800 text-white py-2 w-1/2 rounded font-bold text-sm transition-colors"
        >
          RESTART
        </button>
      </div>

      {/* Back */}
      <Link href="/">
        <button className="bg-orange-700 hover:bg-orange-800 text-white py-2 mt-2 w-full rounded font-bold text-sm transition-colors">
          KEMBALI
        </button>
      </Link>

      {/* Controls Help
      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>Controls: Arrow Keys to move, Up to rotate, Down/Space to drop</p>
      </div> */}
    </motion.div>
  );
}
