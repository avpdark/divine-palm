import { useState, useCallback, useEffect } from 'react';
import { Language } from '../types';

export function useOracleSpeech(language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const langMap: Record<string, string> = {
    en: 'en-US',
    ml: 'ml-IN',
    hi: 'hi-IN',
    ar: 'ar-SA',
    zh: 'zh-CN',
    es: 'es-ES',
    de: 'de-DE',
    ru: 'ru-RU'
  };

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Strip emojis and icons for cleaner speech
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langMap[language] || 'en-US';
    
    // Set voice based on language
    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return null;

      // Try to find a voice that matches language and is high quality
      let voice = voices.find(v => v.lang.startsWith(language) && !v.localService);
      if (!voice) voice = voices.find(v => v.lang.startsWith(language));
      
      // Fallback to any voice that matches the language tag exactly
      if (!voice) voice = voices.find(v => v.lang === langMap[language]);
      
      return voice;
    };

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.pitch = 1.0;
    utterance.rate = 0.85;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.start();
  }, [language]);

  return { speak, startListening, isListening, transcript, setTranscript };
}
