import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, Mic, Plus, Send } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-yellow-50 via-fred-yellow-light/50 to-white font-sans text-gray-800 relative overflow-hidden">
      
      {/* Decorative blurred blobs to maintain yellow/pink theme subtly */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-fred-yellow/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-fred-pink/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <div className="w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 text-gray-700">
            <Sparkles className="w-5 h-5 text-fred-pink" />
            <span className="font-medium text-lg tracking-tight">FredAI</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-fred-yellow to-fred-pink flex items-center justify-center text-white font-bold text-sm shadow-sm">
            F
        </div>
      </div>

      {/* Mobile Warning */}
      {isMobile && (
         <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-fred-red/90 backdrop-blur text-white px-4 py-3 text-center text-sm font-medium z-50 flex items-center justify-center gap-2 absolute top-16 w-full left-0"
         >
            <Monitor size={16} />
            For the best experience, please use a desktop!
         </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-6 md:px-12 pb-20">
        
        {/* Greeting Section */}
        <div className="mb-12">
            <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-7xl font-medium tracking-tight mb-4"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-fred-pink via-orange-400 to-fred-yellow drop-shadow-sm">Hi, Fred!</span>
            </motion.h1>
            <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl font-medium text-gray-400 tracking-tight"
            >
                Ready for your surprise?
            </motion.h2>
        </div>

        {/* Input Bar Simulation Button */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            onClick={onStart}
            className="w-full"
        >
             <div className="w-full bg-white/80 hover:bg-white transition-colors duration-200 rounded-[2rem] h-16 md:h-[4.5rem] flex items-center px-6 cursor-pointer relative group border border-white/50 shadow-sm">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-yellow-100 transition-colors mr-2">
                     <Plus className="text-gray-500 w-5 h-5" />
                </div>
                
                <div className="flex-1 text-gray-500 text-lg font-normal truncate">
                    Tap to start the Valentine's game...
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-yellow-100 transition-colors">
                        <Mic className="text-gray-500 w-5 h-5" />
                    </div>
                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-yellow-100 transition-colors group-hover:text-fred-pink">
                        <Send className="text-gray-500 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
             </div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;