import React from 'react';
import { motion } from 'motion/react';

export const OracleCharacter: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-96 md:h-96">
      {/* Spirit Aura */}
      <div className="absolute inset-0 bg-gold-glow blur-[40px] rounded-full animate-pulse-glow" />
      
      {/* Spirit Core */}
      <motion.div 
        className="relative z-10 w-32 h-32 md:w-48 md:h-48 flex items-center justify-center animate-float"
      >
        <div className="absolute inset-0 bg-radial-[circle_at_50%_50%,#fff_0%,#a0c4ff_40%,transparent_100%] rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)]" />
        
        {/* Eyes / Core Details */}
        <div className="relative z-20 flex gap-8">
          <motion.div 
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </motion.div>
      
      {/* Floating Particles around character */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-mystic-gold rounded-full"
            animate={{
              x: [Math.random() * 300 - 150, Math.random() * 300 - 150],
              y: [Math.random() * 300 - 150, Math.random() * 300 - 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
};
