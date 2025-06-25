'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 16;

const COLORS = [
  '', // 0 = empty
  '#00f0f0', // I - cyan
  '#f0f000', // O - yellow
  '#a000f0', // T - purple
  '#00f000', // S - green
  '#f00000', // Z - red
  '#0000f0', // J - blue
  '#f0a000', // L - orange
];

const POINTS_PER_LINE = 100;
const POINTS_PER_HARD_DROP = 2;

const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const TETROMINO = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
];

export type TetrisGameHandle = {
  moveLeft: () => void;
  moveRight: () => void;
  rotate: () => void;
  dropDown: () => void;
  resetGame: () => void;
};


const TetrisGame = forwardRef<TetrisGameHandle, { onScoreChange?: (score: number) => void, onGameOver?: () => void }>(
  ({ onScoreChange, onGameOver }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(generatePiece());
  const [ghostPiece, setGhostPiece] = useState<typeof currentPiece | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  function generatePiece() {
    const index = Math.floor(Math.random() * TETROMINO.length);
    return {
      shape: TETROMINO[index],
      row: 0,
      col: 3,
      color: index + 1,
    };
  }

  const isValidMove = (piece: typeof currentPiece, newRow: number, newCol: number) => {
    return piece.shape.every((row, rIdx) => {
      return row.every((val, cIdx) => {
        if (!val) return true;
        const nextRow = newRow + rIdx;
        const nextCol = newCol + cIdx;
        return (
          nextRow >= 0 &&
          nextRow < ROWS &&
          nextCol >= 0 &&
          nextCol < COLS &&
          !board[nextRow][nextCol]
        );
      });
    });
  };

  const updateGhostPiece = (piece: typeof currentPiece) => {
    let ghostRow = piece.row;
    while (isValidMove(piece, ghostRow + 1, piece.col)) {
      ghostRow++;
    }
    setGhostPiece({ ...piece, row: ghostRow });
  };

  const movePiece = (dir: number) => {
    setCurrentPiece(prev => {
      const newCol = prev.col + dir;
      if (isValidMove(prev, prev.row, newCol)) {
        const newPiece = { ...prev, col: newCol };
        updateGhostPiece(newPiece);
        return newPiece;
      }
      return prev;
    });
  };

  const rotatePiece = () => {
    setCurrentPiece(prev => {
      const newShape = prev.shape[0].map((_, i) =>
        prev.shape.map(row => row[i]).reverse()
      );
      const newPiece = { ...prev, shape: newShape };
      if (isValidMove(newPiece, prev.row, prev.col)) {
        updateGhostPiece(newPiece);
        return newPiece;
      }
      return prev;
    });
  };

  const checkLines = (newBoard: number[][]) => {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row].every(cell => cell !== 0)) {
        newBoard.splice(row, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        row++;
      }
    }
    if (linesCleared > 0) {
      setScore(prev => {
        const newScore = prev + (linesCleared * POINTS_PER_LINE);
        // onScoreChange?.(newScore);
        return newScore;
      });
    }
    return newBoard;
  };

  const dropPiece = () => {
    if (gameOver) return;

    setCurrentPiece(prev => {
      const newRow = prev.row + 1;
      if (isValidMove(prev, newRow, prev.col)) {
        const newPiece = { ...prev, row: newRow };
        updateGhostPiece(newPiece);
        return newPiece;
      }

      const newBoard = [...board];
      prev.shape.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          if (val) {
            newBoard[prev.row + rIdx][prev.col + cIdx] = prev.color;
          }
        });
      });

      const updatedBoard = checkLines(newBoard);
      setBoard(updatedBoard);

      const nextPiece = generatePiece();
      if (!isValidMove(nextPiece, nextPiece.row, nextPiece.col)) {
        setGameOver(true);
      }
      updateGhostPiece(nextPiece);
      return nextPiece;
    });
  };

  const hardDrop = () => {
    if (gameOver) return;

    setCurrentPiece(prev => {
      let newRow = prev.row;
      let dropDistance = 0;
      while (isValidMove(prev, newRow + 1, prev.col)) {
        newRow++;
        dropDistance++;
      }
      return { ...prev, row: newRow };
    });
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    const newPiece = generatePiece();
    setCurrentPiece(newPiece);
    updateGhostPiece(newPiece);
    setScore(0);
    onScoreChange?.(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useImperativeHandle(ref, () => ({
    moveLeft: () => movePiece(-1),
    moveRight: () => movePiece(1),
    rotate: () => rotatePiece(),
    dropDown: () => hardDrop(),
    resetGame: () => resetGame(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        dropPiece();
      }, 800);
    }

    drawBoard(ctx);
    onScoreChange?.(score);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [board, currentPiece, score, isPlaying, gameOver]);

  useEffect(() => {
    if (gameOver && onGameOver) {
      onGameOver();
    }
  }, [gameOver, onGameOver]);

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000520';
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_SIZE, 0);
      ctx.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE);
      ctx.stroke();
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = board[row][col];
        if (cell) {
          ctx.fillStyle = COLORS[cell];
          ctx.fillRect(
            col * BLOCK_SIZE,
            row * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      }
    }

    if (ghostPiece) {
      ghostPiece.shape.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          if (val) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(
              (ghostPiece.col + cIdx) * BLOCK_SIZE,
              (ghostPiece.row + rIdx) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1
            );
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.strokeRect(
              (ghostPiece.col + cIdx) * BLOCK_SIZE,
              (ghostPiece.row + rIdx) * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1
            );
          }
        });
      });
    }

    currentPiece.shape.forEach((row, rIdx) => {
      row.forEach((val, cIdx) => {
        if (val) {
          ctx.fillStyle = COLORS[currentPiece.color];
          ctx.fillRect(
            (currentPiece.col + cIdx) * BLOCK_SIZE,
            (currentPiece.row + rIdx) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      });
    });

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.fillStyle = 'red';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', (COLS * BLOCK_SIZE) / 2, (ROWS * BLOCK_SIZE) / 2);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={COLS * BLOCK_SIZE}
      height={ROWS * BLOCK_SIZE}
      className="border-[2px] border-gray-300 rounded-lg bg-[#000520]"
    />
  );
});

TetrisGame.displayName = 'TetrisGame';
export default TetrisGame;
