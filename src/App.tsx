import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Atmosphere } from './components/Atmosphere';
import { Landing } from './components/Landing';
import { ChatFlow } from './components/ChatFlow';
import { PalmUpload } from './components/PalmUpload';
import { Processing } from './components/Processing';
import { ResultView } from './components/ResultView';
import { FollowUpChat } from './components/FollowUpChat';
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

  const startAnalysis = async (left: string, right: string) => {
    setState('processing');
    
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
          systemInstruction: SYSTEM_PROMPT,
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
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs uppercase tracking-widest focus:outline-none focus:border-orange-500/50"
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

      <main className="container mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
            >
              <Landing onStart={() => setState('chat')} />
            </motion.div>
          )}

          {state === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ChatFlow 
                language={language}
                onComplete={(data) => {
                  setUserData(data);
                  setState('upload');
                }} 
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
              <ResultView result={reading || ''} />
              <FollowUpChat 
                initialContext={reading || ''} 
                language={language}
              />
              
              <div className="flex justify-center mt-12">
                <button 
                  onClick={() => window.location.reload()}
                  className="text-white/40 hover:text-white/80 text-xs uppercase tracking-widest transition-all"
                >
                  Begin a New Journey
                </button>
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


