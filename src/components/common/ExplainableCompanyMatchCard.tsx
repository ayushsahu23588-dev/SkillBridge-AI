import React from 'react';
import { JobPosting, StudentProfile } from '../../types';
import {
  skillBridgeEngine,
  ExplainableMatchResult,
} from '../../services/skillBridgeIntelligenceEngine';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  X,
  Building2,
  ArrowRight,
  ShieldCheck,
  Target,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface ExplainableCompanyMatchCardProps {
  job: JobPosting;
  profile: StudentProfile;
  onApply?: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const ExplainableCompanyMatchCard: React.FC<ExplainableCompanyMatchCardProps> = ({
  job,
  profile,
  onApply,
  onClose,
  isModal = false,
}) => {
  const result: ExplainableMatchResult = skillBridgeEngine.getExplainableMatch(profile, job);

  const cardContent = (
    <div
      id={`explainable-match-${job.id}`}
      className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-lg space-y-5 font-sans relative overflow-hidden"
    >
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 flex items-center justify-center shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {job.title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${result.badgeColor}`}>
                {result.fitTier}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {job.companyName} • {job.location} ({job.workplaceType || 'Hybrid'})
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center text-gray-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Match Score & Hiring Probability */}
      <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
        <div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Compatibility Match
          </span>
          <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
            {result.matchPercentage}%
          </span>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Hiring Probability
          </span>
          <span className="text-2xl font-black text-[#84B000] dark:text-[#D4F73C] tabular-nums">
            {result.hiringProbability}%
          </span>
        </div>
      </div>

      {/* Why It Matched (Explainable Reasons) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Why You Match This Role:</span>
        </h4>
        <ul className="space-y-1.5">
          {result.reasonsForMatch.map((reason, idx) => (
            <li
              key={idx}
              className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30"
            >
              <span className="text-emerald-500 font-bold">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Skills (if any) */}
      {result.missingSkills.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Missing Technical Skills:</span>
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Eligibility Gaps (if any) */}
      {result.eligibilityGaps.length > 0 && (
        <div className="space-y-1.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-xs text-rose-700 dark:text-rose-400">
          <span className="font-bold block">Eligibility Conditions to Verify:</span>
          <ul className="list-disc list-inside space-y-0.5">
            {result.eligibilityGaps.map((gap, idx) => (
              <li key={idx}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick 7-Day Actions */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-500" />
          <span>7-Day Quick Wins to Maximize Shortlist Probability:</span>
        </h4>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          {result.quickWins.map((qw, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="text-purple-500">→</span>
              <span>{qw}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      {onApply && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onApply}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Apply to Drive ({job.companyName})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
};
