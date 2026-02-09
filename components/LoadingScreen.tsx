import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Snoopy Flying Ace Sequence
  // These URLs match the progression: Walking with gear -> Red Motorcycle -> Flying
  const SNOOPY_WALKING = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHM5eG1vY3lmaHM5eG1vY3lmaHM5eG1vY3lmaHM5eG1vY3lmaHM5eG1vY3lmaHM5eG1vY3lmaHM5eG1vY3kv3o6vXVzKWtk4jB9bKf/giphy.gif"; // Walking with scarf/goggles
  const SNOOPY_BIKING = "https://i.pinimg.com/originals/52/69/3a/52693a027b40974e64b854e488950348.gif"; // Red Motorcycle
  const SNOOPY_FLYING = "https://i.pinimg.com/originals/8a/75/b2/8a75b252062363198889955376548777.gif"; // Flying (Doghouse/Plane)

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
    if (progress < 30) return { src: SNOOPY_WALKING, text: "Suiting up..." };
    if (progress < 70) return { src: SNOOPY_BIKING, text: "Speeding to you..." };
    return { src: SNOOPY_FLYING, text: "Love is in the air!" };
  };

  const { src: currentImage, text: currentText } = getCurrentState();

  // Animation variants for the image swap
  const imageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-fred-pink text-white p-8 overflow-hidden relative">
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-fred-yellow rounded-full blur-3xl" />
          {/* Animated clouds for flying effect */}
          <motion.div 
            className="absolute top-1/4 left-[-10%] w-20 h-10 bg-white rounded-full blur-xl"
            animate={{ x: ['120vw'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-2/3 left-[-10%] w-32 h-16 bg-white rounded-full blur-xl"
            animate={{ x: ['120vw'] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-lg">
        
        {/* Snoopy Display */}
        <div className="mb-12 h-64 w-full relative flex items-center justify-center">
            {/* White circle background behind snoopy */}
            <motion.div 
                className="absolute inset-0 bg-white/20 rounded-full blur-md w-64 h-64 mx-auto"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
            
            <motion.img
                key={currentImage} // Key change triggers animation
                src={currentImage}
                alt="Snoopy Animation"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={imageVariants}
                transition={{ duration: 0.4 }}
                className="relative z-10 h-full object-contain drop-shadow-xl"
            />
        </div>

        {/* Loading Text */}
        <motion.h2 
            key={currentText}
            className="text-3xl font-serif font-bold mb-8 text-white drop-shadow-md text-center h-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            {currentText}
        </motion.h2>

        {/* Paw Print Progress Bar */}
        <div className="w-full flex justify-between items-center px-4 md:px-10">
            {[...Array(10)].map((_, i) => {
                const stepThreshold = (i + 1) * 10;
                const isFilled = progress >= stepThreshold;
                
                return (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ 
                            scale: isFilled ? 1.2 : 1, 
                            opacity: isFilled ? 1 : 0.3,
                            color: isFilled ? '#FDE047' : '#FFFFFF' // Yellow when filled, White when empty
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <PawPrint 
                            className="w-6 h-6 md:w-8 md:h-8" 
                            fill={isFilled ? "currentColor" : "none"} 
                        />
                    </motion.div>
                );
            })}
        </div>
        
        {/* Percentage */}
        <div className="mt-4 font-mono font-bold text-xl text-fred-yellow">
            {Math.round(progress)}%
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;