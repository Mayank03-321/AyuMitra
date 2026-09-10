import React from 'react';
import { MedicalTimelineEvent, LanguageCode, AccessibilityMode } from '../../types';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Calendar, ArrowRight } from 'lucide-react';

interface TimelineScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  timeline: MedicalTimelineEvent[];
  onContinue: () => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  language,
  accessibilityMode,
  timeline,
  onContinue,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';

  const audioGuide = isHindi
    ? 'यह आपकी पुरानी बीमारियों और जांचों का कालक्रम (टाइमलाइन) है, जो आपकी पर्चियों और बातचीत से तैयार किया गया है।'
    : 'This is your chronological medical timeline automatically structured from your statements and scanned records.';

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Title */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`font-bold text-slate-900 ${isElderly ? 'text-3xl' : 'text-2xl'}`}>
            {isHindi ? 'आपका मेडिकल टाइमलाइन' : 'Chronological Medical Timeline'}
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            {isHindi
              ? 'आपकी पूर्व बीमारियों, पर्चियों व लैब जांचों का ऐतिहासिक क्रम।'
              : 'Chronologically synthesized from your voice history and physical documents.'}
          </p>
        </div>

        <AudioVoiceButton
          text={audioGuide}
          language={language}
          label={isHindi ? 'निर्देश सुनें' : 'Listen'}
          variant="secondary"
        />
      </div>

      {/* Vertical Timeline Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        <div className="relative border-l-2 border-emerald-200 ml-4 pl-6 space-y-6">
          {timeline.map((event, idx) => {
            const isLatest = idx === timeline.length - 1;
            return (
              <div key={event.eventId} className="relative group">
                {/* Dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow-xs ${
                    isLatest ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-emerald-600'
                  }`}
                />

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.date}</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isLatest
                          ? 'bg-amber-100 text-amber-900 font-extrabold'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{event.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {event.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <ConfidenceBadge source={event.source} showConfidence={true} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-end">
        <button
          id="btn-confirm-timeline"
          type="button"
          onClick={onContinue}
          className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
            isElderly ? 'px-8 py-4 text-xl' : 'px-6 py-3 text-base'
          }`}
        >
          <span>
            {isHindi ? 'अंतिम समीक्षा करें' : 'Proceed to Final Review'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
