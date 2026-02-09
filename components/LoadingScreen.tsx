import React, { useEffect, useState } from 'react';
import { PawPrint } from 'lucide-react';
import { ASSETS } from '../assets/images';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 6000; // 6 seconds total loading time
    const intervalTime = 50;
    const steps = duration / intervalTime;
    
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 800); // Slightly longer delay to see final state
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Determine which Snoopy to show based on progress
  const getCurrentState = () => {
    if (progress < 30) return { src: ASSETS.SNOOPY.WALKING, text: "Suiting up..." };
    if (progress < 70) return { src: ASSETS.SNOOPY.BIKING, text: "Speeding to you..." };
    return { src: ASSETS.SNOOPY.FLYING, text: "Love is in the air!" };
  };

  const { src: currentImage, text: currentText } = getCurrentState();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-fred-pink text-white p-8 overflow-hidden relative">
      
      {/* Static Background patterns (No animation) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-fred-yellow rounded-full blur-3xl" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-lg">
        
        {/* Snoopy Display (Static Step-by-Step Image) */}
        <div className="mb-8 h-64 w-full relative flex items-center justify-center">
            {/* White circle background */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md w-64 h-64 mx-auto" />
            
            <img
                key={currentImage} // Forces instant switch without React reconciling attributes
                src={currentImage}
                alt="Snoopy Step"
                className="relative z-10 h-full object-contain drop-shadow-xl"
            />
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-serif font-bold mb-6 text-white drop-shadow-md text-center h-10">
            {currentText}
        </h2>

        {/* Progress Bar */}
        <div className="w-full px-8 mt-4">
            <div className="relative h-4 w-full">
                {/* Track Background */}
                <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm" />
                
                {/* Fill Bar */}
                <div 
                    className="absolute top-0 left-0 bottom-0 bg-fred-yellow rounded-full shadow-[0_0_15px_rgba(253,224,71,0.5)] transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />

                {/* Moving Thumb Indicator */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-100 ease-linear"
                    style={{ left: `${progress}%` }}
                >
                    <div className="bg-white p-2 rounded-full shadow-lg -translate-x-1/2 flex items-center justify-center">
                        <PawPrint className="w-5 h-5 text-fred-pink" fill="currentColor" />
                    </div>
                </div>
            </div>
            
            {/* Percentage Text */}
            <div className="mt-8 text-center font-mono font-bold text-xl text-fred-yellow drop-shadow-sm">
                {Math.round(progress)}%
            </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;