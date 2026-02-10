import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FinalPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-fred-pink text-white relative overflow-hidden p-8">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-fred-yellow/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 1.2, bounce: 0.5 }}
        className="flex flex-col items-center text-center z-10"
      >
        {/* Heart Icon */}
        <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="mb-8 relative"
        >
            <div className="absolute inset-0 bg-fred-yellow blur-xl opacity-50 rounded-full scale-150" />
            <Heart size={120} fill="#FDE047" className="text-fred-yellow relative z-10 drop-shadow-xl" />
        </motion.div>

        {/* Greetings */}
        <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-md text-fred-yellow"
        >
            Happy Valentine's Day
        </motion.h1>

        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-md"
        >
            <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed">
                "Hehe, if you want to reply, you can text me in WhatsApp"
            </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default FinalPage;