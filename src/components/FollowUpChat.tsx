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
  onTyping?: (isTyping: boolean) => void;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ initialContext, language, onTyping }) => {
  const translations = {
    en: {
      welcome: "I am still here, child. Do you have more questions about what the lines of your palm have revealed?",
      placeholder: "Ask anything about your life...",
      error: "I apologize, my connection to the divine is flickering. Let us try again in a moment.",
      silent: "The stars are silent for a moment. Please try again."
    },
    ml: {
      welcome: "ഞാൻ ഇവിടെത്തന്നെയുണ്ട്. നിങ്ങളുടെ കൈരേഖകൾ വെളിപ്പെടുത്തിയതിനെക്കുറിച്ച് നിങ്ങൾക്ക് കൂടുതൽ ചോദ്യങ്ങളുണ്ടോ?",
      placeholder: "നിങ്ങളുടെ ജീവിതത്തെക്കുറിച്ച് എന്തും ചോദിക്കൂ...",
      error: "ക്ഷമിക്കണം, എനിക്ക് ദൈവവുമായുള്ള ബന്ധം അല്പം തടസ്സപ്പെടുന്നു. നമുക്ക് അല്പസമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കാം.",
      silent: "നക്ഷത്രങ്ങൾ ഇപ്പോൾ നിശബ്ദമാണ്. ദയവായി വീണ്ടും ശ്രമിക്കുക."
    },
    hi: {
      welcome: "मैं अभी भी यहीं हूँ, वत्स। क्या आपके पास अपनी हस्तरेखाओं के खुलासे के बारे में और प्रश्न हैं?",
      placeholder: "अपने जीवन के बारे में कुछ भी पूछें...",
      error: "मैं क्षमा चाहता हूँ, दिव्य शक्तियों से मेरा संपर्क टूट रहा है। आइए कुछ क्षण बाद पुनः प्रयास करें।",
      silent: "सितारे अभी मौन हैं। कृपया पुनः प्रयास करें।"
    },
    ar: {
      welcome: "ما زلت هنا يا بني. هل لديك المزيد من الأسئلة حول ما كشفته خطوط كفك؟",
      placeholder: "اسأل عن أي شيء في حياتك...",
      error: "أعتذر، اتصالي بالقوى الإلهية متقطع. لنحاول مرة أخرى بعد قليل.",
      silent: "النجوم صامتة للحظة. يرجى المحاولة مرة أخرى."
    },
    zh: {
      welcome: "我还在，孩子。关于手相揭示的内容，你还有其他问题吗？",
      placeholder: "询问关于你生活的任何事情...",
      error: "抱歉，我与神灵的连接有些波动。让我们稍后再试。",
      silent: "星辰此刻保持沉默。请再试一次。"
    },
    de: {
      welcome: "Ich bin noch hier, mein Kind. Hast du weitere Fragen zu dem, was die Linien deiner Hand offenbart haben?",
      placeholder: "Frage alles über dein Leben...",
      error: "Ich entschuldige mich, meine Verbindung zum Göttlichen flackert. Versuchen wir es in einem Moment noch einmal.",
      silent: "Die Sterne schweigen für einen Moment. Bitte versuche es erneut."
    },
    km: {
      welcome: "ខ្ញុំនៅទីនេះ កូន។ តើអ្នកមានសំណួរបន្ថែមអំពីអ្វីដែលខ្សែបាតដៃរបស់អ្នកបានបង្ហាញទេ?",
      placeholder: "សួរអ្វីក៏បានអំពីជីវិតរបស់អ្នក...",
      error: "ខ្ញុំសូមអភ័យទោស ការតភ្ជាប់របស់ខ្ញុំទៅកាន់ព្រះកំពុងរអាក់រអួល។ ចូរយើងព្យាយាមម្តងទៀតក្នុងពេលបន្តិចទៀតនេះ។",
      silent: "តារាកំពុងស្ងប់ស្ងាត់មួយភ្លែត។ សូមព្យាយាមម្តងទៀត។"
    },
    es: {
      welcome: "Todavía estoy aquí, hijo mío. ¿Tienes más preguntas sobre lo que las líneas de tu mano han revelado?",
      placeholder: "Pregunta cualquier cosa sobre tu vida...",
      error: "Pido disculpas, mi conexión con lo divino está parpadeando. Intentémoslo de nuevo en un momento.",
      silent: "Las estrellas están en silencio por un momento. Por favor, inténtalo de nuevo."
    }
  };

  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.welcome }
  ]);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t.welcome }]);
  }, [language]);

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
    onTyping?.(true);

    try {
      const chatMessages = [
        { role: 'user', content: `Context of my reading: ${initialContext}` },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg }
      ];

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

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        config: {
          systemInstruction: SYSTEM_PROMPT(langName || 'English'),
          temperature: 0.7,
          topP: 0.9,
        }
      });

      const aiMsg = response.text || t.silent;
      setMessages(prev => [...prev, { role: 'assistant', content: aiMsg }]);
      speak(aiMsg);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: t.error }]);
    } finally {
      setIsTyping(false);
      onTyping?.(false);
    }
  };

  return (
    <div className="flex flex-col h-[60vh] md:h-[500px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl mt-12">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
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
              placeholder={t.placeholder}
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
