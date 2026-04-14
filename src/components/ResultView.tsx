import React from 'react';
import { motion } from 'motion/react';
import { User, Briefcase, Heart, Coins, AlertCircle, CheckCircle, Sparkles, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultViewProps {
  result: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ result }) => {
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
      className="w-full max-w-3xl mx-auto space-y-12 pb-20"
    >
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
        
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full glass hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-white/60"
        >
          <Share2 size={14} />
          Share Destiny
        </button>
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-purple-600" />
        
        <div className="prose prose-invert max-w-none prose-p:text-white/80 prose-headings:mystic-text prose-headings:font-light prose-headings:text-orange-400 prose-strong:text-orange-200">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card icon={<User className="text-blue-400" />} title="Personality" delay={0.4} />
        <Card icon={<Briefcase className="text-green-400" />} title="Career" delay={0.5} />
        <Card icon={<Heart className="text-red-400" />} title="Relationships" delay={0.6} />
        <Card icon={<Coins className="text-yellow-400" />} title="Finance" delay={0.7} />
        <Card icon={<AlertCircle className="text-purple-400" />} title="Challenges" delay={0.8} />
        <Card icon={<CheckCircle className="text-emerald-400" />} title="Action Plan" delay={0.9} />
      </div>
    </motion.div>
  );
};

const Card = ({ icon, title, delay }: { icon: React.ReactNode, title: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass p-6 rounded-2xl flex flex-col items-center text-center space-y-3 hover:bg-white/5 transition-colors border border-white/5"
  >
    <div className="p-3 rounded-full bg-white/5 mb-2">
      {icon}
    </div>
    <h4 className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">{title}</h4>
  </motion.div>
);
