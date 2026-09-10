import React from 'react';
import { LanguageCode, AccessibilityMode } from '../../types';
import { CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { AudioVoiceButton } from '../common/AudioVoiceButton';

interface CompletionScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  patientName: string;
  onReset: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  language,
  accessibilityMode,
  patientName,
  onReset,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const audioMessage = isHindi
    ? `धन्यवाद ${patientName} जी। आपका केस विवरण सफलतापूर्वक दर्ज हो चुका है। आपका टोकन नंबर A-104 है। कृपया ओपीडी कक्ष संख्या 12 के बाहर प्रतीक्षा करें।`
    : `Thank you ${patientName}. Your clinical history intake is successfully transmitted. Token Number A-104. Please proceed to OPD Room 12.`;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 lg:px-6 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-md relative overflow-hidden">
        {/* Success Icon & AyuMitra Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/ayumitra-logo.png"
            alt="AyuMitra"
            className="w-16 h-16 object-contain drop-shadow-sm"
          />
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Intake Transmitted to Hospital OPD System</span>
        </div>

        <h1
          className={`font-black text-slate-900 mb-2 ${
            isElderly ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
          }`}
        >
          {isHindi ? 'विवरण सफलतापूर्वक दर्ज हुआ!' : 'Clinical Intake Complete!'}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8">
          {isHindi
            ? `श्री ${patientName}, आपका मेडिकल रिकॉर्ड डॉक्टर साहब के कंप्यूटर पर सुरक्षित रूप से पहुंच चुका है।`
            : `${patientName}, your synthesized case sheet is now live on the physician consultation dashboard.`}
        </p>

        {/* Token Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 mb-8 shadow-md text-left">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Queue Token
              </span>
              <span className="text-3xl sm:text-4xl font-black tracking-tight">Token #A-104</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Wait
              </span>
              <span className="text-lg font-bold text-slate-200 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>~3 Mins</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Consulting Physician:</span>
              <span className="font-bold text-slate-200 text-sm">Dr. Ananya Roy, MD</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Assigned Room:</span>
              <span className="font-bold text-slate-200 text-sm">OPD Room #12 (Medicine)</span>
            </div>
          </div>
        </div>

        {/* Audio repeat */}
        <div className="flex justify-center mb-8">
          <AudioVoiceButton
            text={audioMessage}
            language={language}
            label={isHindi ? 'टोकन निर्देश दोबारा सुनें' : 'Listen Instructions'}
            variant="secondary"
          />
        </div>

        {/* Primary CTA for Doctor Demo Flow */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Start New Kiosk Session
          </button>
        </div>
      </div>
    </div>
  );
};
