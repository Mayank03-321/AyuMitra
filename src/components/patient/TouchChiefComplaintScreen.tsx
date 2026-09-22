import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode, SymptomEntity } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import {
  Smartphone,
  Check,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  Activity,
  Heart,
  Thermometer,
  Wind,
  User,
  Mic,
} from 'lucide-react';

interface TouchChiefComplaintScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onContinue: (transcript: string, entities: SymptomEntity[], method: 'touch') => void;
  onProceedToOcr?: (transcript: string, entities: SymptomEntity[]) => void;
  onSwitchToVoice?: () => void;
}

interface TouchSymptomOption {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  bodyPart: string;
  bodyPartHi: string;
  icon: string;
}

const COMMON_TOUCH_SYMPTOMS: TouchSymptomOption[] = [
  { id: 'sym_chest', name: 'Chest Pain & Tightness', nameHi: 'सीने में दर्द व भारीपन', category: 'cardiac', bodyPart: 'Chest / Sternum', bodyPartHi: 'सीने का भाग', icon: 'Heart' },
  { id: 'sym_breath', name: 'Breathlessness on exertion', nameHi: 'सांस लेने में तकलीफ (दम फूलना)', category: 'respiratory', bodyPart: 'Respiratory / Lungs', bodyPartHi: 'श्वसन तंत्र', icon: 'Wind' },
  { id: 'sym_fever', name: 'High Fever & Chills', nameHi: 'तेज बुखार व ठंड लगना', category: 'fever', bodyPart: 'Whole Body', bodyPartHi: 'पूरा शरीर', icon: 'Thermometer' },
  { id: 'sym_cough', name: 'Persistent Cough & Cold', nameHi: 'लगातार खांसी व जुकाम', category: 'respiratory', bodyPart: 'Throat & Lungs', bodyPartHi: 'गला व फेफड़े', icon: 'Activity' },
  { id: 'sym_headache', name: 'Severe Headache', nameHi: 'तेज सिरदर्द व तनाव', category: 'neuro', bodyPart: 'Head & Forehead', bodyPartHi: 'सिर का भाग', icon: 'Activity' },
  { id: 'sym_stomach', name: 'Abdominal / Stomach Pain', nameHi: 'पेट दर्द व मरोड़', category: 'gi', bodyPart: 'Upper Abdomen', bodyPartHi: 'ऊपरी पेट', icon: 'Activity' },
  { id: 'sym_bodyache', name: 'Body Ache & Fatigue', nameHi: 'बदन दर्द व कमजोरी', category: 'general', bodyPart: 'Full Body', bodyPartHi: 'पूरा शरीर', icon: 'User' },
  { id: 'sym_acidity', name: 'Heartburn & Acidity', nameHi: 'खट्टी डकार व सीने में जलन', category: 'gi', bodyPart: 'Epigastrium', bodyPartHi: 'पेट/छाती की नली', icon: 'Activity' },
  { id: 'sym_joint', name: 'Joint & Knee Pain', nameHi: 'जोड़ों व घुटनों में दर्द', category: 'ortho', bodyPart: 'Joints / Knees', bodyPartHi: 'जोड़ व घुटने', icon: 'Activity' },
  { id: 'sym_dizziness', name: 'Dizziness & Giddiness', nameHi: 'चक्कर आना व घबराहट', category: 'neuro', bodyPart: 'Head & Vestibular', bodyPartHi: 'सिर व संतुलन', icon: 'Activity' },
];

const DURATION_OPTIONS = [
  { id: 'dur_today', label: 'Today (< 24 hours)', labelHi: 'आज से (< 24 घंटे)' },
  { id: 'dur_2days', label: '1 - 2 Days', labelHi: '1 - 2 दिन से' },
  { id: 'dur_1week', label: '3 - 7 Days (1 Week)', labelHi: '3 - 7 दिन (1 हफ्ता)' },
  { id: 'dur_2weeks', label: '1 - 2 Weeks', labelHi: '1 - 2 सप्ताह से' },
  { id: 'dur_month', label: 'More than 1 Month', labelHi: '1 महीने से अधिक' },
];

const SEVERITY_OPTIONS = [
  { id: 'mild', label: 'Mild (1-3)', labelHi: 'हल्का (1-3)', color: 'border-slate-300 text-slate-700 bg-slate-50' },
  { id: 'moderate', label: 'Moderate (4-6)', labelHi: 'मध्यम (4-6)', color: 'border-amber-300 text-amber-900 bg-amber-50' },
  { id: 'severe', label: 'Severe (7-9)', labelHi: 'तीव्र (7-9)', color: 'border-rose-300 text-rose-900 bg-rose-50' },
];

/**
 * TouchChiefComplaintScreen Component
 * Provides an accessible touch-first UI to record chief complaints, time/duration, and severity.
 */
export const TouchChiefComplaintScreen: React.FC<TouchChiefComplaintScreenProps> = ({
  language,
  accessibilityMode,
  onContinue,
  onProceedToOcr,
  onSwitchToVoice,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>(['sym_chest', 'sym_breath']);
  const [selectedDuration, setSelectedDuration] = useState<string>('dur_2days');
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('severe');

  const toggleSymptom = (id: string) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((item) => item !== id) : prev) : [...prev, id]
    );
  };

  const selectedSymptomsList = COMMON_TOUCH_SYMPTOMS.filter((s) => selectedSymptomIds.includes(s.id));
  const currentDurationObj = DURATION_OPTIONS.find((d) => d.id === selectedDuration) || DURATION_OPTIONS[1];

  const durationLabel = isHindi ? currentDurationObj.labelHi : currentDurationObj.label;

  // Build clinical entities
  const buildExtractedEntities = (): SymptomEntity[] => {
    return selectedSymptomsList.map((s, idx) => ({
      id: `touch_sym_${idx + 1}`,
      symptom: isHindi ? s.nameHi : s.name,
      present: true,
      duration: durationLabel,
      severity: selectedSeverity,
      bodyPart: isHindi ? s.bodyPartHi : s.bodyPart,
      source: { type: 'PATIENT_STATEMENT', confidence: 0.98 },
    }));
  };

  const buildTranscript = (): string => {
    const symNames = selectedSymptomsList.map((s) => (isHindi ? s.nameHi : s.name)).join(', ');
    if (isHindi) {
      return `मरीज ने टचस्क्रीन द्वारा दर्ज किया: लक्षण - ${symNames}। अवधि: ${durationLabel}। तीव्रता: ${selectedSeverity === 'severe' ? 'तीव्र' : selectedSeverity === 'moderate' ? 'मध्यम' : 'हल्का'}।`;
    }
    return `Patient reported via touch intake: Symptoms - ${symNames}. Duration: ${durationLabel}. Severity: ${selectedSeverity}.`;
  };

  const handleNext = () => {
    const entities = buildExtractedEntities();
    const transcript = buildTranscript();
    onContinue(transcript, entities, 'touch');
  };

  const handleOcr = () => {
    const entities = buildExtractedEntities();
    const transcript = buildTranscript();
    if (onProceedToOcr) {
      onProceedToOcr(transcript, entities);
    }
  };

  const guideVoiceText = isHindi
    ? 'कृपया स्क्रीन पर अपने लक्षण, कितने दिनों से तकलीफ है और दर्द की तीव्रता चुनें।'
    : 'Please tap and select your symptoms, duration of symptoms, and severity on the screen.';

  return (
    <div className="max-w-7xl mx-auto py-3 px-4 lg:px-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              {isHindi ? 'टच लक्षण प्रविष्टि' : 'Touch Symptom Intake'}
            </span>
          </div>
          <h2 className={`font-extrabold text-slate-900 ${isElderly ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            {isHindi ? 'लक्षण, समय और तीव्रता चुनें' : 'Select Symptoms & Duration'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToVoice && (
            <button
              type="button"
              onClick={onSwitchToVoice}
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHindi ? 'वॉइस मोड पर जाएं' : 'Switch to Voice'}</span>
            </button>
          )}

          <AudioVoiceButton
            text={guideVoiceText}
            language={language}
            label={isHindi ? 'निर्देश सुनें' : 'Listen'}
            variant="secondary"
          />
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Touch Questionnaire (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Choose Symptoms */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? '1. मुख्य लक्षण चुनें (Multiple Select):' : '1. Select Main Symptoms:'}</span>
              </label>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {selectedSymptomIds.length} {isHindi ? 'चयनित' : 'Selected'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMON_TOUCH_SYMPTOMS.map((sym) => {
                const isSelected = selectedSymptomIds.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">
                      {isHindi ? sym.nameHi : sym.name}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Duration / Time */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? '2. यह तकलीफ कितने समय से है? (अवधि):' : '2. How long have you had this? (Duration):'}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DURATION_OPTIONS.map((dur) => {
                const isSelected = selectedDuration === dur.id;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setSelectedDuration(dur.id)}
                    className={`p-2.5 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isHindi ? dur.labelHi : dur.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Severity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? '3. दर्द या समस्या की तीव्रता:' : '3. Pain / Severity Level:'}</span>
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {SEVERITY_OPTIONS.map((sev) => {
                const isSelected = selectedSeverity === sev.id;
                return (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSelectedSeverity(sev.id as any)}
                    className={`p-3 rounded-xl border-2 text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : `${sev.color} hover:opacity-90`
                    }`}
                  >
                    {isHindi ? sev.labelHi : sev.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Clinical Entities & Proceed Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {isHindi ? 'पहचाने गए लक्षण' : 'Extracted Clinical Entities'}
                </h3>
              </div>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {selectedSymptomsList.length} {isHindi ? 'पहचाने गए' : 'Detected'}
              </span>
            </div>

            {/* Extracted Symptoms Cards */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {selectedSymptomsList.map((sym) => (
                <div key={sym.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span className="flex items-center gap-1.5 text-emerald-950">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {isHindi ? sym.nameHi : sym.name}
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      98% Touch
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                    <span><strong>Duration:</strong> {durationLabel}</span>
                    <span><strong>Severity:</strong> {selectedSeverity}</span>
                    <span><strong>Area:</strong> {isHindi ? sym.bodyPartHi : sym.bodyPart}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Structured Summary Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-800 block mb-1">
                {isHindi ? 'क्लिनिकल सारांश:' : 'Intake Summary:'}
              </span>
              <p className="italic text-slate-600 text-[11px] leading-relaxed">
                "{buildTranscript()}"
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>{isHindi ? 'आगे बढ़ें (अनुकूली प्रश्न)' : 'Continue to Adaptive Questions'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onProceedToOcr && (
              <button
                type="button"
                onClick={handleOcr}
                className="w-full py-3 px-5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'सीधे पर्ची स्कैन करें (OCR)' : 'Scan Documents (OCR)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
