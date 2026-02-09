import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-pink-50 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-fred-yellow opacity-20 blur-[100px] rounded-full mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fred-pink opacity-20 blur-[100px] rounded-full mix-blend-multiply" />

      {/* Mobile Warning Banner */}
      {isMobile && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 w-full bg-fred-red text-white p-3 flex items-center justify-center gap-2 text-sm font-medium z-50 shadow-md"
        >
          <Monitor size={16} />
          <span>For the best experience, please switch to desktop!</span>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 px-6 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 inline-block"
        >
           <Sparkles className="w-12 h-12 text-fred-yellow mx-auto mb-4" />
        </motion.div>

        <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-fred-yellow via-orange-400 to-fred-pink pb-2">
          Hi, Fred!
        </h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-gray-600 text-lg md:text-xl font-light mb-12 leading-relaxed"
        >
          I've made something special for you this Valentine's Day.<br/>
          Are you ready to begin?
        </motion.p>

        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 bg-white border-2 border-fred-yellow text-gray-800 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:border-fred-pink transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-fred-yellow to-fred-pink opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <span>Let's Go</span>
          <ArrowRight className="w-5 h-5 text-fred-pink group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
