import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Keyboard, RefreshCw, Share2 } from 'lucide-react';
import { Step, UserData, Language, ReadingResult, ChatMessage } from '../types';
import { useOracleSpeech } from '../hooks/useOracleSpeech';
import { PalmUpload } from './PalmUpload';
import { getOracleReading, getOracleChatResponse } from '../services/gemini';
import { cn } from '../lib/utils';

const TRANSLATIONS = {
  en: {
    welcome: "I sense a presence… someone has arrived…",
    fearNot: "Do not fear… I am here to reveal what is hidden…",
    askName: "What is your name, child?",
    askDob: "Tell me the date of your birth...",
    askGender: "Reveal your gender…",
    askLeft: "Now… show me your left palm…",
    askRight: "And now… your right palm…",
    reading: "Reading your destiny...",
    reset: "Analyze Another Soul",
    share: "Share Destiny",
    typePlaceholder: "Speak your truth...",
  },
  ml: {
    welcome: "ഒരു സാന്നിധ്യം ഞാൻ അറിയുന്നു... ആരോ വന്നിരിക്കുന്നു...",
    fearNot: "ഭയപ്പെടേണ്ട... മറഞ്ഞിരിക്കുന്നത് വെളിപ്പെടുത്താൻ ഞാൻ ഇവിടെയുണ്ട്...",
    askName: "നിന്റെ പേരെന്താണ്, മകനേ/മകളേ?",
    askDob: "നിന്റെ ജനനത്തീയതി പറയൂ...",
    askGender: "നിന്റെ ലിംഗഭേദം വെളിപ്പെടുത്തൂ...",
    askLeft: "ഇനി... നിന്റെ ഇടതുകൈ കാണിക്കൂ...",
    askRight: "ഇനി... നിന്റെ വലതുകൈ കാണിക്കൂ...",
    reading: "നിന്റെ വിധി വായിക്കുന്നു...",
    reset: "മറ്റൊരു ആത്മാവിനെ വിശകലനം ചെയ്യുക",
    share: "വിധി പങ്കിടുക",
    typePlaceholder: "നിന്റെ സത്യം പറയൂ...",
  },
  hi: {
    welcome: "मुझे एक उपस्थिति महसूस हो रही है... कोई आया है...",
    fearNot: "डरो मत... मैं यहाँ वह प्रकट करने के लिए हूँ जो छिपा है...",
    askName: "बच्चे, तुम्हारा नाम क्या है?",
    askDob: "मुझे अपनी जन्म तिथि बताओ...",
    askGender: "अपना लिंग प्रकट करें...",
    askLeft: "अब... मुझे अपनी बाईं हथेली दिखाओ...",
    askRight: "और अब... अपनी दाहिनी हथेली...",
    reading: "तुम्हारी नियति पढ़ रहा हूँ...",
    reset: "एक और आत्मा का विश्लेषण करें",
    share: "नियति साझा करें",
    typePlaceholder: "अपनी सच्चाई बताओ...",
  },
  ar: {
    welcome: "أشعر بوجود... شخص ما قد وصل...",
    fearNot: "لا تخف... أنا هنا لأكشف ما هو مخفي...",
    askName: "ما اسمك يا بني؟",
    askDob: "أخبرني بتاريخ ميلادك...",
    askGender: "اكشف عن جنسك...",
    askLeft: "الآن... أرني كفك الأيسر...",
    askRight: "والآن... كفك الأيمن...",
    reading: "أقرأ قدرك...",
    reset: "تحليل روح أخرى",
    share: "شارك القدر",
    typePlaceholder: "قل حقيقتك...",
  },
  zh: {
    welcome: "我感觉到一股气息……有人来了……",
    fearNot: "不要害怕……我在这里揭示隐藏的一切……",
    askName: "孩子，你叫什么名字？",
    askDob: "告诉我你的出生日期……",
    askGender: "揭示你的性别……",
    askLeft: "现在……给我看你的左手掌……",
    askRight: "现在……你的右手掌……",
    reading: "正在读取你的命运……",
    reset: "分析另一个灵魂",
    share: "分享命运",
    typePlaceholder: "说出你的真相……",
  },
  es: {
    welcome: "Siento una presencia... alguien ha llegado...",
    fearNot: "No temas... estoy aquí para revelar lo que está oculto...",
    askName: "¿Cómo te llamas, hijo/a?",
    askDob: "Dime tu fecha de nacimiento...",
    askGender: "Revela tu género...",
    askLeft: "Ahora... muéstrame tu palma izquierda...",
    askRight: "Y ahora... tu palma derecha...",
    reading: "Leyendo tu destino...",
    reset: "Analizar otra alma",
    share: "Compartir destino",
    typePlaceholder: "Di tu verdad...",
  },
  de: {
    welcome: "Ich spüre eine Präsenz... jemand ist angekommen...",
    fearNot: "Fürchte dich nicht... ich bin hier, um zu enthüllen, was verborgen ist...",
    askName: "Wie ist dein Name, mein Kind?",
    askDob: "Nenne mir dein Geburtsdatum...",
    askGender: "Enthülle dein Geschlecht...",
    askLeft: "Nun... zeig mir deine linke Handfläche...",
    askRight: "Und nun... deine rechte Handfläche...",
    reading: "Dein Schicksal wird gelesen...",
    reset: "Eine andere Seele analysieren",
    share: "Schicksal teilen",
    typePlaceholder: "Sprich deine Wahrheit...",
  },
  ru: {
    welcome: "Я чувствую присутствие... кто-то пришел...",
    fearNot: "Не бойся... я здесь, чтобы раскрыть сокровенное...",
    askName: "Как тебя зовут, дитя?",
    askDob: "Назови мне дату своего рождения...",
    askGender: "Раскрой свой пол...",
    askLeft: "Теперь... покажи мне свою левую ладонь...",
    askRight: "А теперь... правую ладонь...",
    reading: "Читаю твою судьбу...",
    reset: "Анализировать другую душу",
    share: "Поделиться судьбой",
    typePlaceholder: "Скажи свою правду...",
  }
};

export const Conversation: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [step, setStep] = useState<Step>('LANGUAGE_SELECT');
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [userData, setUserData] = useState<UserData>({
    name: '',
    dob: '',
    gender: 'Other',
    leftPalm: null,
    rightPalm: null,
  });
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { speak, startListening, isListening, transcript, setTranscript } = useOracleSpeech(language);

  const t = TRANSLATIONS[language];

  const handleNext = useCallback((value?: string) => {
    switch (step) {
      case 'ASK_NAME':
        if (value) {
          setUserData(prev => ({ ...prev, name: value }));
          setStep('ASK_DOB');
        }
        break;
      case 'ASK_DOB':
        if (value) {
          setUserData(prev => ({ ...prev, dob: value }));
          setStep('ASK_GENDER');
        }
        break;
      case 'ASK_GENDER':
        if (value) {
          setUserData(prev => ({ ...prev, gender: value as any }));
          setStep('ASK_LEFT_PALM');
        }
        break;
      case 'ASK_LEFT_PALM':
        setStep('ASK_RIGHT_PALM');
        break;
      case 'ASK_RIGHT_PALM':
        if (step === 'ASK_RIGHT_PALM' && !isProcessing) {
          processReading();
        }
        break;
      case 'RESULTS':
      case 'CHAT':
        if (value) {
          handleChat(value);
        }
        break;
    }
  }, [step, isProcessing]);

  useEffect(() => {
    if (transcript) {
      handleNext(transcript);
      setTranscript('');
    }
  }, [transcript, handleNext, setTranscript]);

  useEffect(() => {
    if (step === 'INTRO') {
      speak(t.welcome + " " + t.fearNot);
      setTimeout(() => setStep('ASK_NAME'), 5000);
    } else if (step === 'ASK_NAME') {
      speak(t.askName);
    } else if (step === 'ASK_DOB') {
      speak(t.askDob);
    } else if (step === 'ASK_GENDER') {
      speak(t.askGender);
    } else if (step === 'ASK_LEFT_PALM') {
      speak(t.askLeft);
    } else if (step === 'ASK_RIGHT_PALM') {
      speak(t.askRight);
    }
  }, [step, language, speak]);

  const processReading = async () => {
    setStep('READING');
    setIsProcessing(true);
    speak(t.reading);
    
    try {
      const reading = await getOracleReading(userData, language);
      setResult(reading);
      setStep('RESULTS');
      
      // Save to local storage
      const savedReadings = JSON.parse(localStorage.getItem('oracle_readings') || '[]');
      savedReadings.push({
        date: new Date().toISOString(),
        userData: { ...userData, leftPalm: null, rightPalm: null }, // Don't save large images
        result: reading
      });
      localStorage.setItem('oracle_readings', JSON.stringify(savedReadings.slice(-10))); // Keep last 10

      // Narrate the results
      const fullText = `${reading.personality}. ${reading.lifePath}. ${reading.destiny}`;
      speak(fullText);
    } catch (error: any) {
      console.error("Oracle error:", error);
      alert(error.message || "The cosmic strings are tangled. Please try again.");
      setStep('ASK_RIGHT_PALM');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChat = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    const userMsg: ChatMessage = { role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsProcessing(true);
    setTextInput('');

    try {
      const response = await getOracleChatResponse(newMessages, userData, language);
      const modelMsg: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, modelMsg]);
      speak(response);
      setStep('CHAT');
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const shareDestiny = () => {
    if (!result) return;
    const text = `My Destiny as revealed by the Divine Palm Oracle:\n\n${result.destiny}\n\nSeek your own fate at ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Divine Destiny',
        text: text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Destiny copied to clipboard, seeker.");
    }
  };

  const reset = () => {
    setStep('LANGUAGE_SELECT');
    setUserData({
      name: '',
      dob: '',
      gender: 'Other',
      leftPalm: null,
      rightPalm: null,
    });
    setResult(null);
    setMessages([]);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <AnimatePresence mode="wait">
        {step === 'LANGUAGE_SELECT' && (
          <motion.div 
            key="lang"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-morphism p-6 md:p-8 max-w-lg w-full"
          >
            <h2 className="text-2xl md:text-3xl font-display text-mystic-gold mb-6 md:mb-8">Choose your tongue</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {(['en', 'ml', 'hi', 'ar', 'zh', 'es', 'de', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setStep('INTRO');
                  }}
                  className="p-3 md:p-4 rounded-xl border border-white/10 hover:bg-mystic-gold/20 hover:border-mystic-gold transition-all font-display text-xs md:text-sm"
                >
                  {lang === 'en' ? 'English' : 
                   lang === 'ml' ? 'മലയാളം' : 
                   lang === 'hi' ? 'हिन्दी' : 
                   lang === 'ar' ? 'العربية' :
                   lang === 'zh' ? '中文' :
                   lang === 'es' ? 'Español' :
                   lang === 'de' ? 'Deutsch' :
                   'Русский'}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {(step === 'INTRO' || step.startsWith('ASK_') || step === 'CHAT') && (
          <motion.div 
            key="convo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 w-full max-w-2xl"
          >
            <div className="dialogue-container w-full">
              {step === 'CHAT' ? (
                <div className="flex flex-col gap-4 max-h-[35vh] md:max-h-[40vh] overflow-y-auto custom-scrollbar p-2 md:p-4">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-3 md:p-4 rounded-2xl max-w-[90%] md:max-w-[80%] text-left",
                        msg.role === 'user' ? "bg-mystic-gold/10 ml-auto border border-mystic-gold/20" : "bg-white/5 mr-auto"
                      )}
                    >
                      <p className={cn("text-xs md:text-sm", msg.role === 'model' ? "oracle-voice !text-sm md:!text-base" : "font-sans italic")}>
                        {msg.text}
                      </p>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex gap-2 mr-auto">
                      <div className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-mystic-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="oracle-voice">
                  {step === 'INTRO' ? t.welcome : 
                   step === 'ASK_NAME' ? t.askName :
                   step === 'ASK_DOB' ? t.askDob :
                   step === 'ASK_GENDER' ? t.askGender :
                   step === 'ASK_LEFT_PALM' ? t.askLeft :
                   t.askRight}
                </p>
              )}
            </div>

            {step === 'ASK_GENDER' && (
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => handleNext(g)}
                    className="px-6 md:px-8 py-2 rounded-full border border-mystic-gold/25 text-text-muted hover:bg-mystic-gold hover:text-bg-deep transition-all uppercase tracking-widest text-[10px] md:text-xs"
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {(step === 'ASK_LEFT_PALM' || step === 'ASK_RIGHT_PALM') && (
              <div className="flex flex-col items-center gap-8">
                <PalmUpload 
                  label={step === 'ASK_LEFT_PALM' ? "Left Palm" : "Right Palm"}
                  image={step === 'ASK_LEFT_PALM' ? userData.leftPalm : userData.rightPalm}
                  onUpload={(b64) => setUserData(prev => ({ 
                    ...prev, 
                    [step === 'ASK_LEFT_PALM' ? 'leftPalm' : 'rightPalm']: b64 
                  }))}
                  onClear={() => setUserData(prev => ({ 
                    ...prev, 
                    [step === 'ASK_LEFT_PALM' ? 'leftPalm' : 'rightPalm']: null 
                  }))}
                />
                {(step === 'ASK_LEFT_PALM' ? userData.leftPalm : userData.rightPalm) && (
                  <button 
                    onClick={() => handleNext()}
                    className="px-10 py-3 bg-mystic-gold text-bg-deep font-display rounded-full hover:scale-105 transition-transform uppercase tracking-[0.2em] text-sm"
                  >
                    Proceed
                  </button>
                )}
              </div>
            )}

            {step !== 'ASK_LEFT_PALM' && step !== 'ASK_RIGHT_PALM' && step !== 'ASK_GENDER' && step !== 'INTRO' && (
              <div className="w-full max-w-md mt-4 md:mt-8">
                <div className="input-section">
                  <div className="interaction-mode mb-3 md:mb-4 flex justify-center gap-2">
                    <button 
                      onClick={() => setInputMode('voice')}
                      className={cn("mode-btn", inputMode === 'voice' && "active")}
                    >
                      🎤 Speak
                    </button>
                    <button 
                      onClick={() => setInputMode('text')}
                      className={cn("mode-btn", inputMode === 'text' && "active")}
                    >
                      ⌨️ Type
                    </button>
                  </div>

                  <div className="w-full flex items-center gap-2 glass-morphism p-1.5 md:p-2">
                    {inputMode === 'text' ? (
                      <input 
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (step === 'CHAT' || step === 'RESULTS' ? handleChat(textInput) : handleNext(textInput))}
                        placeholder={t.typePlaceholder}
                        className="flex-1 bg-transparent border-none outline-none text-text-main px-3 md:px-4 py-1.5 md:py-2 font-georgia italic text-sm md:text-base"
                        autoFocus
                      />
                    ) : (
                      <button 
                        onClick={startListening}
                        className={cn(
                          "flex-1 text-left px-3 md:px-4 py-1.5 md:py-2 text-text-muted font-georgia italic text-sm md:text-base",
                          isListening && "text-mystic-gold animate-pulse"
                        )}
                      >
                        {isListening ? "Listening..." : "Tap to speak..."}
                      </button>
                    )}

                    {inputMode === 'text' && (
                      <button 
                        onClick={() => { 
                          if (step === 'CHAT' || step === 'RESULTS') {
                            handleChat(textInput);
                          } else {
                            handleNext(textInput);
                            setTextInput('');
                          }
                        }}
                        className="p-3 text-mystic-gold hover:bg-white/5 rounded-full"
                      >
                        <Send size={20} />
                      </button>
                    )}
                  </div>
                </div>
                
                {step === 'CHAT' && (
                  <button 
                    onClick={reset}
                    className="mt-6 text-[10px] uppercase tracking-widest text-mystic-gold/50 hover:text-mystic-gold transition-colors"
                  >
                    {t.reset}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === 'READING' && (
          <motion.div 
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 border-4 border-mystic-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-2xl font-display text-mystic-gold animate-pulse">{t.reading}</p>
          </motion.div>
        )}

        {step === 'RESULTS' && result && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-5 md:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            <h2 className="text-2xl md:text-4xl font-display text-mystic-gold mb-6 md:mb-8 border-b border-mystic-gold/20 pb-4">
              Thy Destiny Revealed
            </h2>
            
            <div className="space-y-6 md:space-y-8 text-left">
              <ResultSection title="Inner Soul" content={result.personality} delay={0.2} />
              <ResultSection title="The Journey" content={result.lifePath} delay={0.4} />
              <ResultSection title="Heart's Echo" content={result.love} delay={0.6} />
              <ResultSection title="Worldly Purpose" content={result.career} delay={0.8} />
              <ResultSection title="Final Fate" content={result.destiny} delay={1.0} />
              <ResultSection title="Cosmic Whispers" content={result.warnings} delay={1.2} />
            </div>

            <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4">
              <div className="w-full max-w-md mb-4">
                <p className="text-[10px] md:text-xs text-text-muted mb-3 md:mb-4 uppercase tracking-widest">Ask the Oracle more...</p>
                <div className="w-full flex items-center gap-2 glass-morphism p-1.5 md:p-2">
                  <input 
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat(textInput)}
                    placeholder="What else do you wish to know?"
                    className="flex-1 bg-transparent border-none outline-none text-text-main px-3 md:px-4 py-1.5 md:py-2 font-georgia italic text-sm md:text-base"
                  />
                  <button 
                    onClick={() => handleChat(textInput)}
                    className="p-2 md:p-3 text-mystic-gold hover:bg-white/5 rounded-full"
                  >
                    <Send size={18} md:size={20} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full justify-center">
                <button 
                  onClick={reset}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 border border-mystic-gold text-mystic-gold rounded-full hover:bg-mystic-gold hover:text-black transition-all text-sm"
                >
                  <RefreshCw size={18} />
                  {t.reset}
                </button>
                <button 
                  onClick={shareDestiny}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 md:py-3 bg-mystic-gold text-black rounded-full hover:scale-105 transition-transform text-sm"
                >
                  <Share2 size={18} />
                  {t.share}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultSection: React.FC<{ title: string; content: string; delay: number }> = ({ title, content, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="space-y-2"
  >
    <h3 className="text-mystic-gold font-display uppercase tracking-widest text-sm">{title}</h3>
    <p className="text-lg font-serif leading-relaxed text-white/80">{content}</p>
  </motion.div>
);
