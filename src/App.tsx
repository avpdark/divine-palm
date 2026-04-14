import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Atmosphere } from './components/Atmosphere';
import { Landing } from './components/Landing';
import { ChatFlow } from './components/ChatFlow';
import { PalmUpload } from './components/PalmUpload';
import { Processing } from './components/Processing';
import { ResultView } from './components/ResultView';
import { FollowUpChat } from './components/FollowUpChat';
import { CharacterAvatar } from './components/CharacterAvatar';
import { ai, ANALYSIS_PROMPT, SYSTEM_PROMPT } from './lib/gemini';
import { Volume2, VolumeX } from 'lucide-react';
import { Language } from './types';

type AppState = 'landing' | 'chat' | 'upload' | 'processing' | 'result';

function App() {
  const [state, setState] = useState<AppState>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [userData, setUserData] = useState({ name: '', dob: '', gender: '', problem: '' });
  const [reading, setReading] = useState<string | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isOracleTyping, setIsOracleTyping] = useState(false);

  const startAnalysis = async (left: string, right: string) => {
    setState('processing');
    setIsOracleTyping(true);
    
    try {
      const langName = {
        en: 'English',
        ml: 'Malayalam',
        hi: 'Hindi',
        ar: 'Arabic',
        zh: 'Chinese',
        de: 'German',
        km: 'Cambodian',
        es: 'Spanish'
      }[language];

      const prompt = ANALYSIS_PROMPT(userData.name, userData.dob, userData.gender, userData.problem, langName || 'English');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: left.split(',')[1] } },
            { inlineData: { mimeType: "image/jpeg", data: right.split(',')[1] } }
          ]}
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT(langName || 'English'),
          temperature: 0.7,
          topP: 0.9,
        }
      });

      setReading(response.text || "The stars are silent. Please try again.");
      setState('result');
    } catch (error) {
      console.error("Analysis error:", error);
      setReading("I apologize, the divine connection was interrupted. Please try again.");
      setState('result');
    } finally {
      setIsOracleTyping(false);
    }
  };

  return (
    <div className="min-h-screen relative text-white font-sans selection:bg-orange-500/30">
      <Atmosphere />
      
      {/* Audio Toggle */}
      <button 
        onClick={() => setIsAudioOn(!isAudioOn)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass hover:bg-white/10 transition-all"
      >
        {isAudioOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Language Selector (Floating) */}
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs uppercase tracking-widest focus:outline-none focus:border-orange-500/50 transition-all appearance-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="ml">മലയാളം</option>
          <option value="hi">हिन्दी</option>
          <option value="ar">العربية</option>
          <option value="zh">中文</option>
          <option value="de">Deutsch</option>
          <option value="km">ភាសាខ្មែរ</option>
          <option value="es">Español</option>
        </select>
      </div>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-12 relative z-10 max-w-4xl">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <CharacterAvatar isTyping={isOracleTyping} />
              <Landing onStart={() => setState('chat')} />
            </motion.div>
          )}

          {state === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <CharacterAvatar isTyping={isOracleTyping} />
              <ChatFlow 
                language={language}
                onComplete={(data) => {
                  setUserData(data);
                  setState('upload');
                }} 
                onTyping={setIsOracleTyping}
              />
            </motion.div>
          )}

          {state === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <PalmUpload onUpload={startAnalysis} />
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Processing />
            </motion.div>
          )}

          {state === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResultView result={reading || ''} language={language} />
              <FollowUpChat 
                initialContext={reading || ''} 
                language={language}
                onTyping={setIsOracleTyping}
              />
              
              <div className="flex flex-col items-center mt-12 gap-4">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-medium shadow-lg shadow-orange-600/20 transition-all active:scale-95"
                >
                  Begin a New Journey
                </button>
                <p className="text-[10px] uppercase tracking-widest text-white/30">The Oracle awaits your return</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Audio (Hidden) */}
      {isAudioOn && (
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&loop=1&playlist=5qap5aO4i9A"
          frameBorder="0"
          allow="autoplay"
          className="hidden"
        />
      )}
    </div>
  );
}

export default App;


