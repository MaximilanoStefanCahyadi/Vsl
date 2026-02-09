import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, Trophy, Timer, Pause, Play, AlertCircle, Heart } from 'lucide-react';
import { GridType } from '../types';
import { getInitialGrid, SOLVED_GRID } from '../constants';
import confetti from 'canvas-confetti';

interface SudokuGameProps {
  onComplete: () => void;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<GridType>(getInitialGrid());
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  // New Game Stats State
  const [score, setScore] = useState(999995);
  const [mistakes, setMistakes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPaused && !isComplete) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isComplete]);

  // Check completion
  useEffect(() => {
    const checkWin = () => {
      const isFull = grid.every(row => row.every(cell => cell.value !== 0));
      if (!isFull) return;

      let isCorrect = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c].value !== SOLVED_GRID[r][c]) {
            isCorrect = false;
            break;
          }
        }
      }

      if (isCorrect && !isComplete) {
        setIsComplete(true);
        // Animate score up
        const targetScore = score + 500;
        const step = 20;
        const interval = setInterval(() => {
            setScore(prev => {
                if (prev >= targetScore) {
                    clearInterval(interval);
                    return targetScore;
                }
                return prev + step;
            });
        }, 50);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FDE047', '#F472B6', '#FB7185']
        });
      }
    };
    
    // Slight delay to check after render
    const timeout = setTimeout(checkWin, 200);
    return () => clearTimeout(timeout);
  }, [grid]);

  const handleCellClick = (r: number, c: number) => {
    if (isComplete || isPaused) return;
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isComplete || isPaused) return;
    const { r, c } = selectedCell;

    if (grid[r][c].isInitial) return; 

    // Logic for mistakes and immediate validation visual
    const correctValue = SOLVED_GRID[r][c];
    const isMistake = num !== 0 && num !== correctValue;

    if (isMistake) {
        setMistakes(prev => prev + 1);
    }

    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = { 
        ...newGrid[r][c], 
        value: num,
        isValid: !isMistake // Mark invalid if it doesn't match solved grid
    };
    setGrid(newGrid);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell || isComplete || isPaused) return;
    const key = parseInt(e.key);
    if (!isNaN(key) && key >= 1 && key <= 9) {
      handleNumberInput(key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleNumberInput(0);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isComplete, grid, isPaused]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatScore = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-yellow-50 font-sans text-gray-800">
      
      {/* Top Game Bar - Sticky */}
      <div className="w-full bg-white shadow-sm border-b border-fred-yellow-light p-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            
            {/* Score Section */}
            <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Time</span>
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-fred-yellow fill-fred-yellow" />
                    <span className="text-xl font-bold text-gray-700 font-serif">{formatScore(score)}</span>
                </div>
            </div>

            {/* Mistakes Section */}
            <div className="flex flex-col items-center">
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mistakes</span>
                 <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-gray-700">{mistakes}</span>
                    <span className="text-gray-400 text-sm">/ ∞</span>
                 </div>
            </div>

            {/* Timer Section */}
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-0.5">
                         <motion.div
                            animate={{ scale: isPaused ? 1 : [1, 1.25, 1] }}
                            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                         >
                            <Heart className="w-3 h-3 text-fred-red fill-fred-red" />
                         </motion.div>
                         <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</span>
                    </div>
                    <div className="text-xl font-bold text-gray-700 font-mono tracking-tight w-16 text-right">
                        {formatTime(seconds)}
                    </div>
                </div>
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600"
                >
                    {isPaused ? <Play size={20} className="ml-1" /> : <Pause size={20} />}
                </button>
            </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        
        {/* Pause Overlay */}
        <AnimatePresence>
            {isPaused && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center"
                >
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-fred-yellow text-center">
                        <Pause className="w-16 h-16 text-fred-pink mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Game Paused</h3>
                        <button 
                            onClick={() => setIsPaused(false)}
                            className="px-8 py-3 bg-fred-yellow text-gray-900 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Resume
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col items-center transition-filter duration-300 ${isPaused ? 'blur-sm' : ''}`}
        >
            <div className="bg-white p-2 md:p-4 rounded-xl shadow-lg border border-gray-100 mb-6">
            <div className="grid grid-cols-9 gap-0.5 bg-gray-300 border-2 border-gray-400 select-none">
                {grid.map((row, rIndex) => (
                row.map((cell, cIndex) => {
                    const borderRight = (cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-2 border-r-gray-400' : '';
                    const borderBottom = (rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-2 border-b-gray-400' : '';
                    const isSelected = selectedCell?.r === rIndex && selectedCell?.c === cIndex;
                    
                    // Text color logic
                    let textColor = 'text-fred-pink';
                    if (cell.isInitial) textColor = 'text-gray-900';
                    if (!cell.isValid) textColor = 'text-red-500'; // Error color
                    if (isSelected) textColor = 'text-gray-900';

                    return (
                    <motion.div
                        key={`${rIndex}-${cIndex}`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCellClick(rIndex, cIndex)}
                        className={`
                        w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 flex items-center justify-center 
                        text-xl md:text-2xl font-medium cursor-pointer transition-colors duration-200
                        ${borderRight} ${borderBottom}
                        ${cell.isInitial ? 'bg-gray-50 font-bold' : 'bg-white'}
                        ${isSelected ? '!bg-fred-yellow shadow-inner' : ''}
                        ${!cell.isValid && !cell.isInitial && !isSelected ? 'bg-red-50' : ''} 
                        ${textColor}
                        `}
                    >
                        {cell.value !== 0 ? cell.value : ''}
                    </motion.div>
                    );
                })
                ))}
            </div>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 w-full max-w-lg px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    className={`
                    h-12 md:h-14 rounded-2xl font-bold shadow-sm transition-all text-lg md:text-xl
                    ${num === 0 
                        ? 'bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center' 
                        : 'bg-white text-gray-700 hover:bg-fred-yellow hover:text-gray-900 hover:-translate-y-1 border border-gray-100'}
                    `}
                >
                    {num === 0 ? <RefreshCw size={20} /> : num}
                </button>
            ))}
            </div>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center relative overflow-hidden"
                    >
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-fred-yellow via-fred-pink to-fred-red" />
                        
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Trophy className="w-10 h-10 text-green-600 fill-green-600" />
                        </div>

                        <h3 className="text-3xl font-serif font-bold text-gray-800 mb-2">Excellent!</h3>
                        <p className="text-gray-500 mb-8">
                            You finished the puzzle in <span className="font-bold text-gray-800">{formatTime(seconds)}</span> with <span className="font-bold text-gray-800">{mistakes}</span> mistakes.
                        </p>
                        
                        <div className="bg-yellow-50 rounded-xl p-4 mb-8 flex items-center justify-between border border-yellow-100">
                            <span className="text-gray-500 font-medium">New Score</span>
                            <span className="text-2xl font-bold text-fred-pink">{formatScore(score)}</span>
                        </div>

                        <button 
                            onClick={onComplete}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Claim Prize</span>
                            <motion.span 
                                animate={{ x: [0, 5, 0] }} 
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                →
                            </motion.span>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SudokuGame;