import React from 'react';
import { ClinicalSource } from '../../types';
import { FileText, User, Activity, AlertCircle, Sparkles } from 'lucide-react';

interface ConfidenceBadgeProps {
  source: ClinicalSource;
  showConfidence?: boolean;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  source,
  showConfidence = true,
  className = '',
}) => {
  const getIcon = () => {
    switch (source.type) {
      case 'PRESCRIPTION':
      case 'DOCUMENT':
        return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'LAB_REPORT':
        return <Activity className="w-3.5 h-3.5 text-indigo-600" />;
      case 'PATIENT_STATEMENT':
        return <User className="w-3.5 h-3.5 text-emerald-600" />;
      case 'SYSTEM_RULE':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      case 'AI_INFERENCE':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const getSourceLabel = () => {
    switch (source.type) {
      case 'PRESCRIPTION':
        return source.name ? `Rx: ${source.name}` : 'Prescription Document';
      case 'LAB_REPORT':
        return source.name ? `Lab: ${source.name}` : 'Laboratory Report';
      case 'PATIENT_STATEMENT':
        return 'Patient Statement (Voice/Touch)';
      case 'SYSTEM_RULE':
        return 'Clinical Deterministic Rule';
      case 'AI_INFERENCE':
        return 'AI Model Inference';
      case 'PHYSICIAN_ENTRY':
        return 'Physician Verified Entry';
      default:
        return 'Verified Source';
    }
  };

  const confidencePct = Math.round(source.confidence * 100);

  const getConfidenceColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (pct >= 75) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border bg-slate-50 border-slate-200 text-slate-700 ${className}`}
      title={`Source: ${getSourceLabel()} | Confidence: ${confidencePct}%`}
    >
      <span className="flex items-center gap-1">
        {getIcon()}
        <span className="truncate max-w-[140px]">{getSourceLabel()}</span>
      </span>

      {showConfidence && (
        <span
          className={`px-1.5 py-0.5 rounded text-[11px] font-semibold border ${getConfidenceColor(
            confidencePct
          )}`}
        >
          {confidencePct}%
        </span>
      )}
    </div>
  );
};
