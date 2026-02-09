import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import SudokuGame from './components/SudokuGame';
import { PageState } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage key="landing" onStart={() => setCurrentPage('sudoku')} />;
      case 'sudoku':
        return <SudokuGame key="sudoku" onComplete={() => setCurrentPage('next_chapter')} />;
      case 'next_chapter':
        return (
            <div className="flex items-center justify-center h-screen bg-fred-yellow-light text-center p-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">To Be Continued...</h1>
                    <p className="text-gray-600">The next surprise is loading for you.</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="font-sans antialiased text-gray-900">
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </main>
  );
};

export default App;
