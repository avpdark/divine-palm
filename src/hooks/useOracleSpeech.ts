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
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith(language));
    
    // Fallback to English if specific language voice not found
    if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
    
    if (voice) utterance.voice = voice;
    
    utterance.pitch = 0.8; // Deeper, more mystical
    utterance.rate = 0.9;  // Slower
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
