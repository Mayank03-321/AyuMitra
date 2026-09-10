import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode } from '../../types';
import { Leaf, Stethoscope, ArrowRight } from 'lucide-react';
import { AudioVoiceButton } from '../common/AudioVoiceButton';

interface DoctorSelectionScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onComplete: (choice: 'ayush' | 'general') => void;
}

export const DoctorSelectionScreen: React.FC<DoctorSelectionScreenProps> = ({
  language,
  accessibilityMode,
  onComplete,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';
  const [selected, setSelected] = useState<'ayush' | 'general' | null>(null);

  const titleText = isHindi ? 'आप किस डॉक्टर से परामर्श लेना चाहते हैं?' : 'Which doctor would you like to consult?';
  const subtitleText = isHindi ? 'अपनी आवश्यकता के अनुसार चुनें।' : 'Choose based on your clinical preference.';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-10">
        <h2 className={`font-extrabold text-slate-900 mb-4 ${isElderly ? 'text-4xl' : 'text-3xl'}`}>
          {titleText}
        </h2>
        <p className={`text-slate-600 ${isElderly ? 'text-xl' : 'text-lg'}`}>
          {subtitleText}
        </p>
        <div className="mt-4 flex justify-center">
          <AudioVoiceButton text={titleText + ' ' + subtitleText} language={language} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
        {/* Ayush Doctor Option */}
        <button
          type="button"
          onClick={() => setSelected('ayush')}
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all cursor-pointer bg-white text-center shadow-xs hover:shadow-md ${
            selected === 'ayush'
              ? 'border-emerald-600 ring-4 ring-emerald-600/20'
              : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${
            selected === 'ayush' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}>
            <Leaf className="w-10 h-10" />
          </div>
          <h3 className={`font-bold text-slate-900 mb-2 ${isElderly ? 'text-2xl' : 'text-xl'}`}>
            {isHindi ? 'आयुष डॉक्टर' : 'AYUSH Specialist'}
          </h3>
          <p className={`text-slate-500 ${isElderly ? 'text-lg' : 'text-sm'}`}>
            {isHindi ? 'आयुर्वेद, योग, यूनानी, सिद्ध या होम्योपैथी विशेषज्ञ' : 'Ayurveda, Yoga, Unani, Siddha, or Homeopathy consultation'}
          </p>
        </button>

        {/* General Doctor Option */}
        <button
          type="button"
          onClick={() => setSelected('general')}
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all cursor-pointer bg-white text-center shadow-xs hover:shadow-md ${
            selected === 'general'
              ? 'border-blue-600 ring-4 ring-blue-600/20'
              : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-inner ${
            selected === 'general' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
          }`}>
            <Stethoscope className="w-10 h-10" />
          </div>
          <h3 className={`font-bold text-slate-900 mb-2 ${isElderly ? 'text-2xl' : 'text-xl'}`}>
            {isHindi ? 'सामान्य डॉक्टर' : 'General Physician'}
          </h3>
          <p className={`text-slate-500 ${isElderly ? 'text-lg' : 'text-sm'}`}>
            {isHindi ? 'एलोपैथी (MBBS) विशेषज्ञ' : 'Allopathy (MBBS / Internal Medicine) specialist'}
          </p>
        </button>
      </div>

      <div className="flex justify-center w-full">
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (selected) onComplete(selected);
          }}
          className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-10 py-5 text-xl' : 'px-8 py-4 text-lg'
          }`}
        >
          <span>{isHindi ? 'आगे बढ़ें' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
