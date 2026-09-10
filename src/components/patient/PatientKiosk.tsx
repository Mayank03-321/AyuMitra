import React, { useState } from 'react';
import {
  Patient,
  LanguageCode,
  AccessibilityMode,
  ConsentRecord,
  SymptomEntity,
  MedicalDocument,
  MedicalTimelineEvent,
} from '../../types';
import { DEMO_PATIENT, DEMO_TIMELINE } from '../../data/initialData';
import { WelcomeScreen } from './WelcomeScreen';
import { LanguageSelector } from './LanguageSelector';
import { IdentificationScreen } from './IdentificationScreen';
import { ConsentScreen } from './ConsentScreen';
import { ChiefComplaintScreen } from './ChiefComplaintScreen';
import { AdaptiveQuestionsScreen } from './AdaptiveQuestionsScreen';
import { DocumentScanScreen } from './DocumentScanScreen';
import { TimelineScreen } from './TimelineScreen';
import { PatientReviewScreen } from './PatientReviewScreen';
import { CompletionScreen } from './CompletionScreen';
import { DoctorSelectionScreen } from './DoctorSelectionScreen';
import { AyushIntakeScreen } from './AyushIntakeScreen';
import { GeneralIntakeScreen } from './GeneralIntakeScreen';
import { ChevronLeft, Home, HelpCircle } from 'lucide-react';

export type KioskStep =
  | 'WELCOME'
  | 'LANGUAGE'
  | 'IDENTIFICATION'
  | 'CONSENT'
  | 'CHIEF_COMPLAINT'
  | 'ADAPTIVE_QUESTIONS'
  | 'DOCTOR_SELECTION'
  | 'AYUSH_INTAKE'
  | 'GENERAL_INTAKE'
  | 'DOCUMENTS'
  | 'TIMELINE'
  | 'REVIEW'
  | 'COMPLETE'
  | 'COMING_SOON';

interface PatientKioskProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  accessibilityMode: AccessibilityMode;
  onChangeAccessibility: (mode: AccessibilityMode) => void;
  onSessionComplete?: (data: any) => void;
}

export const PatientKiosk: React.FC<PatientKioskProps> = ({
  language,
  onChangeLanguage,
  accessibilityMode,
  onChangeAccessibility,
  onSessionComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<KioskStep>('WELCOME');
  const [patient, setPatient] = useState<Patient>(DEMO_PATIENT);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [transcript, setTranscript] = useState(
    language === 'hi'
      ? 'मुझे दो दिन से सीने में दर्द हो रहा है और सांस लेने में तकलीफ है।'
      : 'I have been experiencing chest discomfort and breathlessness for 2 days.'
  );
  const [symptoms, setSymptoms] = useState<SymptomEntity[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any>>({});
  const [ayushAnswers, setAyushAnswers] = useState<Record<string, string>>({});
  const [generalAnswers, setGeneralAnswers] = useState<Record<string, string>>({});
  const [doctorPreference, setDoctorPreference] = useState<'ayush' | 'general' | null>(null);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [timeline, setTimeline] = useState<MedicalTimelineEvent[]>(DEMO_TIMELINE);

  const stepsList: KioskStep[] = [
    'WELCOME',
    'LANGUAGE',
    'IDENTIFICATION',
    'CONSENT',
    'CHIEF_COMPLAINT',
    'ADAPTIVE_QUESTIONS',
    'DOCTOR_SELECTION',
    ...(doctorPreference === 'ayush' ? ['AYUSH_INTAKE' as KioskStep] : []),
    ...(doctorPreference === 'general' ? ['GENERAL_INTAKE' as KioskStep] : []),
    'DOCUMENTS',
    'TIMELINE',
    'REVIEW',
    'COMPLETE',
  ];

  const currentStepIdx = stepsList.indexOf(currentStep);

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStep(stepsList[currentStepIdx - 1]);
    }
  };

  const handleResetKiosk = () => {
    setCurrentStep('WELCOME');
  };

  return (
    <div className="w-full">
      {/* Top Kiosk Breadcrumb / Status Header */}
      {currentStep !== 'WELCOME' && currentStep !== 'COMPLETE' && currentStep !== 'COMING_SOON' && (
        <div className="bg-white border-b border-slate-200 sticky top-[57px] z-30 shadow-sm">
          <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="button"
                onClick={handleResetKiosk}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                title="Return to Welcome Screen"
              >
                <Home className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Step {currentStepIdx} of {stepsList.length - 2}: {currentStep.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Patient: <strong className="text-slate-900">{patient.name}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Screen Render Switch */}
      <div>
        {currentStep === 'WELCOME' && (
          <WelcomeScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onSetAccessibility={onChangeAccessibility}
            onStart={() => setCurrentStep('LANGUAGE')}
          />
        )}

        {currentStep === 'LANGUAGE' && (
          <LanguageSelector
            selectedLanguage={language}
            onSelectLanguage={onChangeLanguage}
            accessibilityMode={accessibilityMode}
            onConfirm={() => setCurrentStep('IDENTIFICATION')}
          />
        )}

        {currentStep === 'IDENTIFICATION' && (
          <IdentificationScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onIdentify={(p) => {
              setPatient(p);
              setCurrentStep('CONSENT');
            }}
          />
        )}

        {currentStep === 'CONSENT' && (
          <ConsentScreen
            language={language}
            accessibilityMode={accessibilityMode}
            patientName={patient.name}
            onGrantConsent={(c) => {
              setConsent(c);
              setCurrentStep('CHIEF_COMPLAINT');
            }}
          />
        )}

        {currentStep === 'CHIEF_COMPLAINT' && (
          <ChiefComplaintScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onContinue={(trans, extracted) => {
              setTranscript(trans);
              setSymptoms(extracted);
              setCurrentStep('ADAPTIVE_QUESTIONS');
            }}
            onProceedToOcr={(trans, extracted) => {
              setTranscript(trans);
              setSymptoms(extracted);
              setCurrentStep('DOCUMENTS');
            }}
          />
        )}

        {currentStep === 'ADAPTIVE_QUESTIONS' && (
          <AdaptiveQuestionsScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onComplete={(ans) => {
              setQuestionAnswers(ans);
              setCurrentStep('DOCTOR_SELECTION');
            }}
          />
        )}

        {currentStep === 'DOCTOR_SELECTION' && (
          <DoctorSelectionScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onComplete={(choice) => {
              setDoctorPreference(choice);
              if (choice === 'ayush') {
                setCurrentStep('AYUSH_INTAKE');
              } else {
                setCurrentStep('GENERAL_INTAKE');
              }
            }}
          />
        )}

        {currentStep === 'AYUSH_INTAKE' && (
          <AyushIntakeScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onComplete={(ans) => {
              setAyushAnswers(ans);
              setCurrentStep('DOCUMENTS');
            }}
          />
        )}

        {currentStep === 'GENERAL_INTAKE' && (
          <GeneralIntakeScreen
            language={language}
            accessibilityMode={accessibilityMode}
            onComplete={(ans) => {
              setGeneralAnswers(ans);
              setCurrentStep('DOCUMENTS');
            }}
          />
        )}

        {currentStep === 'DOCUMENTS' && (
          <DocumentScanScreen
            language={language}
            accessibilityMode={accessibilityMode}
            documents={documents}
            onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
            onContinue={() => setCurrentStep('TIMELINE')}
          />
        )}

        {currentStep === 'TIMELINE' && (
          <TimelineScreen
            language={language}
            accessibilityMode={accessibilityMode}
            timeline={timeline}
            onContinue={() => setCurrentStep('REVIEW')}
          />
        )}

        {currentStep === 'REVIEW' && (
          <PatientReviewScreen
            language={language}
            accessibilityMode={accessibilityMode}
            patientName={patient.name}
            transcript={transcript}
            documents={documents}
            onSubmit={() => {
              setCurrentStep('COMPLETE');
              if (onSessionComplete) {
                onSessionComplete({ patient, transcript, documents, timeline });
              }
            }}
          />
        )}

        {currentStep === 'COMPLETE' && (
          <CompletionScreen
            language={language}
            accessibilityMode={accessibilityMode}
            patientName={patient.name}
            onReset={handleResetKiosk}
          />
        )}

        {currentStep === 'COMING_SOON' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              {language === 'hi' 
                ? 'वॉइस आधारित एआई असिस्टेंट अभी निर्माणधीन है। कृपया वापस जाएं और "टच से शुरू करें" विकल्प का उपयोग करें।'
                : 'The full Voice AI Assistant workflow is currently under construction. Please go back and use the "Touch Intake" option.'}
            </p>
            <button
              onClick={() => setCurrentStep('CHIEF_COMPLAINT')}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
