import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera, X, Check } from 'lucide-react';

interface PalmUploadProps {
  onUpload: (left: string, right: string) => void;
}

export const PalmUpload: React.FC<PalmUploadProps> = ({ onUpload }) => {
  const [leftPalm, setLeftPalm] = useState<string | null>(null);
  const [rightPalm, setRightPalm] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'left') setLeftPalm(reader.result as string);
        else setRightPalm(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isComplete = leftPalm && rightPalm;

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl mystic-text font-light">The Sacred Imprints</h2>
        <p className="text-white/60 text-sm">Left shows your inner nature… right shows your life path.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Palm */}
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'left')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${leftPalm ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
            {leftPalm ? (
              <img src={leftPalm} alt="Left Palm" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-white/20 mb-4" />
                <span className="text-white/40 font-light">Upload Left Palm</span>
              </>
            )}
            {leftPalm && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLeftPalm(null); }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white/70 hover:text-white z-20"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-2 text-center text-xs uppercase tracking-widest text-white/30">Inner Nature</div>
        </div>

        {/* Right Palm */}
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'right')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${rightPalm ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/10 bg-white/5 group-hover:border-white/20'}`}>
            {rightPalm ? (
              <img src={rightPalm} alt="Right Palm" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-white/20 mb-4" />
                <span className="text-white/40 font-light">Upload Right Palm</span>
              </>
            )}
            {rightPalm && (
              <button 
                onClick={(e) => { e.stopPropagation(); setRightPalm(null); }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white/70 hover:text-white z-20"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="mt-2 text-center text-xs uppercase tracking-widest text-white/30">Life Path</div>
        </div>
      </div>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={() => onUpload(leftPalm!, rightPalm!)}
            className="px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-medium transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2"
          >
            Begin Analysis
            <Check size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
