import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PalmUploadProps {
  label: string;
  onUpload: (base64: string) => void;
  image: string | null;
  onClear: () => void;
}

export const PalmUpload: React.FC<PalmUploadProps> = ({ label, onUpload, image, onClear }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={() => !image && fileInputRef.current?.click()}
        className={cn(
          "relative w-96 h-32 border border-dashed border-gold-glow bg-mystic-gold/5 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-mystic-gold/10",
          image && "border-solid border-mystic-gold/50"
        )}
      >
        <AnimatePresence mode="wait">
          {image ? (
            <motion.div 
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img src={image} alt="Palm" className="w-full h-full object-cover rounded-xl" />
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1 text-text-muted"
            >
              <div className="text-2xl text-mystic-gold">🖐️</div>
              <span className="text-xs uppercase tracking-[0.2em] font-display">{label}</span>
              <span className="text-[10px] opacity-50">(Click to upload image)</span>
            </motion.div>
          )}
        </AnimatePresence>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};
