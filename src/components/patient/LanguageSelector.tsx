import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../data/initialData';
import { LanguageCode, AccessibilityMode } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { Check, ArrowRight } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onConfirm: () => void;
  accessibilityMode: AccessibilityMode;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onConfirm,
  accessibilityMode,
}) => {
  const isElderly = accessibilityMode === 'elderly';
  const isHindi = selectedLanguage === 'hi';

  const audioPrompt = isHindi
    ? 'कृपया अपनी पसंदीदा भाषा चुनें जिसमें आप डॉक्टर से बातचीत करना चाहते हैं।'
    : 'Please choose your preferred language for this medical intake interview.';

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'अपनी भाषा चुनें' : 'Select Your Preferred Language'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi 
              ? 'वह भाषा चुनें जिसमें आप बोलने और पढ़ने में सबसे सहज महसूस करते हैं।' 
              : 'Choose the language in which you feel most comfortable speaking and reading.'}
          </p>
        </div>

        <AudioVoiceButton
          text={audioPrompt}
          language={selectedLanguage}
          label={isHindi ? 'ऑडियो गाइड' : 'Audio Guide'}
          variant="secondary"
        />
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              id={`lang-btn-${lang.code}`}
              type="button"
              onClick={() => onSelectLanguage(lang.code)}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left cursor-pointer active:scale-98 ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/80 shadow-md shadow-emerald-600/10 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              } ${isElderly ? 'py-6 px-5' : 'py-5 px-5'}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <div
                    className={`font-bold text-slate-900 ${
                      isElderly ? 'text-3xl' : 'text-xl'
                    }`}
                  >
                    {lang.nativeName}
                  </div>
                  <div className={`text-slate-500 font-medium ${isElderly ? 'text-base' : 'text-sm mt-0.5'}`}>{lang.name}</div>
                </div>
              </div>

              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          id="btn-confirm-language"
          type="button"
          onClick={onConfirm}
          className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
          }`}
        >
          <span>{isHindi ? 'आगे बढ़ें' : 'Confirm & Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
