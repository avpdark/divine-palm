import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AmbientMusic: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Try to play on mount, though browsers usually block it until first interaction
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked. Waiting for interaction.");
      });
    }
  }, [volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 glass-morphism px-4 py-2">
      <button 
        onClick={toggleMute}
        className="text-mystic-gold hover:scale-110 transition-transform"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume} 
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 accent-mystic-gold"
      />
      <audio 
        ref={audioRef} 
        loop 
        src="https://cdn.pixabay.com/audio/2022/03/10/audio_c3527058c0.mp3" // Mystical ambient track
      />
    </div>
  );
};
