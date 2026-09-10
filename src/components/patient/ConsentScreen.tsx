import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode, ConsentRecord } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { ShieldCheck, Lock, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface ConsentScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  patientName: string;
  onGrantConsent: (consent: ConsentRecord) => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  language,
  accessibilityMode,
  patientName,
  onGrantConsent,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [scopeHistory, setScopeHistory] = useState(true);
  const [scopeOcr, setScopeOcr] = useState(true);
  const [scopeAbdm, setScopeAbdm] = useState(true);

  const audioConsentExplanation = isHindi
    ? 'यह सहमति डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 के तहत ली जा रही है। आपकी बातचीत और पुरानी पर्ची का विवरण केवल आपके डॉक्टर को दिखाने के लिए इस्तेमाल होगा। क्या आप सहमति देते हैं?'
    : 'This consent is collected under the Digital Personal Data Protection Act 2023. Your voice inputs and scanned prescriptions are used exclusively by your consulting physician.';

  const handleConfirm = () => {
    const consent: ConsentRecord = {
      consentId: 'CON-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      patientId: 'PAT-IND-2026-047',
      sessionId: 'SES-DEMO-2026-001',
      purpose: 'Digital OPD Clinical History Taking & Document Digitization',
      scope: [
        scopeHistory ? 'clinical_history' : '',
        scopeOcr ? 'document_ocr' : '',
        scopeAbdm ? 'abdm_sync' : '',
      ].filter(Boolean),
      status: 'granted',
      grantedAt: new Date().toISOString(),
      version: 'DPDP-2023-V1.0',
    };
    onGrantConsent(consent);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DPDP Act 2023 & ABDM Consent Compliant</span>
          </div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'मरीज की सहमति' : 'Informed Patient Consent'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? `${patientName}, कृपया अपनी सहमति दें ताकि डॉक्टर साहब से पहले आपका विवरण तैयार किया जा सके।`
              : `${patientName}, please review and grant your explicit clinical consent.`}
          </p>
        </div>

        <AudioVoiceButton
          text={audioConsentExplanation}
          language={language}
          label={isHindi ? 'सहमति सुनें' : 'Listen Consent'}
          variant="secondary"
        />
      </div>

      {/* Main Consent Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        {/* Transparency points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              {isHindi ? '1. क्या एकत्र होगा?' : '1. What is collected?'}
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'आपकी मौखिक बातचीत, पुरानी पर्ची व लैब टेस्ट की फोटो।'
                : 'Your spoken conversation, prior prescription photos, and laboratory test reports.'}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              {isHindi ? '2. इसका क्या उपयोग है?' : '2. How is it used?'}
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'डॉक्टर को संपूर्ण विवरण व्यवस्थित रूप से दिखाने के लिए।'
                : 'To synthesize and organize structured clinical notes for your consulting physician.'}
            </p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">
              {isHindi ? '3. गोपनीयता एवं सुरक्षा' : '3. Privacy & Security'}
            </span>
            <p className="text-slate-600 leading-relaxed">
              {isHindi
                ? 'सत्र समाप्ति के बाद अस्थायी डेटा सुरक्षित रूप से साफ किया जाता है।'
                : 'Session data is encrypted end-to-end and stored securely per DPDP guidelines.'}
            </p>
          </div>
        </div>

        {/* Granular Scopes */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            {isHindi ? 'सहमति के घटक:' : 'Consent Scopes:'}
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={scopeHistory}
              onChange={(e) => setScopeHistory(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {isHindi ? 'मौखिक व स्क्रीन पर इतिहास संकलन' : 'Conversational Clinical History'}
              </span>
              <span className="text-xs text-slate-500">
                {isHindi
                  ? 'आवाज या टचस्क्रीन द्वारा वर्तमान बीमारी और पूर्व बीमारियों का विवरण।'
                  : 'Capture chief complaints and HPI via voice/touch interaction.'}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={scopeOcr}
              onChange={(e) => setScopeOcr(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {isHindi ? 'पुरानी पर्ची एवं रिपोर्ट का OCR स्कैन' : 'Document OCR & Medical Extraction'}
              </span>
              <span className="text-xs text-slate-500">
                {isHindi
                  ? 'दवाइयों और जांच रिपोर्ट से स्वतः विवरण निकालने की अनुमति।'
                  : 'Digitize prescription drugs and laboratory parameters.'}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
            <input
              type="checkbox"
              checked={scopeAbdm}
              onChange={(e) => setScopeAbdm(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm block">
                {isHindi ? 'डॉक्टर सत्यापन व आभा लिंकेज' : 'ABHA Health Record Linkage'}
              </span>
              <span className="text-xs text-slate-500">
                {isHindi
                  ? 'डॉक्टर द्वारा पुष्टि के बाद रिकॉर्ड को आपकी आभा आईडी से जोड़ना।'
                  : 'Securely link physician-verified record to ABHA health locker.'}
              </span>
            </div>
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>256-bit encrypted session</span>
          </div>

          <button
            id="btn-grant-consent"
            type="button"
            onClick={handleConfirm}
            className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
              isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
            }`}
          >
            <span>{isHindi ? 'मैं सहमत हूँ' : 'I Agree & Grant Consent'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
