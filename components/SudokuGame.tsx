import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, Heart } from 'lucide-react';
import { GridType, SudokuCell } from '../types';
import { getInitialGrid, SOLVED_GRID } from '../constants';
import confetti from 'canvas-confetti';

interface SudokuGameProps {
  onComplete: () => void;
}

const SudokuGame: React.FC<SudokuGameProps> = ({ onComplete }) => {
  const [grid, setGrid] = useState<GridType>(getInitialGrid());
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Check completion whenever grid changes
  useEffect(() => {
    const checkWin = () => {
      // 1. Check if grid is full
      const isFull = grid.every(row => row.every(cell => cell.value !== 0));
      if (!isFull) return;

      // 2. Check correctness against solved grid
      let isCorrect = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (grid[r][c].value !== SOLVED_GRID[r][c]) {
            isCorrect = false;
            break;
          }
        }
      }

      if (isCorrect) {
        setIsComplete(true);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FDE047', '#F472B6', '#FB7185']
        });
      }
    };
    
    // Slight delay to allow render update before check
    const timeout = setTimeout(checkWin, 200);
    return () => clearTimeout(timeout);
  }, [grid]);

  const handleCellClick = (r: number, c: number) => {
    if (isComplete) return;
    setSelectedCell({ r, c });
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || isComplete) return;
    const { r, c } = selectedCell;

    if (grid[r][c].isInitial) return; // Cannot edit initial cells

    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = { ...newGrid[r][c], value: num };
    setGrid(newGrid);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedCell || isComplete) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCell, isComplete, grid]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-yellow-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-4xl w-full flex flex-col items-center"
      >
        <div className="text-center mb-8">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4"
            >
                <Heart className="text-fred-pink fill-fred-pink w-6 h-6 animate-pulse" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2">
            Just a warm up...
            </h2>
            <p className="text-gray-500">Fill in the missing numbers to continue!</p>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-3xl shadow-xl border-4 border-fred-yellow-light">
          <div className="grid grid-cols-9 gap-0.5 bg-gray-300 border-2 border-gray-400 select-none">
            {grid.map((row, rIndex) => (
              row.map((cell, cIndex) => {
                // Determine styling based on position (3x3 blocks)
                const borderRight = (cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-2 border-r-gray-400' : '';
                const borderBottom = (rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-2 border-b-gray-400' : '';
                const isSelected = selectedCell?.r === rIndex && selectedCell?.c === cIndex;
                
                return (
                  <motion.div
                    key={`${rIndex}-${cIndex}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCellClick(rIndex, cIndex)}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center 
                      text-lg md:text-xl font-medium cursor-pointer transition-colors duration-200
                      ${borderRight} ${borderBottom}
                      ${cell.isInitial ? 'bg-gray-50 text-gray-900 font-bold' : 'bg-white text-fred-pink'}
                      ${isSelected ? '!bg-fred-yellow !text-gray-900 shadow-inner' : ''}
                      ${isComplete && 'bg-green-100'}
                    `}
                  >
                    {cell.value !== 0 ? cell.value : ''}
                  </motion.div>
                );
              })
            ))}
          </div>
        </div>

        {/* Number Pad for Mouse/Touch users */}
        <div className="mt-8 grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
             <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full font-bold shadow-sm transition-all
                  ${num === 0 
                    ? 'bg-red-100 text-red-500 hover:bg-red-200 col-span-1 md:col-span-1 flex items-center justify-center' 
                    : 'bg-white text-gray-700 hover:bg-fred-yellow hover:text-white border border-gray-100'}
                `}
             >
                {num === 0 ? <RefreshCw size={18} /> : num}
             </button>
          ))}
        </div>

        {/* Success Message */}
        <AnimatePresence>
            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-fred-pink"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Great Job, Fred!</h3>
                        <p className="text-gray-600 mb-6">You solved it! That wasn't so hard, right?</p>
                        <button 
                            onClick={onComplete}
                            className="w-full py-3 bg-fred-pink text-white rounded-xl font-bold shadow-lg hover:bg-fred-red transition-colors"
                        >
                            Continue Journey
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default SudokuGame;
