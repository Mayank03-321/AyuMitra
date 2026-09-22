import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  Sparkles,
  ArrowRight,
  Languages,
  CheckCircle2,
  Tag,
  ShieldCheck,
  User,
  Bot,
} from 'lucide-react';
import { QueuePatient } from '../../data/doctorMockData';

interface DoctorVoiceTranscriptProps {
  isDark?: boolean;
  patient: QueuePatient;
  onOpenSummary: () => void;
}

/**
 * DoctorVoiceTranscript renders the Stitch-Glassmorphism AI Voice Transcript Workstation.
 * Includes synchronized audio waveform visualizer, turn-by-turn dialogue transcription,
 * entity extraction badges, and sentiment/distress meters.
 * Supports both Dark Emerald Glass (Stitch 4) & Light Sage Glass (Stitch 5).
 */
export const DoctorVoiceTranscript: React.FC<DoctorVoiceTranscriptProps> = ({
  isDark = false,
  patient,
  onOpenSummary,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(38);
  const totalDuration = 192; // 3m 12s

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const turns = [
    {
      id: 1,
      speaker: 'ai',
      time: '0:05',
      hindi: 'नमस्ते! मैं आपका आयुमित्र AI सहायक हूँ। कृपया बताइए आपको क्या तकलीफ़ है?',
      english: 'Hello! I am your AyuMitra AI assistant. Please describe what health symptoms you are experiencing?',
      confidence: 0.99,
      entities: ['Greeting', 'Intake Prompt'],
    },
    {
      id: 2,
      speaker: 'patient',
      time: '0:18',
      hindi: 'डॉक्टर साहब, मुझे पिछले दो दिनों से सीने में बीच में भारीपन और तेज दर्द महसूस हो रहा है, खासकर जब मैं सीढ़ियाँ चढ़ता हूँ।',
      english: 'Doctor, for the past two days I have been feeling heaviness and severe pain in the center of my chest, especially when climbing stairs.',
      confidence: 0.97,
      entities: ['Chest Heaviness', 'Severe Retrosternal Pain (2 days)', 'Exertional Trigger'],
    },
    {
      id: 3,
      speaker: 'ai',
      time: '0:42',
      hindi: 'क्या यह दर्द आपके बाएं हाथ या पीठ की तरफ भी जाता है? और क्या सांस लेने में भी कोई परेशानी हो रही है?',
      english: 'Does this pain radiate to your left arm or back? And are you experiencing any difficulty breathing as well?',
      confidence: 0.98,
      entities: ['Radiation Inquiry', 'Dyspnoea Check'],
    },
    {
      id: 4,
      speaker: 'patient',
      time: '1:05',
      hindi: 'हाँ, दर्द बाएं कंधे की तरफ फैलता है और बहुत पसीना आता है। सांस भी फूलने लगती है।',
      english: 'Yes, the pain radiates towards my left shoulder and causes profuse sweating. I also become breathless.',
      confidence: 0.96,
      entities: ['Left Shoulder Radiation', 'Diaphoresis', 'Exertional Breathlessness'],
    },
  ];

  const activeTurns = (patient as any).dialogueTurns && Array.isArray((patient as any).dialogueTurns) && (patient as any).dialogueTurns.length > 0
    ? (patient as any).dialogueTurns.map((t: any) => ({
        id: t.id,
        speaker: t.speaker,
        time: t.time || '0:10',
        hindi: t.hindi || t.text,
        english: t.english || t.text,
        confidence: t.confidence || 0.98,
        entities: t.entities || (t.speaker === 'patient' ? ['Patient Intake', 'Chief Complaint'] : ['AI Intake Prompt']),
      }))
    : ((patient as any).transcript)
    ? [
        {
          id: 1,
          speaker: 'ai',
          time: '0:05',
          hindi: 'नमस्ते! मैं आपका आयुमित्र AI सहायक हूँ। कृपया बताइए आपको क्या तकलीफ़ है?',
          english: 'Hello! I am your AyuMitra AI assistant. Please describe what health symptoms you are experiencing?',
          confidence: 0.99,
          entities: ['Greeting', 'Intake Prompt'],
        },
        {
          id: 2,
          speaker: 'patient',
          time: '0:18',
          hindi: (patient as any).transcript,
          english: (patient as any).transcript,
          confidence: 0.98,
          entities: ['Chief Complaint', 'Primary Symptom Intake'],
        },
      ]
    : turns;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Patient Audio Header */}
      <div
        className={`card-glass rounded-3xl p-6 border shadow-md ${
          isDark
            ? 'bg-[#09241c]/80 border-emerald-400/20 text-white'
            : 'bg-white/90 border-white/85 text-slate-900'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="/ayumitra-logo.png"
              alt="AyuMitra Logo"
              className="w-12 h-12 object-contain drop-shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{patient.name}</h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${
                    isDark
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {patient.id}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  OmniVoice + Whisper Large v3
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-emerald-200/70' : 'text-slate-600'}`}>
                Spoken Language: <strong>{patient.language}</strong> • 4 Dialogue Turns • Clinical Accuracy: 98.2%
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer self-start lg:self-center active:scale-95"
          >
            <span>Proceed to SOAP Note</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Synchronized Audio Player Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold cursor-pointer transition-transform active:scale-95 shrink-0 shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <div className="text-xs font-mono text-slate-300">
              00:{playbackTime < 10 ? `0${playbackTime}` : playbackTime} / 03:12
            </div>
          </div>

          {/* Animated Waveform Visualization */}
          <div className="flex-1 w-full flex items-center gap-1 h-8 px-2 overflow-hidden">
            {[40, 65, 80, 45, 90, 100, 70, 50, 85, 95, 60, 40, 75, 90, 85, 60, 40, 55, 90, 100, 75, 45, 60, 80, 95, 70, 50, 40, 80, 65].map((height, i) => (
              <div
                key={i}
                style={{ height: `${isPlaying ? Math.max(15, (height * (i % 2 === 0 ? 1.2 : 0.8))) : height}%` }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  i < (playbackTime / totalDuration) * 30 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Stereo Audio Track</span>
          </div>
        </div>
      </div>

      {/* Main Turn-by-Turn Bilingual Dialogue Feed */}
      <div className="space-y-4">
        {activeTurns.map((turn: any) => (
          <div
            key={turn.id}
            className={`card-glass rounded-3xl p-5 border shadow-xs transition-all ${
              isDark
                ? turn.speaker === 'patient'
                  ? 'bg-[#062018]/85 border-emerald-500/30 text-white'
                  : 'bg-[#09241c]/75 border-emerald-400/15 text-white'
                : turn.speaker === 'patient'
                  ? 'bg-white/95 border-emerald-200/90 shadow-emerald-950/5 text-slate-900'
                  : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-start justify-between gap-3 mb-3 border-b pb-2.5 ${isDark ? 'border-emerald-500/15' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    turn.speaker === 'patient'
                      ? isDark
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-emerald-100 text-emerald-800'
                      : 'bg-teal-700 text-white'
                  }`}
                >
                  {turn.speaker === 'patient' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div>
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {turn.speaker === 'patient' ? `Patient (${patient.name})` : 'AyuMitra Clinical AI'}
                  </span>
                  <span className={`text-[10px] ml-2 ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>[{turn.time}]</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  Confidence {(turn.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Dual Spoken Hindi + Translated English Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3">
              <div
                className={`p-3 rounded-2xl border text-xs ${
                  isDark
                    ? 'bg-[#041913]/70 border-emerald-500/20 text-emerald-100'
                    : 'bg-slate-50/80 border-slate-200 text-slate-900'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                  Original Spoken (Hindi)
                </span>
                <p className="font-medium leading-relaxed">{turn.hindi}</p>
              </div>

              <div
                className={`p-3 rounded-2xl border text-xs ${
                  isDark
                    ? 'bg-emerald-950/40 border-emerald-400/30 text-emerald-100'
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                  Clinical Translation (English)
                </span>
                <p className="font-medium leading-relaxed">{turn.english}</p>
              </div>
            </div>

            {/* Extracted Clinical Entity Badges */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className={`text-[10px] font-bold flex items-center gap-1 mr-1 ${isDark ? 'text-emerald-300/70' : 'text-slate-500'}`}>
                <Tag className="w-3 h-3 text-slate-400" /> Extracted Entities:
              </span>
              {turn.entities.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-lg shadow-2xs border ${
                    isDark
                      ? 'bg-emerald-900/60 border-emerald-400/30 text-emerald-200'
                      : 'bg-white border-emerald-300 text-emerald-900'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
