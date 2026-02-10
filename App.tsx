import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import SudokuGame from './components/SudokuGame';
import FlowerTransition from './components/FlowerTransition';
import LoadingScreen from './components/LoadingScreen';
import ChatPage from './components/ChatPage';
import FinalPage from './components/FinalPage'; // Imported new component
import { PageState } from './types';
import { ASSETS } from './assets/images';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('landing');
  const [showTransition, setShowTransition] = useState(false);
  
  // Reference to hold audio instance so it persists across renders
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startBackgroundMusic = () => {
    if (audioRef.current) return; // Already playing

    const audio = new Audio(ASSETS.MUSIC.THEME);
    audio.loop = true;
    audio.volume = 0; // Start at 0 for fade in
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Fade in logic
            let vol = 0;
            const targetVol = 0.6; // Max volume
            const fadeInterval = setInterval(() => {
                if (vol < targetVol) {
                    vol += 0.05;
                    // Ensure we don't exceed 1 or target
                    audio.volume = Math.min(vol, targetVol);
                } else {
                    clearInterval(fadeInterval);
                }
            }, 500); // Step every 500ms
        }).catch(error => {
            console.warn("Autoplay prevented:", error);
        });
    }
    
    audioRef.current = audio;
  };

  const handleSudokuComplete = () => {
    // Start the visual transition
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    // Once flower covers screen, switch to loading
    setCurrentPage('loading');
    setShowTransition(false);
    
    // Start the music fade-in here
    startBackgroundMusic();
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
        return <FinalPage key="final" />;
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