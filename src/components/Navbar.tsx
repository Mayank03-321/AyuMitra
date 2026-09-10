import React from 'react';
import {
  Globe,
  Plus,
  Volume2,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { AccessibilityMode, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/initialData';
import { LanguageSelectorDropdown } from './ui/language-selector-dropdown';

interface NavbarProps {
  currentTab: 'patient';
  onSelectTab: (tab: 'patient') => void;
  accessibilityMode: AccessibilityMode;
  onChangeAccessibility: (mode: AccessibilityMode) => void;
  selectedLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  onResetDemo: () => void;
  onExit: () => void;
  hasRedFlags?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLanguage,
  onChangeLanguage,
  onExit,
}) => {
  const isHindi = selectedLanguage === 'hi';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Hospital Context */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div
            onClick={onExit}
            className="flex items-center gap-3 cursor-pointer group"
            title="AyuMitra Hospital Suite Home"
          >
            <img
              src="/ayumitra-logo.png"
              alt="AyuMitra Logo"
              className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xl font-heading tracking-tight">
                  AyuMitra
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-800 bg-emerald-100 rounded-md uppercase border border-emerald-200/60">
                  OPD Suite
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-md border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ABDM Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI Multilingual Clinical Intake & Triage Protocol
              </p>
            </div>
          </div>
        </div>

        {/* Right Tools & Hospital Contact */}
        <div className="flex items-center gap-2.5 flex-wrap md:flex-nowrap justify-end w-full md:w-auto">
          
          {/* Emergency Hotline Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 animate-bounce text-rose-600" />
            <span>Emergency: <strong>108</strong></span>
          </div>

          {/* Audio Page Listener */}
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) {
                const text = isHindi
                  ? 'आयुमित्र स्मार्ट ओपीडी कियोस्क में आपका स्वागत है। अपनी भाषा और मुख्य लक्षण चुनें।'
                  : 'Welcome to AyuMitra smart OPD kiosk. Please select your language and describe your symptoms.';
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
                window.speechSynthesis.speak(utterance);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{isHindi ? 'पेज सुनें' : 'Listen'}</span>
          </button>

          {/* Language Selector Dropdown (Pill UI) */}
          <LanguageSelectorDropdown
            value={selectedLanguage}
            onChange={onChangeLanguage}
          />


          {/* Help Button */}
          <button
            type="button"
            onClick={() => alert(isHindi ? 'आयुमित्र सहायता केंद्र: यदि आपको कियोस्क उपयोग में कठिनाई हो रही है, तो कृपया पास के स्वास्थ्य मित्र या ओपीडी हेल्पडेस्क से संपर्क करें।' : 'AyuMitra Help: If you need assistance with the kiosk, please ask the OPD Helpdesk or Swasthya Mitra.')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Help</span>
          </button>

        </div>
      </div>
    </header>
  );
};
