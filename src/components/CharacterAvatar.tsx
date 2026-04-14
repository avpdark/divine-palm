import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const CharacterAvatar: React.FC<{ isTyping?: boolean }> = ({ isTyping }) => {
  return (
    <div className="relative flex flex-col items-center justify-center mb-6">
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: isTyping ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Halo Effect */}
        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-150" />
        
        {/* Character Circle */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-orange-500/30 p-1 glass relative z-10 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/mystic-oracle/400/400" 
            alt="Oracle" 
            className="w-full h-full object-cover rounded-full opacity-80 grayscale-[30%] sepia-[20%]"
            referrerPolicy="no-referrer"
          />
          
          {/* Overlay Glow */}
          <div className="absolute inset-0 bg-linear-to-t from-orange-900/40 to-transparent" />
        </div>

        {/* Floating Sparkles */}
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-2 -right-2 text-orange-400"
        >
          <Sparkles size={16} />
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-center"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-orange-500/60 font-medium">The Divine Presence</span>
      </motion.div>
    </div>
  );
};
