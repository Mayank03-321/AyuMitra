import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  Mic,
  Sparkles,
  ArrowRight,
  Lock,
  BellRing,
} from 'lucide-react';
import { AccessibilityMode, LanguageCode } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';

interface WelcomeScreenProps {
  language: LanguageCode;
  accessibilityMode?: AccessibilityMode;
  onSetAccessibility?: (mode: AccessibilityMode) => void;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  accessibilityMode = 'standard',
  onStart,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  return (
    <div className="w-full space-y-4 sm:space-y-5 flex flex-col justify-between">
      {/* Top Banner Hero (Deep Emerald Glass with balanced padding & majestic typography) */}
      <section
        className="relative rounded-[26px] sm:rounded-[28px] overflow-hidden bg-gradient-to-r from-[#0d4a3e] via-[#0b3b36] to-[#072a27] p-6 sm:p-8 lg:p-9 text-white shadow-xl border border-emerald-500/30"
        data-purpose="hero-banner"
      >
        {/* Ambient Decorative Radial Reflections inside Hero */}
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full hero-glow-blob-1 pointer-events-none" />
        <div className="absolute right-1/4 -bottom-24 w-[450px] h-[450px] rounded-full hero-glow-blob-2 pointer-events-none" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-72 h-72 border border-teal-500/15 rounded-full pointer-events-none hidden lg:block" />
        <div className="absolute right-24 top-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-teal-500/10 rounded-full pointer-events-none hidden lg:block" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10 w-full">
          {/* Left Text Content */}
          <div className="max-w-2xl flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-md shadow-xs">
                <img src="/ayumitra-logo.png" alt="AyuMitra" className="w-4 h-4 object-contain" />
                <span>All India Institute of Ayurveda • Ministry of Ayush</span>
              </div>
            </div>

            <h1
              className={`leading-tight font-extrabold text-white tracking-tight drop-shadow-sm ${
                isElderly ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl'
              }`}
            >
              {isHindi ? 'नमस्ते! मेडीकियोस्क में आपका स्वागत है' : 'Welcome to AyuMitra Smart OPD Kiosk'}
            </h1>

            <p
              className={`mt-3.5 text-emerald-100/95 leading-relaxed font-normal ${
                isElderly ? 'text-lg sm:text-xl' : 'text-sm sm:text-base lg:text-lg'
              }`}
            >
              {isHindi
                ? 'डॉक्टर साहब से मिलने से पहले, आप अपनी समस्या बोलकर या स्क्रीन छूकर आसानी से बता सकते हैं और पुरानी पर्ची स्कैन कर सकते हैं।'
                : 'Converse naturally with OmniVoice AI to record symptoms and scan past prescriptions before seeing your doctor.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <button
                id="btn-start-kiosk"
                type="button"
                onClick={onStart}
                className="group inline-flex items-center gap-3 px-8 py-3.5 sm:px-9 sm:py-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-base sm:text-xl shadow-lg shadow-amber-950/25 transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 cursor-pointer"
              >
                <span>{isHindi ? 'शुरू करें (Start Visit)' : 'Start Clinical Intake'}</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
              </button>

              <AudioVoiceButton
                text={
                  isHindi
                    ? 'आयुमित्र स्मार्ट ओपीडी में आपका स्वागत है। डॉक्टर से मिलने से पहले कृपया अपनी बीमारी और पुरानी दवाइयों की जानकारी यहाँ दर्ज करें।'
                    : 'Welcome to AyuMitra. Please register your health symptoms and prior medical documents before seeing the doctor.'
                }
                language={language}
                label={isHindi ? 'निर्देश सुनें' : 'Listen Guide'}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md shadow-xs text-xs sm:text-sm py-2.5 px-4"
              />
            </div>
          </div>

          {/* Right Side 3-Step Consultation Glass Card */}
          <div className="w-full lg:max-w-md rounded-2xl bg-emerald-950/65 backdrop-blur-md border border-emerald-400/30 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative z-10">
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-emerald-500/30">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-300 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isHindi ? 'कियोस्क उपयोग विधि • 3 SIMPLE STEPS' : '3-STEP OPD WORKFLOW'}</span>
              </div>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white mb-3">
              {isHindi ? '3 आसान चरणों में ओपीडी परामर्श' : 'Quick Multimodal Consultation Protocol'}
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black text-xs shrink-0">
                  01
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isHindi ? 'बोलें या स्क्रीन छुएं' : 'Voice Case-Taking & Symptoms'}
                  </div>
                  <div className="text-[11px] text-emerald-100/80 mt-0.5">
                    {isHindi
                      ? 'अपनी भाषा में अपनी तकलीफ़ बताएं'
                      : 'OmniVoice AI listens & summarizes complaints'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-black text-xs shrink-0">
                  02
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {isHindi ? 'पुरानी पर्ची स्कैन करें' : 'Scan Past Rx & Lab Reports'}
                  </div>
                  <div className="text-[11px] text-emerald-100/80 mt-0.5">
                    {isHindi
                      ? 'स्कैनर ट्रे पर पर्ची या टेस्ट रिपोर्ट रखें'
                      : 'PaddleOCR extracts medications & values'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-black text-xs shrink-0">
                  03
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">
                    {isHindi ? 'तुरंत टोकन प्राप्त करें' : 'Instant Token & Doctor Sync'}
                  </div>
                  <div className="text-[11px] text-emerald-100/80 mt-0.5">
                    {isHindi
                      ? 'विवरण सीधे डॉक्टर की स्क्रीन पर पहुंचेगा'
                      : 'Directly synced with OPD doctor room'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-center text-center text-[11px] text-emerald-200/90 font-medium">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-300" />
                <span>{isHindi ? '100% सुरक्षित • ABDM लिंक्ड • तत्काल टोकन' : '100% Secure • ABDM Linked • Instant Token'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Highlights (Balanced Glass Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="card-glass rounded-2xl p-4.5 sm:p-5 border border-white/90 shadow-xs flex items-start gap-4 bg-white/90">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Mic className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              {isHindi ? 'अपनी भाषा में बोलें' : 'Speak Naturally (OmniVoice)'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isHindi
                ? 'हिन्दी, अंग्रेजी व अन्य भारतीय भाषाओं में बोलकर समस्या बताएं।'
                : 'Converse in English, Hindi, and regional Indian languages with Whisper STT.'}
            </p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-4.5 sm:p-5 border border-white/90 shadow-xs flex items-start gap-4 bg-white/90">
          <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              {isHindi ? 'पुरानी पर्ची व रिपोर्ट' : 'PaddleOCR Document Intake'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isHindi
                ? 'पुरानी पर्ची या टेस्ट रिपोर्ट स्कैन करें, AI स्वतः विवरण पढ़ लेगा।'
                : 'High accuracy OCR extracts prescriptions, dosages, and lab investigations.'}
            </p>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-4.5 sm:p-5 border border-white/90 shadow-xs flex items-start gap-4 bg-white/90">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              {isHindi ? 'सुरक्षित एवं प्रमाणित' : 'ABHA & DPDP 2023 Compliant'}
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isHindi
                ? 'आपकी सहमति के बिना कोई डेटा साझा नहीं होगा। डॉक्टर ही अंतिम सत्यापन करेंगे।'
                : 'Consent-first architecture. Doctor verifies all clinical findings.'}
            </p>
          </div>
        </div>
      </div>

      {/* Kiosk Peripheral & Clinic Status Footer (Small, sleek, neatly aligned right at bottom) */}
      <footer className="mt-2 pt-2 pb-0 border-t border-teal-900/10 flex flex-col sm:flex-row items-center justify-between text-[10.5px] text-slate-600 gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50/90 px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Kiosk Active
          </span>
          <span className="text-slate-300 font-semibold">•</span>
          <span className="font-medium text-slate-600">Dual-Mic Stereo Noise Cancelation</span>
          <span className="text-slate-300 font-semibold">•</span>
          <span className="font-medium text-slate-600">PaddleOCR Hardware Bridge Active</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-700 bg-amber-50/90 px-2.5 py-0.5 rounded-full border border-amber-200/60 font-medium shrink-0 shadow-2xs">
          <BellRing className="w-3 h-3 text-amber-600 animate-bounce" />
          <span>
            {isHindi
              ? 'मदद चाहिए? कियोस्क डेस्क पर पीली घंटी दबाएं।'
              : 'Need assistance? Press the Yellow Call Bell on kiosk desk.'}
          </span>
        </div>
      </footer>
    </div>
  );
};
