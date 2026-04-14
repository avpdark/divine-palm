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
  onTyping?: (isTyping: boolean) => void;
}

export const ChatFlow: React.FC<ChatFlowProps> = ({ language, onComplete, onTyping }) => {
  const translations = {
    en: {
      welcome: "Hello… I will read your palm and guide you. Take a deep breath… and tell me your name.",
      nameResp: (name: string) => `I see… a strong name, ${name}. Now, tell me, when did you first enter this world? (Your date of birth)`,
      dobResp: "And your gender? It helps me understand the balance of energies within you.",
      genderResp: "I am starting to feel your presence more clearly. Tell me… what is currently weighing most heavily on your heart? What is the shadow that follows you?",
      placeholder: "Type your message..."
    },
    ml: {
      welcome: "നമസ്കാരം… ഞാൻ നിങ്ങളുടെ കൈനോക്കി നിങ്ങളെ വഴിനയിക്കാം. ആഴത്തിൽ ശ്വസിക്കൂ… നിങ്ങളുടെ പേര് പറയൂ.",
      nameResp: (name: string) => `ശരി… ${name}, അതൊരു നല്ല പേരാണ്. ഇനി പറയൂ, നിങ്ങൾ എപ്പോഴാണ് ഈ ലോകത്തേക്ക് വന്നത്? (നിങ്ങളുടെ ജനനത്തീയതി)`,
      dobResp: "നിങ്ങളുടെ ലിംഗഭേദം? അത് നിങ്ങളിലെ ഊർജ്ജത്തെക്കുറിച്ച് മനസ്സിലാക്കാൻ എന്നെ സഹായിക്കും.",
      genderResp: "എനിക്ക് നിങ്ങളെ കൂടുതൽ വ്യക്തമായി അനുഭവപ്പെടുന്നു. പറയൂ… ഇപ്പോൾ നിങ്ങളുടെ ഹൃദയത്തെ ഏറ്റവും കൂടുതൽ അലട്ടുന്നത് എന്താണ്?",
      placeholder: "സന്ദേശം ടൈപ്പ് ചെയ്യൂ..."
    },
    hi: {
      welcome: "नमस्ते… मैं आपकी हथेली पढ़कर आपका मार्गदर्शन करूँगा। एक गहरी साँस लें… और मुझे अपना नाम बताएं।",
      nameResp: (name: string) => `मैं देख रहा हूँ… ${name}, यह एक प्रभावशाली नाम है। अब मुझे बताएं, आपने इस दुनिया में पहली बार कब कदम रखा? (आपकी जन्म तिथि)`,
      dobResp: "और आपका लिंग? यह मुझे आपके भीतर की ऊर्जा के संतुलन को समझने में मदद करता है।",
      genderResp: "मैं आपकी उपस्थिति को और अधिक स्पष्ट रूप से महसूस करने लगा हूँ। मुझे बताएं… वर्तमान में आपके दिल पर सबसे अधिक बोझ क्या है?",
      placeholder: "अपना संदेश लिखें..."
    },
    ar: {
      welcome: "مرحباً... سأقرأ كفك وأرشدك. خذ نفساً عميقاً... وأخبرني باسمك.",
      nameResp: (name: string) => `أرى... اسماً قوياً، ${name}. الآن، أخبرني، متى دخلت هذا العالم لأول مرة؟ (تاريخ ميلادك)`,
      dobResp: "وجنسك؟ يساعدني ذلك في فهم توازن الطاقات بداخلك.",
      genderResp: "بدأت أشعر بوجودك بشكل أكثر وضوحاً. أخبرني... ما الذي يثقل كاهلك أكثر في الوقت الحالي؟",
      placeholder: "اكتب رسالتك..."
    },
    zh: {
      welcome: "你好……我会为你读手相并指引你。深呼吸……告诉我你的名字。",
      nameResp: (name: string) => `我看到了……一个很有力量的名字，${name}。现在，告诉我，你是什么时候来到这个世界的？（你的出生日期）`,
      dobResp: "你的性别？这能帮我理解你内在能量的平衡。",
      genderResp: "我开始更清晰地感受到你的存在。告诉我……目前你心中最沉重的负担是什么？",
      placeholder: "输入你的消息..."
    },
    de: {
      welcome: "Hallo… ich werde aus deiner Hand lesen und dich führen. Atme tief durch… und nenne mir deinen Namen.",
      nameResp: (name: string) => `Ich sehe… ein starker Name, ${name}. Nun sag mir, wann hast du diese Welt zum ersten Mal betreten? (Dein Geburtsdatum)`,
      dobResp: "Und dein Geschlecht? Es hilft mir, das Gleichgewicht der Energien in dir zu verstehen.",
      genderResp: "Ich beginne, deine Anwesenheit deutlicher zu spüren. Sag mir… was bedrückt dein Herz zur Zeit am meisten?",
      placeholder: "Schreibe deine Nachricht..."
    },
    km: {
      welcome: "សួស្តី… ខ្ញុំនឹងមើលបាតដៃរបស់អ្នក ហើយណែនាំអ្នក។ ដកដង្ហើមវែងៗ… ហើយប្រាប់ឈ្មោះរបស់អ្នកមកខ្ញុំ។",
      nameResp: (name: string) => `ខ្ញុំឃើញហើយ… ឈ្មោះដ៏រឹងមាំមួយ ${name}។ ឥឡូវនេះ ប្រាប់ខ្ញុំតើអ្នកចាប់កំណើតក្នុងលោកនេះនៅពេលណា? (ថ្ងៃខែឆ្នាំកំណើតរបស់អ្នក)`,
      dobResp: "ហើយភេទរបស់អ្នក? វាជួយឱ្យខ្ញុំយល់ពីតុល្យភាពនៃថាមពលនៅក្នុងខ្លួនអ្នក។",
      genderResp: "ខ្ញុំចាប់ផ្តើមមានអារម្មណ៍ពីវត្តមានរបស់អ្នកកាន់តែច្បាស់។ ប្រាប់ខ្ញុំ… តើអ្វីដែលកំពុងធ្វើឱ្យអ្នកធ្ងន់ចិត្តបំផុតនៅពេលនេះ?",
      placeholder: "វាយសាររបស់អ្នក..."
    },
    es: {
      welcome: "Hola… leeré tu mano y te guiaré. Respira profundo… y dime tu nombre.",
      nameResp: (name: string) => `Ya veo… un nombre fuerte, ${name}. Ahora dime, ¿cuándo entraste por primera vez en este mundo? (Tu fecha de nacimiento)`,
      dobResp: "¿Y tu género? Me ayuda a entender el equilibrio de energías dentro de ti.",
      genderResp: "Empiezo a sentir tu presencia más claramente. Dime… ¿qué es lo que más pesa en tu corazón en este momento?",
      placeholder: "Escribe tu mensaje..."
    }
  };

  const t = translations[language] || translations.en;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.welcome }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', dob: '', gender: '', problem: '' });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { speak, startListening, isListening, transcript, setTranscript } = useOracleSpeech(language);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: t.welcome }]);
    setStep(0);
  }, [language]);

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
    const timer = setTimeout(() => {
      if (messages.length === 1 && messages[0].role === 'assistant') {
        speak(messages[0].content);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak, messages]);

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
      nextMsg = t.nameResp(userMsg);
    } else if (step === 1) {
      newData.dob = userMsg;
      nextMsg = t.dobResp;
    } else if (step === 2) {
      newData.gender = userMsg;
      nextMsg = t.genderResp;
    } else if (step === 3) {
      newData.problem = userMsg;
      setUserData(newData);
      onComplete(newData);
      return;
    }

    setUserData(newData);
    setStep(nextStep);
    onTyping?.(true);

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: nextMsg }]);
      speak(nextMsg);
      setIsTyping(false);
      onTyping?.(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[70vh] md:h-[600px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scroll-smooth">
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

      <div className="p-4 md:p-6 bg-white/5 border-t border-white/10">
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
              placeholder={t.placeholder}
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
