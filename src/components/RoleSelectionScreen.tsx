import React from 'react';
import {
  Plus,
  Sparkles,
  User,
  Stethoscope,
  ShieldCheck,
  PhoneCall,
  Activity,
  FileText,
  Mic,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface RoleSelectionScreenProps {
  onSelectRole: (role: 'patient' | 'doctor') => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white flex flex-col justify-between bg-slate-900">
      {/* Ambient Sage Watercolor Backdrop Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          alt="AyuMitra Healing Sage Backdrop"
          className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.02]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-JVvLDWJvG4cx2I3LU733ybGXI5Yc5mFQLx8WnwwEl3P0yXenc95E1XoxjgR-YT5097clNsBL8DsSJFJwJd-9In_9YgtGIDrBApDO9Xoe9qKUmsq28gaGtd3rZr6TWe3s4Li-CQKQ2qlLxikGGBtdAOeBVjvuDBoQEbAPhUhOKT3sorTHBFYk10liqT1hMDKqt0RbFfh2XP74ZVNAEosTCy82W8YnMI6sp-0Tv0dI5CrB_QFTwRnSmeVGEzPlwCX3Gg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#0b3b36]/25 backdrop-blur-[2px]" />
      </div>

      {/* Top Hospital Header (Glassmorphic) */}
      <header className="relative z-10 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-xl border-b border-white/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <img
            src="/ayumitra-logo.png"
            alt="AyuMitra Logo"
            className="w-11 h-11 object-contain drop-shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 font-sans tracking-tight">
                AyuMitra
              </h1>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider rounded-md uppercase border border-emerald-200/60">
                Hospital OPD Suite
              </span>
            </div>
            <p className="text-teal-900/80 text-xs font-medium">
              National Digital Health Mission (ABDM) Compliant Healthcare Kiosk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/90 text-slate-700 text-xs font-semibold shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ABDM Sandbox Facility #IND-9021</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-bold shadow-2xs">
            <PhoneCall className="w-3 h-3 text-rose-600 animate-pulse" />
            <span>Emergency 108</span>
          </div>
        </div>
      </header>

      {/* Main Role Selection Area (Floating Frosted Glass Shell) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-8 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="w-full frosted-glass-main rounded-[36px] shadow-2xl p-6 sm:p-10 border border-white/80 flex flex-col items-center">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-900 mb-4 shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Smart Clinical Intake & Automated Decision Support System</span>
          </div>

          {/* Central Logo */}
          <img
            src="/ayumitra-logo.png"
            alt="AyuMitra Official Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-3 drop-shadow-md hover:scale-105 transition-transform"
          />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-3 text-center">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-teal-800">AyuMitra</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium mb-8 text-center max-w-2xl leading-relaxed">
            Select your profile to enter the clinical case-taking and triage environment.
          </p>

          {/* Dual Symmetrical Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-4">
            {/* Patient Kiosk Card */}
            <div className="card-glass p-7 rounded-3xl flex flex-col justify-between group hover:border-emerald-500/80 hover:shadow-emerald-glow transition-all relative overflow-hidden bg-white/85">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/70 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

              <div>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Patient / Swasthya Kiosk
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md uppercase">
                    Self-Service
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Self-service voice-assisted case intake, symptom recording, and past prescription document scanning.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OmniVoice Multilingual AI Dialogue & Whisper STT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PaddleOCR Prescription & Report Scanner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant OPD Token & Clinical Triage Routing</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-select-patient-role"
                onClick={() => onSelectRole('patient')}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Enter Patient Kiosk</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Doctor Portal Card */}
            <div className="card-glass p-7 rounded-3xl flex flex-col justify-between group hover:border-teal-500/80 hover:shadow-emerald-glow transition-all relative overflow-hidden bg-white/85">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/70 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

              <div>
                <div className="w-14 h-14 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center mb-5 shadow-xs group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-7 h-7" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Physician / Vaidya Portal
                  </h3>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold rounded-md uppercase">
                    EMR & EHR
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Physician verification cockpit, automated case summaries, red flag alerts, and dual-system EHR integration.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Comprehensive AYUSH & Allopathic Case Summary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Automated Clinical Red Flag Rule Engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>One-Click EMR Verification & Token Calling</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-select-doctor-role"
                onClick={() => onSelectRole('doctor')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Enter Doctor Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-md border-t border-teal-900/10 py-3 px-4 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-slate-800">
            AyuMitra Case-Taking Suite • Ministry of Ayush & AIIA
          </span>
          <span>DPDP Act 2023 & ABDM Compliant Architecture</span>
        </div>
      </footer>
    </div>
  );
};
