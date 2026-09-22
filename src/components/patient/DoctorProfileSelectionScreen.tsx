import React, { useState } from 'react';
import { LanguageCode, AccessibilityMode, DoctorProfile } from '../../types';
import { AYUSH_DOCTORS, GENERAL_DOCTORS } from '../../data/doctorsData';
import { AudioVoiceButton } from '../common/AudioVoiceButton';
import {
  Leaf,
  Stethoscope,
  Check,
  Star,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
} from 'lucide-react';

interface DoctorProfileSelectionScreenProps {
  language: LanguageCode;
  accessibilityMode: AccessibilityMode;
  doctorCategory: 'ayush' | 'general';
  selectedDoctor?: DoctorProfile | null;
  onSelectDoctor: (doctor: DoctorProfile) => void;
  onContinue: () => void;
}

/**
 * DoctorProfileSelectionScreen Component
 * Presents 4 distinct doctors tailored to the patient's choice (Ayurvedic for AYUSH, MBBS for General).
 */
export const DoctorProfileSelectionScreen: React.FC<DoctorProfileSelectionScreenProps> = ({
  language,
  accessibilityMode,
  doctorCategory,
  selectedDoctor,
  onSelectDoctor,
  onContinue,
}) => {
  const isHindi = language === 'hi';
  const isElderly = accessibilityMode === 'elderly';
  const isAyush = doctorCategory === 'ayush';

  const doctorsList = isAyush ? AYUSH_DOCTORS : GENERAL_DOCTORS;
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    selectedDoctor?.id || doctorsList[0].id
  );

  const activeDoc = doctorsList.find((d) => d.id === currentSelectedId) || doctorsList[0];

  const handleCardClick = (doc: DoctorProfile) => {
    setCurrentSelectedId(doc.id);
    onSelectDoctor(doc);
  };

  const handleProceed = () => {
    onSelectDoctor(activeDoc);
    onContinue();
  };

  const titleText = isHindi
    ? isAyush
      ? 'आयुर्वेदिक विशेषज्ञ चिकित्सक का चयन करें'
      : 'एलोपैथिक चिकित्सक (MBBS/MD) का चयन करें'
    : isAyush
    ? 'Choose Your Ayurvedic Specialist'
    : 'Choose Your General Physician (MBBS)';

  const subtitleText = isHindi
    ? isAyush
      ? 'कृपया ओपीडी में परामर्श के लिए उपलब्ध 4 अनुभवी आयुर्वेद चिकित्सकों में से एक को चुनें।'
      : 'कृपया ओपीडी में परामर्श के लिए उपलब्ध 4 अनुभवी एलोपैथी (MBBS/MD) चिकित्सकों में से एक को चुनें।'
    : isAyush
    ? 'Select from 4 board-certified Ayurvedic & Panchakarma specialists on duty today.'
    : 'Select from 4 board-certified MBBS & Internal Medicine physicians on duty today.';

  const guideVoiceText = `${titleText}. ${subtitleText}`;

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 lg:px-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                isAyush ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isAyush ? <Leaf className="w-3.5 h-3.5" /> : <Stethoscope className="w-3.5 h-3.5" />}
              <span>{isAyush ? (isHindi ? 'आयुष ओपीडी' : 'AYUSH OPD Wing') : (isHindi ? 'जनरल मेडिसिन ओपीडी' : 'General Medicine Wing')}</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {doctorsList.length} {isHindi ? 'डॉक्टर उपलब्ध' : 'Specialists Available'}
            </span>
          </div>

          <h2 className={`font-extrabold text-slate-900 tracking-tight ${isElderly ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            {titleText}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            {subtitleText}
          </p>
        </div>

        <AudioVoiceButton
          text={guideVoiceText}
          language={language}
          label={isHindi ? 'निर्देश सुनें' : 'Listen'}
          variant="secondary"
          className="shrink-0"
        />
      </div>

      {/* 4 Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {doctorsList.map((doc) => {
          const isSelected = doc.id === currentSelectedId;
          return (
            <div
              key={doc.id}
              onClick={() => handleCardClick(doc)}
              className={`group relative rounded-3xl border-2 p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isAyush
                    ? 'border-emerald-600 bg-emerald-50/40 ring-4 ring-emerald-600/15 shadow-md'
                    : 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-600/15 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Header Row: Doctor Info & Checkmark */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 shadow-inner flex items-center justify-center ${
                        isSelected
                          ? isAyush ? 'border-emerald-500 bg-emerald-100' : 'border-blue-500 bg-blue-100'
                          : 'border-slate-200 bg-slate-100'
                      }`}>
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback icon if image fails
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        {isAyush ? (
                          <Leaf className="w-7 h-7 text-emerald-700 absolute" />
                        ) : (
                          <Stethoscope className="w-7 h-7 text-blue-700 absolute" />
                        )}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className={`font-black text-slate-900 ${isElderly ? 'text-xl' : 'text-base sm:text-lg'}`}>
                          {isHindi ? doc.nameHi : doc.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAyush ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isHindi ? doc.badgeHi : doc.badge}
                        </span>
                      </div>
                      <p className={`font-semibold text-xs mb-1 ${isAyush ? 'text-emerald-800' : 'text-blue-800'}`}>
                        {isHindi ? doc.titleHi : doc.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Radio Check Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isSelected
                        ? isAyush
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                  {isHindi ? doc.bioHi : doc.bio}
                </p>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200/80 mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{isHindi ? doc.availableDaysHi : doc.availableDays}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Queue & Rating Row */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span className={doc.currentQueue === 0 ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                    {doc.currentQueue === 0
                      ? isHindi ? 'अभी उपलब्ध (No Queue)' : 'Available Now (No Queue)'
                      : `${doc.currentQueue} ${isHindi ? 'मरीज प्रतीक्षा में' : 'Patients in queue'}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doc.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({doc.reviewCount})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Continue Bottom Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isAyush ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHindi ? 'चयनित चिकित्सक:' : 'Selected Consulting Physician:'}
            </span>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
              {isHindi ? activeDoc.nameHi : activeDoc.name} • <span className="font-semibold text-slate-600 text-xs">{activeDoc.roomNumber}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-confirm-doctor"
          onClick={handleProceed}
          className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
            isAyush ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <span>{isHindi ? 'डॉक्टर का चयन कर आगे बढ़ें' : 'Confirm Doctor & Proceed'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
