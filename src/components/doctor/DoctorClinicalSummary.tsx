import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Info,
} from 'lucide-react';
import { QueuePatient } from '../../data/doctorMockData';

interface DoctorClinicalSummaryProps {
  isDark?: boolean;
  patient: QueuePatient;
  onOpenVoiceTranscript: () => void;
  onOpenVerifyModal: () => void;
  isVerified?: boolean;
}

/**
 * DoctorClinicalSummary renders the Stitch-Glassmorphism AI-Generated Clinical Synthesis (SOAP Note).
 * Includes Subjective, Objective (PaddleOCR & Vitals), Assessment (ICD-10/SNOMED & Ayurveda), and Plan.
 * Supports both Dark Emerald Glass (Stitch 4) & Light Sage Glass (Stitch 5).
 */
export const DoctorClinicalSummary: React.FC<DoctorClinicalSummaryProps> = ({
  isDark = false,
  patient,
  onOpenVoiceTranscript,
  onOpenVerifyModal,
  isVerified = false,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Protocol Notice Banner */}
      <div
        className={`rounded-2xl p-4 backdrop-blur-md border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark
            ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
            : 'bg-white/85 border-white/80 text-slate-800'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isDark
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-rose-100 text-rose-600 border border-rose-200'
            }`}
          >
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI-Generated Clinical Synthesis — For Doctor Verification Only
              </h2>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                  isDark
                    ? 'bg-emerald-500/25 border-emerald-400/30 text-emerald-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}
              >
                ABDM ISO-13485 Intake Protocol
              </span>
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-emerald-200/70' : 'text-slate-600'}`}>
              AI assists multilingual intake and does <strong className="text-rose-400 font-bold">NOT</strong> formulate final medical prescriptions. All structured findings must be clinically verified prior to patient intervention.
            </p>
          </div>
        </div>
        <div
          className={`text-[11px] font-mono font-medium whitespace-nowrap self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
            isDark
              ? 'bg-[#061a14]/80 border-emerald-500/20 text-emerald-300'
              : 'bg-slate-100/80 border-slate-200/60 text-slate-500'
          }`}
        >
          <span>Hash #{patient.id}-AI-SOAP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
        </div>
      </div>

      {/* Patient Identity Header Card */}
      <div
        className={`rounded-3xl p-6 backdrop-blur-md border shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
          isDark
            ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
            : 'bg-white/90 border-white/85 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-2xl p-0.5 shadow-md ${
                isDark
                  ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                  : 'bg-gradient-to-tr from-emerald-700 to-teal-500'
              }`}
            >
              <div
                className={`w-full h-full rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden ${
                  isDark ? 'bg-[#061a14] text-emerald-300' : 'bg-slate-100 text-emerald-950'
                }`}
              >
                {patient.initials}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center border-2 border-white text-[10px] shadow-xs">
              ✓
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {patient.name}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                  isDark
                    ? 'bg-emerald-950/60 border-emerald-500/25 text-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                UHID: {patient.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  patient.priority === 'High Priority'
                    ? isDark
                      ? 'bg-rose-500/25 border-rose-400/40 text-rose-300'
                      : 'bg-rose-100 text-rose-700 border-rose-200'
                    : isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : patient.priorityColor
                }`}
              >
                {patient.priority === 'High Priority' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                {patient.priority}
              </span>
            </div>
            <div className={`flex items-center gap-x-4 gap-y-1 text-xs mt-2 flex-wrap font-medium ${isDark ? 'text-emerald-200/80' : 'text-slate-600'}`}>
              <span>{patient.age} yrs</span>
              <span className="opacity-40">•</span>
              <span>{patient.gender === 'M' ? 'Male' : 'Female'}</span>
              <span className="opacity-40">•</span>
              <span className="font-bold text-rose-400">Blood Group: B+</span>
              <span className="opacity-40">•</span>
              <span>Spoken: <strong>{patient.language}</strong> (OmniVoice Transcribed)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-end lg:self-center">
          <button
            type="button"
            onClick={onOpenVoiceTranscript}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border shadow-2xs transition-all cursor-pointer ${
              isDark
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Voice Session (3m 12s)</span>
          </button>
          <button
            type="button"
            onClick={onOpenVerifyModal}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ${
              isVerified
                ? isDark
                  ? 'bg-emerald-800 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                  : 'bg-emerald-800 text-white'
                : isDark
                ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isVerified ? '✓ Verified & Signed' : 'Verify & Sign SOAP Note'}</span>
          </button>
        </div>
      </div>

      {/* Red Flags Alert Section (if High Priority) */}
      {patient.priority === 'High Priority' && (
        <section
          className={`rounded-2xl p-5 backdrop-blur-md border shadow-xs ${
            isDark
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              : 'bg-rose-50/90 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-rose-500/30 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className={`text-sm font-black uppercase tracking-wide ${isDark ? 'text-rose-100' : 'text-rose-900'}`}>
                Automated Clinical Red Flag Alert (Rule Engine v4.2)
              </h2>
            </div>
            <span className="text-[11px] font-bold bg-rose-500/25 border border-rose-400/40 text-rose-300 px-2.5 py-0.5 rounded-full self-start md:self-auto">
              Severity: High • Immediate Evaluation Recommended
            </span>
          </div>
          <div className="mt-3 text-xs leading-relaxed space-y-1">
            <p>
              • <strong>Ischemic Trigger Indicator:</strong> 2-day history of retrosternal discomfort radiating to left upper limb on minimal exertion.
            </p>
            <p>
              • <strong>Comorbid Risk Factor:</strong> Chronic uncontrolled hypertension (148/92 mmHg) combined with fasting hyperglycemia.
            </p>
          </div>
        </section>
      )}

      {/* 4 SOAP Modular Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjective (S) */}
        <div
          className={`rounded-3xl p-6 backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-emerald-100'
              : 'bg-white/90 border-white/85 text-slate-700'
          }`}
        >
          <div className={`flex items-center justify-between mb-3.5 border-b pb-2.5 ${isDark ? 'border-emerald-500/15' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-emerald-500/25 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                S
              </span>
              <span>Subjective (Patient Voice Intake)</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-emerald-500/25 border-emerald-400/30 text-emerald-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
              Whisper STT Verified
            </span>
          </div>
          <div className="text-xs space-y-2.5 leading-relaxed">
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Chief Complaint:</strong> {patient.chiefComplaint}
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>History of Present Illness (HPI):</strong> Patient presented with a 2-day progressive onset of retrosternal discomfort and exertional breathlessness.
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Ayurvedic Symptoms:</strong> Agnimandya (impaired digestion), Shwasa Kashta, Gaurava (heaviness in chest area).
            </p>
          </div>
        </div>

        {/* Objective (O) */}
        <div
          className={`rounded-3xl p-6 backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-emerald-100'
              : 'bg-white/90 border-white/85 text-slate-700'
          }`}
        >
          <div className={`flex items-center justify-between mb-3.5 border-b pb-2.5 ${isDark ? 'border-emerald-500/15' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-teal-500/25 text-teal-300' : 'bg-teal-100 text-teal-800'}`}>
                O
              </span>
              <span>Objective (PaddleOCR & Vitals)</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-teal-500/25 border-teal-400/30 text-teal-300' : 'bg-teal-50 text-teal-800 border-teal-200'}`}>
              OCR Digitized
            </span>
          </div>
          <div className="text-xs space-y-2.5 leading-relaxed">
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Current Vitals:</strong> BP 148/92 mmHg, Pulse 88 bpm regular, SpO2 97% on room air, RR 20/min.
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>OCR Extracted Lab Findings:</strong> Fasting Blood Sugar: 142 mg/dL [High], HbA1c: 7.2%, Serum Creatinine: 1.0 mg/dL.
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Active Prescriptions:</strong> Tab Metformin 500mg BD, Tab Telmisartan 40mg OD.
            </p>
          </div>
        </div>

        {/* Assessment (A) */}
        <div
          className={`rounded-3xl p-6 backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-emerald-100'
              : 'bg-white/90 border-white/85 text-slate-700'
          }`}
        >
          <div className={`flex items-center justify-between mb-3.5 border-b pb-2.5 ${isDark ? 'border-emerald-500/15' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-purple-500/25 text-purple-300' : 'bg-purple-100 text-purple-800'}`}>
                A
              </span>
              <span>Assessment (ICD-10 / Ayurveda Dosha)</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-purple-500/25 border-purple-400/30 text-purple-300' : 'bg-purple-50 text-purple-800 border-purple-200'}`}>
              Groq AI Mapped
            </span>
          </div>
          <div className="text-xs space-y-2 leading-relaxed">
            <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-purple-950/50 border-purple-500/30 text-purple-200' : 'bg-purple-50/70 border-purple-200 text-purple-950'}`}>
              <p className="font-bold">Modern Differential Diagnosis:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Acute Coronary Syndrome / Angina Pectoris (ICD-10: I20.9)</li>
                <li>Essential Hypertension, Stage 2 (ICD-10: I10)</li>
                <li>Type 2 Diabetes Mellitus (ICD-10: E11.65)</li>
              </ul>
            </div>
            <div className={`p-3 rounded-xl border space-y-1 ${isDark ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'}`}>
              <p className="font-bold">Ayurvedic Nidan / Dosha Assessment:</p>
              <p className="text-[11px]">
                Vata-Kapha Pradhana Hridroga Lakshana with Rasa Dhatu Dushti and Srotorodha.
              </p>
            </div>
          </div>
        </div>

        {/* Plan (P) */}
        <div
          className={`rounded-3xl p-6 backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-emerald-100'
              : 'bg-white/90 border-white/85 text-slate-700'
          }`}
        >
          <div className={`flex items-center justify-between mb-3.5 border-b pb-2.5 ${isDark ? 'border-emerald-500/15' : 'border-slate-100'}`}>
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-blue-500/25 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                P
              </span>
              <span>Plan & Clinical Protocol</span>
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isDark ? 'bg-blue-500/25 border-blue-400/30 text-blue-300' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
              Physician Sign-Off
            </span>
          </div>
          <div className="text-xs space-y-2.5 leading-relaxed">
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>1. Immediate Diagnostics:</strong> Stat 12-lead ECG, Serum Troponin-I, Lipid Profile.
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>2. Integrative Therapeutics:</strong> Tab Aspirin 300mg stat, Prabhakar Vati 250mg BD, Arjuna Ksheerapaka 50ml BD after meals.
            </p>
            <p>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>3. Lifestyle & Diet:</strong> Salt restricted diet, Avoid Vata-aggravating heavy cold meals, Yoga & Pranayama.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
