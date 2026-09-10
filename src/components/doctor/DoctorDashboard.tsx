import React, { useState, useEffect } from 'react';
import {
  Search,
  LogOut,
  LayoutDashboard,
  Users,
  FileText,
  Mic,
  FolderOpen,
  Pill,
  Languages,
  UserCheck,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Stethoscope,
  Sun,
  Moon,
} from 'lucide-react';
import { MOCK_QUEUE, MOCK_ALERTS } from '../../data/doctorMockData';
import { DoctorOverviewDashboard } from './DoctorOverviewDashboard';
import { DoctorClinicalSummary } from './DoctorClinicalSummary';
import { DoctorVoiceTranscript } from './DoctorVoiceTranscript';

interface DoctorDashboardProps {
  onLogout: () => void;
}

/**
 * DoctorDashboard renders the floating rounded glassmorphic workstation shell
 * with Dark / Light Theme Toggle matching Stitch Compositor 4 (Dark Emerald Glass) & 5 (Light Sage Glass).
 */
export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [currentTab, setCurrentTab] = useState<string>('Dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('MK-8492');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'ready' | 'transcribing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isDark = theme === 'dark';

  const currentPatient = MOCK_QUEUE.find((p) => p.id === selectedPatientId) || MOCK_QUEUE[0];

  const filteredQueue = MOCK_QUEUE.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'high') return p.priority === 'High Priority';
    if (activeFilter === 'ready') return p.status.includes('Ready');
    if (activeFilter === 'transcribing') return p.status === 'Transcribing';
    if (activeFilter === 'completed') return p.status === 'Completed';
    return true;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 antialiased relative p-3 sm:p-5 md:p-8 flex items-center justify-center font-sans ${
        isDark
          ? 'bg-[#041510] text-emerald-100 selection:bg-emerald-500/30 selection:text-emerald-200'
          : 'bg-neutral-100 text-slate-800 selection:bg-teal-100 selection:text-teal-900'
      }`}
    >
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          alt="Sage watercolor organic background"
          className={`w-full h-full object-cover object-center filter ${
            isDark ? 'brightness-[0.85] contrast-[1.1]' : 'brightness-[1.02] contrast-[0.98]'
          }`}
          src={
            isDark
              ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGTB_wxGzxZvv3kaUZ07OJdoDY4ej_2O9cfuNqkgOj1OQPFn6rAIrmyVS09HqVzMTStfeBapdCYqhThsgHjyj0X57sNu0JIaKNlWfeFyCHHajcH0WK7hXFkSF3vssggOMX7JO_lSV7oN3G30MGWQ4mKPJdxy_YY61fgqodzC75ixlSpKpzoX4SDDswJgNv_CfrXxJjZnZmNV5fO_4VsrEnh38JdbdQTyCdeV5kZJeUdCEhz3jJyf3Tbf8H403EYBz6NA'
              : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsd8SsDvR9JQaI1qsyxIwLFxFot9TC8Cc5DS7cSK45ulcdAJPV_nyc6Dak--CRR0dyy5934Pvjo21vEKJ75J-XiSDWrP-CufA37-o5sa-CxQ_w5UFPcyPMcGvuXjQ6faON6RL6xm3CyHKkaHt5KyBsSDD5fjn-rU3l1IOB1ufH3zXhXI_xGjzLUMsuc4Ahl9KFJLBxBXZOr8Ki8R_EyJzHRwbuYMghBxMAHSjj6vskvg6UnvYNR_mWTruZNGHtkzKaMg'
          }
        />
        <div
          className={`absolute inset-0 backdrop-blur-[2px] ${
            isDark
              ? 'bg-[#041510]/60'
              : 'bg-gradient-to-tr from-teal-900/10 via-transparent to-white/40'
          }`}
        />
      </div>

      {/* Main Outer Floating Glassmorphic Shell */}
      <div
        className={`relative z-10 w-full max-w-[1540px] rounded-[36px] transition-all duration-300 p-3 sm:p-5 lg:p-7 my-auto ${
          isDark
            ? 'bg-[#061a14]/85 backdrop-blur-2xl border border-emerald-400/22 shadow-[0_30px_70px_-15px_rgba(2,14,10,0.7)]'
            : 'bg-white/75 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(15,45,40,0.18)]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-3 xl:col-span-2 flex flex-col justify-between space-y-6 pt-1">
            <div className="space-y-6">
              {/* Logo Brand */}
              <div className="flex items-center space-x-3 px-2">
                <div
                  className={`w-9 h-9 rounded-xl p-0.5 flex items-center justify-center ${
                    isDark
                      ? 'bg-white/95 shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                      : 'bg-teal-800 text-white shadow-xs'
                  }`}
                >
                  <img
                    src="/ayumitra-logo.png"
                    alt="AyuMitra Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`font-extrabold text-lg tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      AyuMitra
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDark
                          ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]'
                          : 'bg-teal-500 animate-pulse'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-[10px] font-semibold tracking-wider uppercase ${
                      isDark ? 'text-emerald-300/60' : 'text-slate-400'
                    }`}
                  >
                    AI Multilingual Intake
                  </p>
                </div>
              </div>

              {/* Main Navigation Links */}
              <nav className="space-y-1.5 text-[13px] font-medium">
                <NavItem isDark={isDark} icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={currentTab === 'Dashboard'} onClick={() => setCurrentTab('Dashboard')} />
                <NavItem isDark={isDark} icon={<Users className="w-4 h-4" />} label="Patient Queue" active={currentTab === 'Patient Queue'} onClick={() => setCurrentTab('Dashboard')} badge="38" />
                <NavItem isDark={isDark} icon={<FileText className="w-4 h-4" />} label="AI Clinical Summary" active={currentTab === 'AI Clinical Summary'} onClick={() => setCurrentTab('AI Clinical Summary')} badge="AI" />
                <NavItem isDark={isDark} icon={<Mic className="w-4 h-4" />} label="AI Voice Transcript" active={currentTab === 'AI Voice Transcript'} onClick={() => setCurrentTab('AI Voice Transcript')} />
                <NavItem isDark={isDark} icon={<FolderOpen className="w-4 h-4" />} label="Medical Records & OCR" active={currentTab === 'Medical Records & OCR'} onClick={() => setCurrentTab('Medical Records & OCR')} />
                <NavItem isDark={isDark} icon={<Pill className="w-4 h-4" />} label="Medications & History" active={currentTab === 'Medications & History'} onClick={() => setCurrentTab('Medications & History')} />
                <NavItem isDark={isDark} icon={<Languages className="w-4 h-4" />} label="Multilingual Intake" active={currentTab === 'Multilingual Intake'} onClick={() => setCurrentTab('Multilingual Intake')} />
                <NavItem isDark={isDark} icon={<UserCheck className="w-4 h-4" />} label="Doctor Verification" active={currentTab === 'Doctor Verification'} onClick={() => setCurrentTab('AI Clinical Summary')} badge={isVerified ? '✓' : '!'} />
                <NavItem isDark={isDark} icon={<AlertTriangle className="w-4 h-4" />} label="Priority Red Flags" active={currentTab === 'Priority Cases'} onClick={() => { setActiveFilter('high'); setCurrentTab('Dashboard'); }} badge="5" alert />
                <NavItem isDark={isDark} icon={<BarChart3 className="w-4 h-4" />} label="Analytics & OPD Stats" active={currentTab === 'Analytics & Reports'} onClick={() => setCurrentTab('Analytics & Reports')} />
              </nav>
            </div>

            {/* Bottom Hardware Status Card */}
            <div
              className={`rounded-2xl p-3.5 border shadow-sm text-xs ${
                isDark
                  ? 'bg-[#081e17]/80 backdrop-blur-md border-emerald-500/20 text-emerald-200/80'
                  : 'bg-white/80 backdrop-blur-md border-white/70 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isDark
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse'
                      : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                <span className={`font-bold text-[11px] ${isDark ? 'text-emerald-100' : 'text-slate-800'}`}>
                  ABDM & PaddleOCR Live
                </span>
              </div>
              <p className={`text-[10px] ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                All India Institute of Ayurveda OPD
              </p>
            </div>
          </aside>

          {/* Right Main Content Column */}
          <main className="lg:col-span-9 xl:col-span-10 flex flex-col space-y-5 lg:space-y-6 min-w-0">
            {/* Top Transparent Glass Header Bar */}
            <header
              className={`rounded-2xl backdrop-blur-md border shadow-sm px-4 py-3 flex items-center justify-between flex-wrap gap-3 ${
                isDark
                  ? 'bg-[#09241c]/75 border-emerald-400/20'
                  : 'bg-white/80 border-white/70'
              }`}
            >
              <div className="flex-1 flex items-center max-w-lg min-w-[200px]">
                <div className="relative w-full">
                  <Search
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-emerald-400/70' : 'text-slate-400'
                    }`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient by name, UHID, chief complaint..."
                    className={`w-full pl-9 pr-4 py-2 rounded-full text-xs font-medium outline-hidden transition-all ${
                      isDark
                        ? 'bg-[#061a14]/80 border border-emerald-500/25 text-white placeholder-emerald-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                        : 'bg-white/70 border border-slate-200/80 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Dark / Light Theme Toggle Button */}
                <button
                  type="button"
                  id="btn-toggle-theme"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                    isDark
                      ? 'bg-emerald-950/70 border-emerald-400/30 text-emerald-200 hover:bg-emerald-900/80 hover:text-white'
                      : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>

                <div
                  className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-2xs ${
                    isDark
                      ? 'bg-emerald-950/70 border-emerald-400/30 text-emerald-300'
                      : 'bg-teal-50/90 border-teal-200 text-teal-900'
                  }`}
                >
                  <span>Ward 4-B • General Medicine</span>
                </div>

                <button
                  type="button"
                  onClick={() => { setActiveFilter('high'); setCurrentTab('Dashboard'); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs border ${
                    isDark
                      ? 'bg-rose-950/70 border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                  <span>5 Red Flags</span>
                </button>

                <div className={`w-px h-5 mx-0.5 ${isDark ? 'bg-emerald-500/20' : 'bg-slate-200'}`} />

                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                      isDark
                        ? 'bg-emerald-400 text-emerald-950 font-extrabold shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : 'bg-teal-800 text-white border border-teal-600'
                    }`}
                  >
                    AS
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Dr. Ananya Sharma
                    </p>
                    <p className={`text-[10px] font-medium ${isDark ? 'text-emerald-300/70' : 'text-slate-500'}`}>
                      MD, Senior Physician
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className={`p-2 rounded-xl transition-all cursor-pointer ml-1 ${
                    isDark
                      ? 'text-emerald-300/70 hover:text-rose-400 hover:bg-rose-950/40'
                      : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  title="Logout from Workstation"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Dynamic View Switcher */}
            <div>
              {currentTab === 'Dashboard' && (
                <DoctorOverviewDashboard
                  isDark={isDark}
                  queue={filteredQueue}
                  selectedPatientId={selectedPatientId}
                  onSelectPatient={(id) => setSelectedPatientId(id)}
                  onOpenSummary={(id) => {
                    setSelectedPatientId(id);
                    setCurrentTab('AI Clinical Summary');
                  }}
                  activeFilter={activeFilter}
                  onChangeFilter={setActiveFilter}
                  alerts={MOCK_ALERTS}
                />
              )}

              {currentTab === 'AI Clinical Summary' && (
                <DoctorClinicalSummary
                  isDark={isDark}
                  patient={currentPatient}
                  onOpenVoiceTranscript={() => setCurrentTab('AI Voice Transcript')}
                  onOpenVerifyModal={() => setShowVerificationModal(true)}
                  isVerified={isVerified}
                />
              )}

              {currentTab === 'AI Voice Transcript' && (
                <DoctorVoiceTranscript
                  isDark={isDark}
                  patient={currentPatient}
                  onOpenSummary={() => setCurrentTab('AI Clinical Summary')}
                />
              )}

              {currentTab !== 'Dashboard' &&
                currentTab !== 'AI Clinical Summary' &&
                currentTab !== 'AI Voice Transcript' && (
                  <div
                    className={`rounded-3xl p-8 text-center max-w-4xl mx-auto backdrop-blur-md border shadow-sm ${
                      isDark
                        ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
                        : 'bg-white/80 border-white/70 text-slate-800'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      <Stethoscope className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold mb-1">{currentTab}</h3>
                    <p className={`text-xs mb-6 max-w-md mx-auto ${isDark ? 'text-emerald-200/70' : 'text-slate-600'}`}>
                      Synchronized with National Digital Health Mission (ABDM) and Groq Clinical AI.
                    </p>
                    <div
                      className={`p-4 rounded-2xl border text-xs text-left space-y-2 max-w-lg mx-auto ${
                        isDark
                          ? 'bg-[#061a14]/70 border-emerald-500/20 text-emerald-100'
                          : 'bg-white/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold">Active Patient:</span>
                        <span>{currentPatient.name} ({currentPatient.id})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Spoken Language:</span>
                        <span>{currentPatient.language} (Whisper Ingestion)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">OCR Ingestion:</span>
                        <span>PaddleOCR Multilingual Pipeline Verified</span>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentTab('Dashboard')}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-emerald-950/40"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </main>
        </div>
      </div>

      {/* Doctor Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border text-center ${
              isDark
                ? 'bg-[#09241c] border-emerald-400/30 text-white'
                : 'bg-white/95 border-emerald-100 text-slate-900'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-1">Confirm SOAP & Sign-off</h3>
            <p className={`text-xs mb-5 ${isDark ? 'text-emerald-200/80' : 'text-slate-600'}`}>
              Sign off case sheet for <strong>{currentPatient.name}</strong> ({currentPatient.id}) and transmit to ABDM Health Locker.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsVerified(true);
                  setShowVerificationModal(false);
                  alert(`Case sheet signed for ${currentPatient.name} and transmitted to ABDM FHIR bundle!`);
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
              >
                Sign & Sync ABDM
              </button>
              <button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function NavItem({
  isDark = false,
  icon,
  label,
  active = false,
  badge,
  alert,
  onClick,
}: {
  isDark?: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  alert?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all cursor-pointer ${
        active
          ? isDark
            ? 'bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_20px_rgba(52,211,153,0.35)]'
            : 'bg-teal-800 text-white shadow-md'
          : isDark
          ? 'text-emerald-200/80 hover:text-white hover:bg-emerald-500/15'
          : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            active
              ? isDark
                ? 'bg-emerald-950 text-emerald-300'
                : 'bg-white/20 text-white'
              : alert
              ? isDark
                ? 'bg-rose-500/25 border border-rose-400/40 text-rose-300'
                : 'bg-rose-100 text-rose-700'
              : isDark
              ? 'bg-emerald-500/25 border border-emerald-400/30 text-emerald-300'
              : 'text-slate-500 bg-slate-100/90'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
