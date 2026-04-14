import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const Processing: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Analyzing your life line...",
    "Understanding your energy...",
    "Connecting patterns...",
    "Reading the sacred imprints...",
    "Consulting the stars...",
    "Unveiling your destiny..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-48 h-48 rounded-full border-t-2 border-orange-500/30 border-r-2 border-orange-500/10"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-4 rounded-full border-b-2 border-purple-500/20 border-l-2 border-purple-500/5"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-orange-500/40 animate-pulse" />
        </div>
      </div>

      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl mystic-text font-light text-white/80 tracking-wide"
          >
            {texts[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-orange-500"
          />
        ))}
      </div>
    </div>
  );
};
