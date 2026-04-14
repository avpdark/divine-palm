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
        <header className="h-20 px-10 flex justify-between items-center border-b border-mystic-gold/25 bg-linear-to-b from-black/50 to-transparent">
          <h1 className="text-xl font-display tracking-[4px] text-mystic-gold uppercase font-light">
            Divine Palm Oracle
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex gap-3 text-[10px] uppercase tracking-widest text-text-muted">
              <span className="text-mystic-gold underline underline-offset-4">English</span>
              <span>മലയാളം</span>
              <span>हिन्दी</span>
              <span>العربية</span>
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
        <footer className="h-16 px-10 flex justify-between items-center text-[10px] uppercase tracking-[2px] text-text-muted bg-linear-to-t from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full shadow-[0_0_8px_#d4af37]" />
            <span>Divine Connection Established</span>
          </div>
          <div>Analysis Stage: Phase II — Celestial Mapping</div>
          <div className="hidden md:block">Session ID: ORACLE-777-ALPHA</div>
        </footer>
      </div>

      {/* Audio Controls */}
      <AmbientMusic />
    </main>
  );
}


