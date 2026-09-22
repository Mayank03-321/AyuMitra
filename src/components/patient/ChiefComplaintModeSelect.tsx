import React from 'react';
import { LanguageCode, AccessibilityMode } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { Mic, Smartphone, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ChiefComplaintModeSelectProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  patientName: string;
  onSelectMode: (mode: 'voice' | 'touch') => void;
}

/**
 * ChiefComplaintModeSelect Component
 * Allows patients to choose between conversational Voice AI intake and interactive Touchscreen intake.
 */
export const ChiefComplaintModeSelect: React.FC<ChiefComplaintModeSelectProps> = ({
  language,
  accessibilityMode,
  patientName,
  onSelectMode,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const guideVoiceText = isHindi
    ? `${patientName}, आप अपनी समस्या कैसे बताना चाहते हैं? बोलकर AI सहायक से बात करने के लिए वॉइस चुनें, या स्क्रीन पर छूकर लक्षण दर्ज करने के लिए टच चुनें।`
    : `${patientName}, please select how you would like to share your symptoms. Choose Speak to converse with Voice AI, or choose Touch to use the interactive on-screen questionnaire.`;

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? 'परामर्श इनपुट विधि चुनें' : 'Select Intake Method'}</span>
          </div>
          <h2 className={`font-extrabold text-slate-900 tracking-tight ${isElderly ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            {isHindi ? 'अपनी बीमारी या लक्षण कैसे बताना चाहते हैं?' : 'How would you like to share your symptoms?'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {isHindi
              ? `${patientName}, अपनी सुविधानुसार बोलकर बताएं या स्क्रीन छूकर लक्षण चुनें।`
              : `${patientName}, choose between natural AI voice conversation or easy touchscreen symptom selection.`}
          </p>
        </div>

        <AudioVoiceButton
          text={guideVoiceText}
          language={language}
          label={isHindi ? 'निर्देश सुनें' : 'Listen Guide'}
          variant="secondary"
          className="shrink-0 shadow-xs"
        />
      </div>

      {/* 2-Option Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
        {/* Option 1: Speak / Voice Case-Taking */}
        <div
          onClick={() => onSelectMode('voice')}
          className="group relative rounded-3xl bg-gradient-to-b from-white to-emerald-50/40 border-2 border-emerald-200 hover:border-emerald-500 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
            <Mic className="w-3 h-3 animate-pulse" />
            <span>{isHindi ? 'अनुशंसित' : 'Recommended'}</span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Mic className="w-7 h-7" />
            </div>

            <h3 className={`font-bold text-slate-900 mb-1.5 ${isElderly ? 'text-2xl' : 'text-xl'}`}>
              {isHindi ? '🎙️ बोलकर बताएं' : '🎙️ Speak (Voice AI)'}
            </h3>
            <p className="text-emerald-800 font-semibold text-xs sm:text-sm mb-3">
              {isHindi ? 'OmniVoice AI और Whisper STT संवाद' : 'OmniVoice AI & Whisper STT Conversation'}
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              {isHindi
                ? 'अपनी भाषा में खुलकर बोलें। AI आपकी आवाज सुनकर लक्षणों को स्वतः समझकर डॉक्टर के लिए तैयार करेगा।'
                : 'Converse naturally with OmniVoice AI. High-accuracy Whisper STT transcribes speech and extracts clinical symptoms in real-time.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-emerald-100 text-xs text-slate-700 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'बिना टाइप किए आसान बातचीत' : 'Hands-free natural dialogue'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'रीयल-टाइम लक्षण पहचान व सुझाव' : 'Real-time clinical entity extraction'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? 'बहुभाषी वॉइस सहायता' : 'Multilingual speech support'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('voice');
            }}
            className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-700 cursor-pointer"
          >
            <span>{isHindi ? 'वॉइस द्वारा शुरू करें' : 'Start Voice Intake'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Option 2: Touch / Screen Questionnaire */}
        <div
          onClick={() => onSelectMode('touch')}
          className="group relative rounded-3xl bg-gradient-to-b from-white to-blue-50/40 border-2 border-blue-200 hover:border-blue-500 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            <Smartphone className="w-3 h-3" />
            <span>{isHindi ? 'टच स्क्रीन' : 'Touchscreen'}</span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-700/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-7 h-7" />
            </div>

            <h3 className={`font-bold text-slate-900 mb-1.5 ${isElderly ? 'text-2xl' : 'text-xl'}`}>
              {isHindi ? '📱 स्क्रीन छूकर चुनें' : '📱 Touch (Questionnaire)'}
            </h3>
            <p className="text-blue-800 font-semibold text-xs sm:text-sm mb-3">
              {isHindi ? 'लक्षण, समय और गंभीरता का चयन' : 'Step-by-Step Symptoms, Duration & Severity'}
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              {isHindi
                ? 'स्क्रीन पर दिए गए विकल्पों को छूकर अपनी तकलीफ, कितने दिनों से है और दर्द की तीव्रता आसानी से चुनें।'
                : 'Tap through on-screen cards to select your exact symptoms, duration (time), pain intensity, and affected body regions.'}
            </p>

            <div className="space-y-2 pt-2 border-t border-blue-100 text-xs text-slate-700 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{isHindi ? 'चित्रमय लक्षण कार्ड्स' : 'Visual symptom & body location cards'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{isHindi ? 'दिन व समय का स्पष्ट चयन' : 'Clear duration & timeline selector'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{isHindi ? 'शांत व गोपनीय प्रक्रिया' : 'Quiet & private step-by-step flow'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode('touch');
            }}
            className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-blue-700 cursor-pointer"
          >
            <span>{isHindi ? 'टच द्वारा शुरू करें' : 'Start Touch Intake'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isHindi ? 'सुरक्षित व गोपनीय डेटा संकलन (DPDP 2023 Compliant)' : 'End-to-End Encrypted & DPDP 2023 Compliant Session'}</span>
        </div>
        <span className="hidden sm:inline font-medium text-slate-500">
          {isHindi ? 'आप बाद में भी तरीका बदल सकते हैं' : 'You can switch input mode anytime'}
        </span>
      </div>
    </div>
  );
};
