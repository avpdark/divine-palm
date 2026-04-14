import React from 'react';
import { motion } from 'motion/react';
import { Background } from './components/Background';
import { OracleCharacter } from './components/OracleCharacter';
import { Conversation } from './components/Conversation';
import { AmbientMusic } from './components/AmbientMusic';

export default function App() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden selection:bg-mystic-gold/30 selection:text-mystic-gold">
      {/* Mystical Background Layer */}
      <Background />

      {/* Oracle Character Layer (Fixed in center) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <OracleCharacter />
      </div>

      {/* Interaction Layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 md:h-20 px-4 md:px-10 flex justify-between items-center border-b border-mystic-gold/25 bg-linear-to-b from-black/50 to-transparent">
          <h1 className="text-sm md:text-xl font-display tracking-[2px] md:tracking-[4px] text-mystic-gold uppercase font-light">
            Divine Palm Oracle
          </h1>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex gap-3 text-[10px] uppercase tracking-widest text-text-muted">
              <span className="text-mystic-gold underline underline-offset-4">English</span>
              <span>Español</span>
              <span>Deutsch</span>
              <span>Русский</span>
            </div>
            <div className="flex items-center gap-1 opacity-50">
              {[12, 18, 8, 15, 10, 14].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [h, h * 1.5, h] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                  className="w-[3px] bg-mystic-gold rounded-full"
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <Conversation />
        </div>

        {/* Footer / Meta */}
        <footer className="h-14 md:h-16 px-4 md:px-10 flex justify-between items-center text-[8px] md:text-[10px] uppercase tracking-[1px] md:tracking-[2px] text-text-muted bg-linear-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-mystic-gold rounded-full shadow-[0_0_8px_#d4af37]" />
            <span>Divine Connection Established</span>
          </div>
          <div className="hidden sm:block">Analysis Stage: Phase II — Celestial Mapping</div>
          <div className="hidden lg:block">Session ID: ORACLE-777-ALPHA</div>
        </footer>
      </div>

      {/* Audio Controls */}
      <AmbientMusic />
    </main>
  );
}


