import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import SudokuGame from './components/SudokuGame';
import FlowerTransition from './components/FlowerTransition';
import LoadingScreen from './components/LoadingScreen';
import ChatPage from './components/ChatPage';
import { PageState } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  const [showTransition, setShowTransition] = useState(false);

  const handleSudokuComplete = () => {
    // Start the transition
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    // Once flower covers screen, switch to loading
    setCurrentPage('loading');
    setShowTransition(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage key="landing" onStart={() => setCurrentPage('sudoku')} />;
      case 'sudoku':
        return <SudokuGame key="sudoku" onComplete={handleSudokuComplete} />;
      case 'loading':
        return <LoadingScreen key="loading" onComplete={() => setCurrentPage('chat')} />;
      case 'chat':
        return <ChatPage key="chat" onComplete={() => setCurrentPage('next_chapter')} />;
      case 'next_chapter':
        return (
            <div className="flex items-center justify-center h-screen bg-fred-yellow text-center p-8 text-gray-800">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-4 text-fred-pink">To Be Continued...</h1>
                    <p className="opacity-90 font-medium">Happy Valentine's Day, Fred!</p>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="font-sans antialiased text-gray-900 relative">
      {/* Global Transition Overlay */}
      {showTransition && (
        <FlowerTransition onComplete={handleTransitionComplete} />
      )}

      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </main>
  );
};

export default App;