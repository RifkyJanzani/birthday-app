import Link from "next/link";

export default function GameBoy() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 w-[350px] rounded-2xl p-4 shadow-xl relative">
        <div className="text-xs text-gray-500 text-right mr-2">BIRTHDAY GIRL</div>
        <div className="bg-black text-green-400 text-center p-4 rounded-lg mt-1">
          <h1 className="text-2xl">Happy Birthday!</h1>
          <p className="text-yellow-500 mt-2 text-sm">Press Start Button</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-6">
          <a href="/candle" className="bg-blue-600 text-white py-2 rounded shadow-md text-center">LILIN</a>
          <a href="/message" className="bg-purple-500 text-white py-2 rounded shadow-md text-center">MESSAGE</a>
          <a href="/gallery" className="bg-green-700 text-white py-2 rounded shadow-md text-center">GALLERY</a>
          <a href="/tetris" className="bg-orange-600 text-white py-2 rounded shadow-md text-center">TETRIS</a>
        </div>

        <div className="flex justify-center mt-6">
          <div className="grid grid-cols-3 gap-2 w-[100px]">
            <div></div>
            <div className="bg-gray-800 text-white text-xs text-center p-1 rounded">↑</div>
            <div></div>
            <div className="bg-gray-800 text-white text-xs text-center p-1 rounded">←</div>
            <div className="bg-gray-700 w-full h-full rounded"></div>
            <div className="bg-gray-800 text-white text-xs text-center p-1 rounded">→</div>
            <div></div>
            <div className="bg-gray-800 text-white text-xs text-center p-1 rounded">↓</div>
            <div></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">A</div>
          <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">B</div>
        </div>

        <Link href="/candle">
            <div className="flex justify-center mt-4">
            <button className="bg-gray-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-inner">START</button>
            </div>
        </Link>
        
      </div>
    </div>
  );
}