import React, { useState } from 'react';
import { Patient, LanguageCode, AccessibilityMode, IdentificationType } from '../../types';
import { DEMO_PATIENT } from '../../data/initialData';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { Shield, Building2, UserPlus, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface IdentificationScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onIdentify: (patient: Patient) => void;
}

export const IdentificationScreen: React.FC<IdentificationScreenProps> = ({
  language,
  accessibilityMode,
  onIdentify,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [idType, setIdType] = useState<IdentificationType>('abha');
  const [abhaNumber, setAbhaNumber] = useState('91-4523-8871-0047');
  const [patientName, setPatientName] = useState('Ravi Kumar');
  const [patientAge, setPatientAge] = useState(58);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('male');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(true);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 600);
  };

  const handleQuickLoadDemo = () => {
    setIdType('abha');
    setAbhaNumber(DEMO_PATIENT.identity.idNumber);
    setPatientName(DEMO_PATIENT.name);
    setPatientAge(DEMO_PATIENT.age);
    setPatientGender(DEMO_PATIENT.gender);
    setVerified(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientData: Patient = {
      id: DEMO_PATIENT.id,
      name: patientName || 'Ravi Kumar',
      age: Number(patientAge) || 58,
      gender: patientGender,
      language,
      abhaAddress: `${patientName.toLowerCase().replace(/\s+/g, '')}${patientAge}@abdm`,
      identity: {
        type: idType,
        idNumber: abhaNumber || '91-4523-8871-0047',
        isVerified: verified,
      },
    };
    onIdentify(patientData);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'मरीज की पहचान' : 'Patient Identification'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? 'अपना आभा कार्ड (ABHA), अस्पताल पर्ची संख्या दर्ज करें या नया पंजीकरण करें।'
              : 'Enter your ABHA ID, Hospital Registration Number, or register as a new patient.'}
          </p>
        </div>

        <AudioVoiceButton
          text={
            isHindi
              ? 'कृपया अपनी पहचान दर्ज करें। यदि आपके पास आयुष्मान भारत आभा कार्ड है, तो नंबर दर्ज करें।'
              : 'Please enter your identification. You can use your ABHA card or hospital registration.'
          }
          language={language}
          label={isHindi ? 'ऑडियो सुनें' : 'Listen'}
          variant="secondary"
        />
      </div>

      {/* ID Type Switcher */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setIdType('abha')}
          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            idType === 'abha'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-5 h-5 text-emerald-600" />
          <span className="text-xs sm:text-sm font-semibold">
            {isHindi ? 'आभा कार्ड' : 'ABHA Card ID'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIdType('hospital_id')}
          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            idType === 'hospital_id'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="text-xs sm:text-sm font-semibold">
            {isHindi ? 'अस्पताल पर्ची' : 'Hospital MRN'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIdType('new_patient')}
          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
            idType === 'new_patient'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs ring-1 ring-emerald-500/20'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-5 h-5 text-purple-600" />
          <span className="text-xs sm:text-sm font-semibold">
            {isHindi ? 'नया मरीज' : 'New Registration'}
          </span>
        </button>
      </div>

      {/* Demo Patient Fast Fill Notice */}
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Patient Scenario:</strong> Ravi Kumar (58 yrs, Hindi, Chest Pain & Dyspnoea).
          </span>
        </div>
        <button
          type="button"
          onClick={handleQuickLoadDemo}
          className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition-all shrink-0 cursor-pointer"
        >
          Load Demo Patient
        </button>
      </div>

      {/* Identification Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        {idType === 'abha' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isHindi ? '14-अंकीय आभा संख्या' : '14-Digit ABHA Number'}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="input-abha-number"
                type="text"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                placeholder="e.g. 91-4523-8871-0047"
                className={`w-full px-4 py-3 rounded-xl border font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
                  verified ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerifying}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shrink-0 transition-all cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : verified ? 'Verified ✓' : 'Verify'}
              </button>
            </div>
            {verified && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ABHA linked and authenticated via National Health Authority (ABDM) Sandbox</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isHindi ? 'पूरा नाम' : 'Full Name'}
            </label>
            <input
              id="input-patient-name"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isHindi ? 'उम्र' : 'Age'}
              </label>
              <input
                id="input-patient-age"
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isHindi ? 'लिंग' : 'Gender'}
              </label>
              <select
                id="select-patient-gender"
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
                className="w-full px-3 py-3 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                <option value="male">{isHindi ? 'पुरुष' : 'Male'}</option>
                <option value="female">{isHindi ? 'महिला' : 'Female'}</option>
                <option value="other">{isHindi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            id="btn-confirm-identification"
            type="submit"
            className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
              isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
            }`}
          >
            <span>{isHindi ? 'सहमति पृष्ठ पर जाएं' : 'Proceed to Consent'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
