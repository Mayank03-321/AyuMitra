/**
 * AyuMitra: AI-Powered Multimodal Patient Case-Taking Software
 * Compliant with SIH Problem Statement 4: Patient Case-Taking Software
 * (Ministry of Ayush / All India Institute of Ayurveda)
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PatientKiosk } from './components/patient/PatientKiosk';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { DoctorApp } from './components/doctor/DoctorApp';

import { AccessibilityMode, LanguageCode, Patient, ClinicalSummary, AuditLogEntry } from './types';
import { DEMO_PATIENT, DEMO_CLINICAL_SUMMARY } from './data/initialData';

export default function App() {
  const [role, setRole] = useState<'none' | 'patient' | 'doctor'>('none');
  const [currentTab, setCurrentTab] = useState<'patient'>('patient');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('standard');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [patient, setPatient] = useState<Patient>(DEMO_PATIENT);
  const [summary, setSummary] = useState<ClinicalSummary>(DEMO_CLINICAL_SUMMARY);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Fetch initial audit logs and state from backend
  useEffect(() => {
    fetch('/api/v1/audit/logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAuditLogs(data);
      })
      .catch((err) => console.error('Error fetching audit logs:', err));
  }, []);

  const handleResetDemo = () => {
    fetch('/api/v1/demo/seed', { method: 'POST' })
      .then(() => {
        setPatient({ ...DEMO_PATIENT });
        setSummary({ ...DEMO_CLINICAL_SUMMARY });
        setSelectedLanguage('en');
        setCurrentTab('patient');
      })
      .catch((err) => console.error('Error resetting demo:', err));
  };

  const handleSessionComplete = (data: any) => {
    // When patient completes kiosk, update patient & summary state
    if (data.patient) setPatient(data.patient);
  };

  if (role === 'none') {
    return <RoleSelectionScreen onSelectRole={setRole} />;
  }

  if (role === 'doctor') {
    return <DoctorApp onExit={() => setRole('none')} />;
  }

  return (
    <div className="min-h-screen text-slate-800 font-sans antialiased selection:bg-teal-500 selection:text-white relative overflow-x-hidden flex flex-col bg-slate-900">
      {/* Ambient Sage Watercolor Backdrop Layer from Stitch Glassmorphism Compositor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          alt="AyuMitra Healing Sage Backdrop"
          className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.02]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-JVvLDWJvG4cx2I3LU733ybGXI5Yc5mFQLx8WnwwEl3P0yXenc95E1XoxjgR-YT5097clNsBL8DsSJFJwJd-9In_9YgtGIDrBApDO9Xoe9qKUmsq28gaGtd3rZr6TWe3s4Li-CQKQ2qlLxikGGBtdAOeBVjvuDBoQEbAPhUhOKT3sorTHBFYk10liqT1hMDKqt0RbFfh2XP74ZVNAEosTCy82W8YnMI6sp-0Tv0dI5CrB_QFTwRnSmeVGEzPlwCX3Gg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#0b3b36]/20 backdrop-blur-[2px]" />
      </div>

      {/* Floating Glassmorphic App Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top Navigation */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          accessibilityMode={accessibilityMode}
          onChangeAccessibility={setAccessibilityMode}
          selectedLanguage={selectedLanguage}
          onChangeLanguage={setSelectedLanguage}
          onResetDemo={handleResetDemo}
          onExit={() => setRole('none')}
          hasRedFlags={summary.priorityAlerts.length > 0}
        />

        {/* Main Content Area */}
        <main className="flex-1 py-2 sm:py-4 px-3 sm:px-6 lg:px-8 max-w-[1480px] w-full mx-auto flex flex-col justify-center">
          <div className="w-full frosted-glass-main rounded-[28px] sm:rounded-[32px] shadow-2xl p-4 sm:p-6 lg:p-7 pb-3 sm:pb-4 lg:pb-4 border border-white/80 transition-all duration-300">
            {currentTab === 'patient' && (
              <PatientKiosk
                language={selectedLanguage}
                onChangeLanguage={setSelectedLanguage}
                accessibilityMode={accessibilityMode}
                onChangeAccessibility={setAccessibilityMode}
                onSessionComplete={handleSessionComplete}
              />
            )}
          </div>
        </main>

        {/* Bottom Footer Notice */}
        <footer className="relative z-10 bg-white/70 backdrop-blur-md border-t border-teal-900/10 py-3 px-4 text-center text-xs text-slate-700">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
            <span className="font-semibold text-teal-950">
              AyuMitra • Smart India Hackathon (SIH 2026 #4) • Ministry of Ayush / AIIA
            </span>
            <span className="text-slate-600 font-medium">
              Assistive Clinical Architecture • DPDP Act 2023 & ABDM Compliant • Non-autonomous AI
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
