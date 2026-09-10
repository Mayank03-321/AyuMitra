import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode } from '../../types';
import { QUESTION_BANK } from '../../data/initialData';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { Check, ArrowRight } from 'lucide-react';

interface AdaptiveQuestionsScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  onComplete: (answers: Record<string, any>) => void;
}

export const AdaptiveQuestionsScreen: React.FC<AdaptiveQuestionsScreenProps> = ({
  language,
  accessibilityMode,
  onComplete,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q_soc_site: 'site_center_chest',
    q_soc_onset: 'dur_2days',
    q_soc_radiation: 'rad_left_arm',
    q_pmh_diabetes: ['pmh_t2d', 'pmh_htn'],
    q_general_appetite: 'agni_manda',
    q_general_sleep: 'koshtha_krura',
  });

  const activeQuestions = QUESTION_BANK;
  const currentQ = activeQuestions[currentIdx] || activeQuestions[0];

  const handleSelectOption = (qId: string, optId: string, isMulti?: boolean) => {
    if (isMulti) {
      const currentArr: string[] = answers[qId] || [];
      const updated = currentArr.includes(optId)
        ? currentArr.filter((id) => id !== optId)
        : [...currentArr, optId];
      setAnswers({ ...answers, [qId]: updated });
    } else {
      setAnswers({ ...answers, [qId]: optId });
    }
  };

  const handleNext = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const isSelected = (qId: string, optId: string) => {
    const val = answers[qId];
    if (Array.isArray(val)) return val.includes(optId);
    return val === optId;
  };

  const questionText = isHindi ? currentQ.textHi : currentQ.text;

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Top Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Question {currentIdx + 1} of {activeQuestions.length}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'डॉक्टर साहब के लिए आपकी स्थिति की सूक्ष्म जानकारी संकलित की जा रही है।'
              : 'Adaptive clinical branching following standard guidelines.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioVoiceButton
            text={questionText}
            language={language}
            label={isHindi ? 'प्रश्न सुनें' : 'Listen'}
            variant="secondary"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-6">
        <div
          className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        <h2
          className={`font-extrabold text-slate-900 mb-6 leading-snug ${
            isElderly ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {questionText}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options?.map((opt) => {
            const selected = isSelected(currentQ.id, opt.id);
            const isMulti = currentQ.answerType === 'multi_choice';
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.id, isMulti)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left cursor-pointer active:scale-98 ${
                  selected
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                } ${isElderly ? 'py-5' : 'py-4'}`}
              >
                <div>
                  <div className={`font-bold ${isElderly ? 'text-xl' : 'text-base'}`}>
                    {isHindi && opt.labelHi ? opt.labelHi : opt.label}
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    selected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isHindi ? 'पिछला' : 'Previous'}
        </button>

        <button
          id="btn-next-question"
          type="button"
          onClick={handleNext}
          className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
          }`}
        >
          <span>
            {currentIdx === activeQuestions.length - 1
              ? isHindi
                ? 'दस्तावेज स्कैन पर जाएं'
                : 'Proceed to Next Step'
              : isHindi
              ? 'अगला प्रश्न'
              : 'Next Question'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
