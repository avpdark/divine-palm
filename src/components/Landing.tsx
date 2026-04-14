import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <h1 className="text-5xl md:text-8xl font-light tracking-tighter mystic-text">
          Divine <span className="text-orange-500 italic">Oracle</span>
        </h1>
        
        <p className="max-w-xl mx-auto text-base md:text-xl text-white/60 font-light leading-relaxed">
          Step into the sanctuary of wisdom. Let the ancient art of palmistry 
          reveal the hidden patterns of your soul and guide your path forward.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <button
          onClick={onStart}
          className="group relative px-10 py-5 bg-white text-black rounded-full font-medium overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
            Enter the Sanctuary
            <ArrowRight size={20} />
          </span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="flex gap-8 text-[10px] uppercase tracking-[0.3em] text-white/50"
      >
        <span>Ancient Wisdom</span>
        <span>•</span>
        <span>Modern Insight</span>
        <span>•</span>
        <span>Divine Path</span>
      </motion.div>
    </div>
  );
};
