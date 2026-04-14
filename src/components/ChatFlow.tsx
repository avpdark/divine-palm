import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { useOracleSpeech } from '../hooks/useOracleSpeech';
import { Language } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatFlowProps {
  language: Language;
  onComplete: (data: { name: string; dob: string; gender: string; problem: string }) => void;
}

export const ChatFlow: React.FC<ChatFlowProps> = ({ language, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello… I will read your palm and guide you. Take a deep breath… and tell me your name." }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', dob: '', gender: '', problem: '' });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { speak, startListening, isListening, transcript, setTranscript } = useOracleSpeech(language);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      setTranscript('');
    }
  }, [transcript]);

  // Initial welcome speech
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      speak(messages[0].content);
    }
  }, []);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    let nextStep = step + 1;
    let nextMsg = '';
    let newData = { ...userData };

    if (step === 0) {
      newData.name = userMsg;
      nextMsg = `I see… a strong name, ${userMsg}. Now, tell me, when did you first enter this world? (Your date of birth)`;
    } else if (step === 1) {
      newData.dob = userMsg;
      nextMsg = "And your gender? It helps me understand the balance of energies within you.";
    } else if (step === 2) {
      newData.gender = userMsg;
      nextMsg = "I am starting to feel your presence more clearly. Tell me… what is currently weighing most heavily on your heart? What is the shadow that follows you?";
    } else if (step === 3) {
      newData.problem = userMsg;
      setUserData(newData);
      onComplete(newData);
      return;
    }

    setUserData(newData);
    setStep(nextStep);

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: nextMsg }]);
      speak(nextMsg);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
            <Sparkles className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-medium text-white/90">Divine Oracle</h3>
            <p className="text-xs text-white/40">Wise & Mystical</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-orange-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center gap-2">
          <button 
            onClick={startListening}
            className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              placeholder="Type your message..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-14 text-sm focus:outline-none focus:border-orange-500/50 transition-all disabled:opacity-50"
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 hover:bg-orange-500 rounded-full text-white transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
