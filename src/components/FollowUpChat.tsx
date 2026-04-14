import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Mic, MicOff } from 'lucide-react';
import { ai, SYSTEM_PROMPT } from '../lib/gemini';
import { useOracleSpeech } from '../hooks/useOracleSpeech';
import { Language } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FollowUpChatProps {
  initialContext: string;
  language: Language;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ initialContext, language }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "I am still here, child. Do you have more questions about what the lines of your palm have revealed?" }
  ]);
  const [input, setInput] = useState('');
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const chatMessages = [
        { role: 'user', content: `Context of my reading: ${initialContext}` },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
          topP: 0.9,
        }
      });

      const aiMsg = response.text || "The stars are silent for a moment. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiMsg }]);
      speak(aiMsg);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, my connection to the divine is flickering. Let us try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl mt-12">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <h3 className="text-sm font-medium text-white/80">Follow-up Guidance</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/5">
              <div className="flex gap-1">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10">
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
              placeholder="Ask anything about your life..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-14 text-sm focus:outline-none focus:border-orange-500/50 transition-all"
            />
            <button 
              onClick={handleSend}
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
