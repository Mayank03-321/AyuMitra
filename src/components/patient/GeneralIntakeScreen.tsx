import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode } from '../../types';
import { GENERAL_QUESTION_BANK } from '../../data/generalQuestions';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { ArrowRight, Check, Stethoscope, Info } from 'lucide-react';

interface GeneralIntakeScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onComplete: (answers: Record<string, string>) => void;
}

export const GeneralIntakeScreen: React.FC<GeneralIntakeScreenProps> = ({
  language,
  accessibilityMode,
  onComplete,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQ = GENERAL_QUESTION_BANK[currentIdx];

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleNext = () => {
    if (currentIdx < GENERAL_QUESTION_BANK.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const isAnswered = !!answers[currentQ.id];

  const termText = isHindi ? currentQ.termHi : currentQ.term;
  const descText = isHindi ? currentQ.descriptionHi : currentQ.description;
  const combinedAudioText = `${termText}. ${descText}`;

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Top Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Question {currentIdx + 1} of {GENERAL_QUESTION_BANK.length}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              General Medicine Intake
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'सामान्य डॉक्टर (एलोपैथी) के लिए आपकी स्थिति की विस्तृत जानकारी।'
              : 'Detailed assessment for General consultation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioVoiceButton
            text={combinedAudioText}
            language={language}
            label={isHindi ? 'प्रश्न सुनें' : 'Listen'}
            variant="secondary"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / GENERAL_QUESTION_BANK.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        
        {/* Term & Description */}
        <div className="mb-8">
          <h2
            className={`font-extrabold text-blue-900 mb-2 leading-snug flex items-center gap-2 ${
              isElderly ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            <span>{termText}</span>
          </h2>
          <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
            <p className={`font-medium ${isElderly ? 'text-xl' : 'text-lg'}`}>
              {descText}
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {currentQ.options.map((opt) => {
            const selected = answers[currentQ.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className={`flex items-start gap-3 p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  selected
                    ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10'
                    : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {selected && <Check className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <span className={`font-semibold block ${isElderly ? 'text-xl text-slate-900' : 'text-base text-slate-800'}`}>
                    {isHindi ? opt.labelHi : opt.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIdx === 0}
          className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isHindi ? 'पिछला' : 'Back'}
        </button>

        <button
          type="button"
          disabled={!isAnswered}
          onClick={handleNext}
          className={`inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
          }`}
        >
          <span>
            {isHindi
              ? currentIdx === GENERAL_QUESTION_BANK.length - 1
                ? 'पूरा करें'
                : 'अगला'
              : currentIdx === GENERAL_QUESTION_BANK.length - 1
              ? 'Finish'
              : 'Next'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
