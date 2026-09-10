import React from 'react';
import {
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  RefreshCcw,
  CheckCircle2,
  Play,
  Activity,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import { QueuePatient } from '../../data/doctorMockData';

interface DoctorOverviewDashboardProps {
  isDark?: boolean;
  queue: QueuePatient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onOpenSummary: (id: string) => void;
  activeFilter: 'all' | 'high' | 'ready' | 'transcribing' | 'completed';
  onChangeFilter: (filter: 'all' | 'high' | 'ready' | 'transcribing' | 'completed') => void;
  alerts: Array<{ id: number; type: string; time: string; desc: string; color: string; iconColor: string }>;
}

/**
 * DoctorOverviewDashboard renders the glassmorphic clinical overview
 * with support for both Dark Emerald Glass (Stitch 4) & Light Sage Glass (Stitch 5).
 */
export const DoctorOverviewDashboard: React.FC<DoctorOverviewDashboardProps> = ({
  isDark = false,
  queue,
  selectedPatientId,
  onSelectPatient,
  onOpenSummary,
  activeFilter,
  onChangeFilter,
  alerts,
}) => {
  const currentPatient = queue.find((p) => p.id === selectedPatientId) || queue[0];

  return (
    <div className="flex flex-col xl:flex-row gap-5 lg:gap-6">
      {/* Left Column (Main Feed & Queue) */}
      <div className="flex-1 flex flex-col space-y-5 lg:space-y-6 min-w-0">
        {/* Top Context Banner */}
        <div
          className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md border shadow-sm ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
              : 'bg-white/80 border-white/70 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isDark
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse'
                  : 'bg-teal-500 animate-pulse'
              }`}
            />
            <span>Live OPD Triage Stream • Room 12</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}
              >
                Good Morning, Dr. Ananya
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDark ? 'text-emerald-200/70' : 'text-slate-500'
                }`}
              >
                AI Multimodal intake active across 4 kiosk bays. Review and verify incoming clinical cases.
              </p>
            </div>
            {currentPatient && (
              <button
                type="button"
                onClick={() => onOpenSummary(currentPatient.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer active:scale-95 shadow-md ${
                  isDark
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                    : 'bg-teal-800 hover:bg-teal-900 text-white shadow-teal-950/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Review Case ({currentPatient.initials})</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`rounded-2xl p-4.5 backdrop-blur-md border shadow-sm ${
              isDark
                ? 'bg-[#09241c]/75 border-emerald-400/20'
                : 'bg-white/80 border-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-emerald-500/25 border border-emerald-400/30 text-emerald-300'
                    : 'bg-teal-100/80 text-teal-800'
                }`}
              >
                +12% today
              </span>
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>38</div>
            <div className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
              Total Patients Today
            </div>
          </div>

          <div
            className={`rounded-2xl p-4.5 backdrop-blur-md border shadow-sm ${
              isDark
                ? 'bg-[#09241c]/75 border-emerald-400/20'
                : 'bg-white/80 border-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                <Clock className="w-4.5 h-4.5" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-indigo-500/25 border border-indigo-400/30 text-indigo-300'
                    : 'bg-indigo-100/80 text-indigo-800'
                }`}
              >
                Avg wait: 4m
              </span>
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>14</div>
            <div className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
              Waiting in Kiosk
            </div>
          </div>

          <div
            className={`rounded-2xl p-4.5 backdrop-blur-md border shadow-sm ${
              isDark
                ? 'bg-[#09241c]/75 border-emerald-400/20'
                : 'bg-white/80 border-white/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-teal-50 text-teal-700'
                }`}
              >
                <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-emerald-500/25 border border-emerald-400/30 text-emerald-300'
                    : 'bg-teal-100/80 text-teal-800'
                }`}
              >
                Ready for Review
              </span>
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>19</div>
            <div className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
              AI Ready & Summarized
            </div>
          </div>

          <div
            className={`rounded-2xl p-4.5 backdrop-blur-md border shadow-sm ${
              isDark
                ? 'bg-rose-950/50 border-rose-500/30'
                : 'bg-rose-50/80 border-rose-200/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'
                }`}
              >
                <AlertTriangle className="w-4.5 h-4.5 text-rose-500 animate-bounce" />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-rose-500/25 border-rose-400/40 text-rose-300'
                    : 'bg-rose-200/80 border-rose-300 text-rose-800'
                }`}
              >
                Action Required
              </span>
            </div>
            <div className={`text-2xl font-black ${isDark ? 'text-rose-200' : 'text-rose-900'}`}>05</div>
            <div className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-rose-300/80' : 'text-rose-700'}`}>
              Priority Red Flags
            </div>
          </div>
        </div>

        {/* Patient Intake Queue Table */}
        <div
          className={`rounded-3xl backdrop-blur-md border shadow-sm overflow-hidden flex flex-col ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20'
              : 'bg-white/80 border-white/70'
          }`}
        >
          <div
            className={`p-4 sm:p-5 border-b flex items-center justify-between flex-wrap gap-2 ${
              isDark ? 'border-emerald-500/15' : 'border-slate-200/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Today's Patient Intake Queue
              </h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border shadow-2xs ${
                  isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-teal-100/90 text-teal-900 border-teal-200/60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDark
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse'
                      : 'bg-teal-600 animate-pulse'
                  }`}
                />
                Live Kiosk Feed
              </span>
            </div>
            <div className={`text-xs flex items-center gap-1 font-medium ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
              <RefreshCcw className="w-3.5 h-3.5" /> Synced 12s ago
            </div>
          </div>

          {/* Filter Pills */}
          <div
            className={`px-4 sm:px-5 py-2.5 border-b flex items-center gap-2 overflow-x-auto ${
              isDark
                ? 'bg-[#061a14]/60 border-emerald-500/15'
                : 'bg-slate-50/50 border-slate-200/60'
            }`}
          >
            <button
              type="button"
              onClick={() => onChangeFilter('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? isDark
                    ? 'bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                    : 'bg-teal-800 text-white shadow-xs'
                  : isDark
                  ? 'bg-emerald-950/60 border border-emerald-500/20 text-emerald-200 hover:text-white'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              All (38)
            </button>
            <button
              type="button"
              onClick={() => onChangeFilter('high')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'high'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-rose-950/60 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60'
                  : 'bg-white/80 border border-rose-200 text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              High Priority (5)
            </button>
            <button
              type="button"
              onClick={() => onChangeFilter('ready')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'ready'
                  ? isDark
                    ? 'bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                    : 'bg-teal-800 text-white shadow-xs'
                  : isDark
                  ? 'bg-emerald-950/60 border border-emerald-500/20 text-emerald-200 hover:text-white'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              AI Ready (19)
            </button>
            <button
              type="button"
              onClick={() => onChangeFilter('transcribing')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'transcribing'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-blue-900/60'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              In Voice Session (8)
            </button>
            <button
              type="button"
              onClick={() => onChangeFilter('completed')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-900/60 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'bg-white/80 border border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              Completed (6)
            </button>
          </div>

          {/* Queue Rows */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead
                className={`text-[10px] uppercase tracking-wider font-bold ${
                  isDark
                    ? 'bg-[#061a14]/80 text-emerald-300/60'
                    : 'bg-slate-50/80 text-slate-500'
                }`}
              >
                <tr>
                  <th className="px-5 py-3">Patient</th>
                  <th className="px-5 py-3">Chief Complaint</th>
                  <th className="px-5 py-3">Intake Status</th>
                  <th className="px-5 py-3">Triage</th>
                  <th className="px-5 py-3">Wait Time</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y font-medium ${
                  isDark ? 'divide-emerald-500/10' : 'divide-slate-100'
                }`}
              >
                {queue.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPatient(p.id)}
                    className={`transition-colors cursor-pointer ${
                      selectedPatientId === p.id
                        ? isDark
                          ? 'bg-emerald-500/15 font-semibold text-white'
                          : 'bg-teal-50/70 font-semibold text-slate-900'
                        : isDark
                        ? 'hover:bg-emerald-500/10 text-emerald-100'
                        : 'hover:bg-teal-50/50 text-slate-800'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${
                            isDark
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {p.initials}
                        </div>
                        <div>
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</p>
                          <div className={`flex items-center gap-1.5 text-[11px] mt-0.5 ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                            <span>{p.id}</span>
                            <span>•</span>
                            <span>
                              {p.gender}/{p.age}
                            </span>
                            <span>•</span>
                            <span
                              className={`px-1.5 rounded text-[10px] font-bold ${
                                isDark
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-teal-100/80 text-teal-800'
                              }`}
                            >
                              {p.language}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 max-w-xs truncate ${isDark ? 'text-emerald-100/90' : 'text-slate-700'}`}>
                      {p.chiefComplaint}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : p.statusColor
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                          p.priority === 'High Priority'
                            ? isDark
                              ? 'bg-rose-500/25 border border-rose-400/40 text-rose-300'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                            : isDark
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : p.priorityColor
                        }`}
                      >
                        {p.priority === 'High Priority' && <AlertTriangle className="w-3 h-3" />}
                        {p.priority}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-xs ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                      {p.waitTime}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenSummary(p.id);
                        }}
                        className={`px-3 py-1.5 font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs border ${
                          isDark
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-200/60'
                        }`}
                      >
                        <span>View SOAP</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column (Sidebar Telemetry & Alerts) */}
      <div className="w-full xl:w-80 flex flex-col space-y-5 lg:space-y-6">
        {/* AI Telemetry Card */}
        <div
          className={`rounded-3xl backdrop-blur-md border shadow-sm p-5 ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
              : 'bg-white/80 border-white/70 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Activity className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-teal-700'}`} /> AI Intake Telemetry
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Today
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className={isDark ? 'text-emerald-950/80' : 'text-slate-200'}
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isDark ? 'text-emerald-400' : 'text-teal-600'}
                  strokeDasharray="96, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>96%</span>
              </div>
            </div>
            <div>
              <p className={`text-xs ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>Avg Intake Time:</p>
              <p className={`text-lg font-black ${isDark ? 'text-emerald-300' : 'text-teal-800'}`}>2.8 mins</p>
              <span className="text-[10px] text-emerald-400 font-bold">✓ 70% time reduction</span>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-3 border-t pt-3 ${
              isDark ? 'border-emerald-500/15' : 'border-slate-100'
            }`}
          >
            <div>
              <p className={`text-[10px] font-semibold ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                OCR Precision
              </p>
              <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>99.4%</p>
            </div>
            <div>
              <p className={`text-[10px] font-semibold ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>
                Doctor Sign Rate
              </p>
              <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>94.8%</p>
            </div>
          </div>
        </div>

        {/* Live Hospital Alerts */}
        <div
          className={`rounded-3xl backdrop-blur-md border shadow-sm p-5 flex flex-col ${
            isDark
              ? 'bg-[#09241c]/75 border-emerald-400/20 text-white'
              : 'bg-white/80 border-white/70 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold text-sm flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Bell className="w-4 h-4 text-rose-500" /> Live Hospital Alerts
            </h3>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[300px]">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border text-xs ${
                  isDark
                    ? 'bg-[#061a14]/80 border-emerald-500/20 text-emerald-100'
                    : `${alert.color}`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold flex items-center gap-1 text-[11px] ${alert.iconColor}`}>
                    {alert.type}
                  </span>
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-emerald-300/50' : 'opacity-70'}`}>
                    {alert.time}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-emerald-200/80' : 'opacity-90'}`}>
                  {alert.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
