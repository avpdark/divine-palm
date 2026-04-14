import { useState, useCallback, useEffect } from 'react';
import { Language } from '../types';

export function useOracleSpeech(language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const speak = useCallback((text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on language
    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return null;

      // Try to find a voice that matches language and is high quality
      let voice = voices.find(v => v.lang.startsWith(language) && !v.localService);
      if (!voice) voice = voices.find(v => v.lang.startsWith(language));
      if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
      return voice;
    };

    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    
    utterance.pitch = 1.0; // More natural and relaxed
    utterance.rate = 0.85; // Slightly slower and calmer
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
    recognition.lang = language === 'en' ? 'en-US' : language === 'ml' ? 'ml-IN' : language === 'hi' ? 'hi-IN' : 'ar-SA';
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
