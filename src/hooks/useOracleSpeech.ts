import { useState, useCallback, useEffect } from 'react';
import { Language } from '../types';

export function useOracleSpeech(language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    const handleVoicesChanged = () => {
      setVoicesLoaded(true);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    
    // Periodically check for voices if not loaded (some browsers are finicky)
    const interval = setInterval(() => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
        clearInterval(interval);
      }
    }, 500);

    // Initial check
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
      clearInterval(interval);
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      clearInterval(interval);
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Set voice based on language
    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return null;

      const targetLang = language.toLowerCase();

      // Helper to normalize lang strings (e.g., "en_US" -> "en-us")
      const normalize = (l: string) => l.toLowerCase().replace('_', '-');

      // 1. Try to find a voice that exactly matches the language code (e.g., "es")
      // or starts with the language code followed by a dash (e.g., "es-ES")
      let voice = voices.find(v => {
        const vLang = normalize(v.lang);
        return vLang === targetLang || vLang.startsWith(`${targetLang}-`);
      });

      // 2. If no match, try to find any voice that contains the language code
      if (!voice) {
        voice = voices.find(v => normalize(v.lang).includes(targetLang));
      }

      // 3. Try matching just the first two characters of the language code
      if (!voice && targetLang.length >= 2) {
        const shortLang = targetLang.substring(0, 2);
        voice = voices.find(v => normalize(v.lang).startsWith(shortLang));
      }

      // 4. Fallback to English if still no match
      if (!voice) {
        voice = voices.find(v => normalize(v.lang).startsWith('en'));
      }

      return voice;
    };

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      // Fallback to the language code if no specific voice found
      utterance.lang = language;
    }
    
    utterance.pitch = 1.0;
    utterance.rate = 0.85;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, [language, stopSpeaking]);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    
    const langMap: Record<string, string> = {
      en: 'en-US',
      ml: 'ml-IN',
      hi: 'hi-IN',
      ar: 'ar-SA',
      zh: 'zh-CN',
      de: 'de-DE',
      km: 'km-KH',
      es: 'es-ES'
    };
    
    recognition.lang = langMap[language] || language;
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

  return { speak, stopSpeaking, startListening, isListening, isSpeaking, transcript, setTranscript };
}
