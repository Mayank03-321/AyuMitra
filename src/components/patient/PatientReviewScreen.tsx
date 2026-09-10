import React from 'react';
import { LanguageCode, AccessibilityMode, MedicalDocument } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import {
  Send,
  AlertTriangle,
  Heart,
  Pill,
} from 'lucide-react';

interface PatientReviewScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  patientName: string;
  transcript: string;
  documents: MedicalDocument[];
  onSubmit: () => void;
}

export const PatientReviewScreen: React.FC<PatientReviewScreenProps> = ({
  language,
  accessibilityMode,
  patientName,
  transcript,
  documents,
  onSubmit,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const audioSummary = isHindi
    ? `नमस्ते ${patientName} जी। आपके द्वारा दर्ज किया गया विवरण: आपको 2 दिन से सीने में दर्द और सांस लेने में तकलीफ है। पुरानी पर्ची से मेटफॉर्मिन 500mg और लैब रिपोर्ट से HbA1c 7.2% दर्ज किया गया है। अब इसे डॉक्टर साहब को भेजा जा रहा है।`
    : `Hello ${patientName}. Your summary: 2-day history of chest tightness and shortness of breath. Prescribed Metformin 500mg and elevated HbA1c 7.2% recorded. Ready to transmit to your physician.`;

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Title */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'विवरण की समीक्षा' : 'Review & Verification'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? 'कृपया अपना विवरण जांच लें या ऑडियो सुनकर पुष्टि करें।'
              : 'Listen to the audio recap or review key findings before submitting to the doctor.'}
          </p>
        </div>

        <AudioVoiceButton
          text={audioSummary}
          language={language}
          label={isHindi ? 'पूरा सारांश सुनें' : 'Listen Summary'}
          size="md"
          variant="primary"
        />
      </div>

      {/* Structured Review Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 mb-6">
        {/* Chief Complaint Recap */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            {isHindi ? 'आपकी मुख्य शिकायत:' : 'Primary Complaint:'}
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed italic">
            &quot;{transcript || (isHindi ? 'मुझे दो दिन से सीने में दर्द हो रहा है और सांस लेने में तकलीफ है।' : 'I have been experiencing chest discomfort and shortness of breath for 2 days.')}&quot;
          </p>
        </div>

        {/* Clinical Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'निकाली गई दवाइयां' : 'Extracted Medications'}</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1">
              <li className="font-semibold">• Metformin 500mg (BD)</li>
              <li className="font-semibold">• Telmisartan 40mg (OD)</li>
              <li className="font-semibold">• Aspirin 75mg (OD)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
              <Heart className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'जांच रिपोर्ट' : 'Laboratory Findings'}</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1">
              <li className="font-semibold text-rose-700">• HbA1c: 7.2 % [{isHindi ? 'अनियमित' : 'Elevated'}]</li>
              <li className="font-semibold text-rose-700">• Fasting Blood Sugar: 142 mg/dL</li>
              <li className="font-semibold text-slate-600">• Serum Creatinine: 0.9 mg/dL [{isHindi ? 'सामान्य' : 'Normal'}]</li>
            </ul>
          </div>
        </div>

        {/* Priority Desk Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="block text-sm font-bold text-amber-950 mb-0.5">
              {isHindi ? 'चिकित्सक समीक्षा हेतु तैयार' : 'Physician-Ready History Draft'}
            </strong>
            {isHindi
              ? 'यह सारांश डॉ. अनन्या रॉय के कंप्यूटर पर भेजा जा रहा है। डॉक्टर साहब आपके कक्ष में प्रवेश करते ही इसे देखकर सीधा उपचार शुरू करेंगे।'
              : 'Your clinical history is formatted into standard clinical modules (CC, HPI, PMHx, Drug, Allergy, AYUSH) for direct physician verification.'}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          id="btn-submit-to-physician"
          type="button"
          onClick={onSubmit}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-10 py-5 text-2xl' : 'px-8 py-4 text-lg'
          }`}
        >
          <Send className="w-5 h-5" />
          <span>
            {isHindi ? 'डॉक्टर को भेजें' : 'Submit to Physician Desk'}
          </span>
        </button>
      </div>
    </div>
  );
};
