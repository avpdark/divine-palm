import React from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, Heart, Coins, AlertCircle, CheckCircle, Sparkles, Share2, Volume2, VolumeX } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CharacterAvatar } from './CharacterAvatar';
import { useOracleSpeech } from '../hooks/useOracleSpeech';
import { Language } from '../types';

interface ResultViewProps {
  result: string;
  language: Language;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, language }) => {
  const { speak, stopSpeaking, isSpeaking } = useOracleSpeech(language);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Divine Palm Reading',
        text: result.substring(0, 200) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(result);
      alert('Reading copied to clipboard!');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto space-y-8 md:space-y-12 pb-20"
    >
      <CharacterAvatar isTyping={isSpeaking} />
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-block p-3 rounded-full bg-orange-600/20 border border-orange-500/30 mb-4"
        >
          <Sparkles className="w-8 h-8 text-orange-500" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl mystic-text font-light tracking-tight">Your Divine Reading</h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto" />
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-white/60"
          >
            <Share2 size={14} />
            Share Destiny
          </button>

          <button 
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speak(result);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full glass transition-all text-xs uppercase tracking-widest ${isSpeaking ? 'text-orange-500 bg-orange-500/10' : 'text-white/60 hover:bg-white/10'}`}
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {isSpeaking ? 'Stop Reading' : 'Listen to Oracle'}
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-purple-600" />
        
        <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:mystic-text prose-headings:font-light prose-headings:text-orange-400 prose-strong:text-orange-200">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card icon={<User className="text-blue-400" size={18} />} title="Personality" delay={0.4} />
        <Card icon={<Briefcase className="text-green-400" size={18} />} title="Career" delay={0.5} />
        <Card icon={<Heart className="text-red-400" size={18} />} title="Relationships" delay={0.6} />
        <Card icon={<Coins className="text-yellow-400" size={18} />} title="Finance" delay={0.7} />
        <Card icon={<AlertCircle className="text-purple-400" size={18} />} title="Challenges" delay={0.8} />
        <Card icon={<CheckCircle className="text-emerald-400" size={18} />} title="Action Plan" delay={0.9} />
      </div>
    </motion.div>
  );
};

const Card = ({ icon, title, delay }: { icon: React.ReactNode, title: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-4 md:p-6 rounded-2xl flex flex-col items-center text-center space-y-2 md:space-y-3 hover:bg-white/5 transition-colors border border-white/5"
  >
    <div className="p-2 md:p-3 rounded-full bg-white/5 mb-1 md:mb-2">
      {icon}
    </div>
    <h4 className="text-[10px] md:text-xs font-medium text-white/40 uppercase tracking-[0.2em]">{title}</h4>
  </motion.div>
);
