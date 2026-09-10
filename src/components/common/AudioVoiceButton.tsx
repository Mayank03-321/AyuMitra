import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioVoiceButtonProps {
  text: string;
  language?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export const AudioVoiceButton: React.FC<AudioVoiceButtonProps> = ({
  text,
  language = 'en',
  label = 'Listen',
  size = 'md',
  variant = 'secondary',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm gap-2',
    md: 'px-6 py-2.5 text-lg gap-2',
    lg: 'px-8 py-3.5 text-xl gap-3 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95',
    secondary: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 active:scale-95',
    ghost: 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100',
  };

  return (
    <button
      id={`audio-btn-${Math.random().toString(36).substring(2, 7)}`}
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center rounded-full transition-all cursor-pointer select-none font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={`Audio instruction (${language})`}
    >
      {isPlaying ? (
        <VolumeX className="w-5 h-5 text-amber-600 animate-pulse" />
      ) : (
        <Volume2 className="w-5 h-5 text-emerald-600" />
      )}
      <span>{isPlaying ? 'Speaking...' : label}</span>
    </button>
  );
};
