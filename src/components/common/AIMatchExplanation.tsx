import React, { useState } from 'react';
import { JobPosting, StudentProfile } from '../../types';
import { geminiService } from '../../services/geminiService';
import { OpportunityMatchData, OpportunityPrepPlan } from '../../services/aiFallbackService';
import { AILoadingState } from './AILoadingState';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  HelpCircle,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AIMatchExplanationProps {
  job: JobPosting;
  profile?: StudentProfile;
  studentProfile?: StudentProfile;
  isOpen?: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export const AIMatchExplanation: React.FC<AIMatchExplanationProps> = ({
  job,
  profile,
  studentProfile,
  isOpen = true,
  onClose,
  onApply,
}) => {
  const activeProfile = profile || studentProfile;
  const [matchData, setMatchData] = useState<OpportunityMatchData | null>(null);
  const [prepPlan, setPrepPlan] = useState<OpportunityPrepPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'match' | 'prep'>('match');

  React.useEffect(() => {
    if (!isOpen || !activeProfile) return;

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [m, p] = await Promise.all([
          geminiService.matchOpportunityWithAI(job, activeProfile),
          geminiService.generateOpportunityPreparation(job, activeProfile),
        ]);
        if (mounted) {
          setMatchData(m);
          setPrepPlan(p);
        }
      } catch {
        // handled via fallback
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isOpen, job, profile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121319] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  {job.title}
                </h3>
                <span className="text-xs font-bold text-gray-400">@ {job.companyName}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Opportunity Match & Interview Preparation Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 dark:border-white/5 px-6 pt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('match')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'match'
                ? 'border-[#4D7C0F] dark:border-[#D4F73C] text-[#4D7C0F] dark:text-[#D4F73C]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            Why This Matches (Match Breakdown)
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'prep'
                ? 'border-[#4D7C0F] dark:border-[#D4F73C] text-[#4D7C0F] dark:text-[#D4F73C]'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            }`}
          >
            Prepare Me for This Opportunity
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {loading ? (
            <AILoadingState message="SkillBridge AI is comparing profile benchmarks against role requirements..." />
          ) : activeTab === 'match' && matchData ? (
            <div className="space-y-5">
              {/* Scorecard Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">
                      Current Evaluation
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      AI Opportunity Match
                    </span>
                  </div>
                  <div className="text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C]">
                    {matchData.matchScore}%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 flex items-center justify-between">
                  <div>
                    <span className="text-blue-500 font-bold block text-[10px] uppercase">
                      After Gap Mitigation
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">
                      {matchData.projectedScoreLabel}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {matchData.projectedScoreAfterLearning}%
                  </div>
                </div>
              </div>

              {/* Rationale text */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {matchData.summary}
              </div>

              {/* Matches vs Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strong Matches */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Strong Match Because:</span>
                  </h4>
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                    {matchData.strongMatches.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-black">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                  <h4 className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Improve Before Screening:</span>
                  </h4>
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 font-medium">
                    {matchData.improvementsNeeded.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-amber-500 font-black">△</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#D4F73C]/10 border border-[#D4F73C]/20 text-gray-900 dark:text-white">
                <span className="text-[10px] font-black uppercase text-[#4D7C0F] dark:text-[#D4F73C] block mb-1">
                  Actionable Next Step
                </span>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {matchData.recommendedAction}
                </p>
              </div>
            </div>
          ) : activeTab === 'prep' && prepPlan ? (
            <div className="space-y-5">
              {/* Technical Preparation */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Technical Preparation</span>
                </h4>
                <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 pl-4 list-disc">
                  {prepPlan.technicalPreparation.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Interview Preparation */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>Interview Preparation & Communication</span>
                </h4>
                <ul className="space-y-1.5 text-gray-600 dark:text-gray-300 pl-4 list-disc">
                  {prepPlan.interviewPreparation.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>

              {/* Projects to Highlight & Skills to Revise */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                  <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    Projects to Highlight
                  </h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    {prepPlan.projectsToHighlight.map((p, idx) => (
                      <li key={idx}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2">
                  <h4 className="font-extrabold text-amber-600 dark:text-amber-400">
                    Skills to Revise
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prepPlan.skillsToRevise.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions to Expect */}
              <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 space-y-2.5">
                <h4 className="font-extrabold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Anticipated Screening Questions</span>
                </h4>
                <div className="space-y-2">
                  {prepPlan.questionsToExpect.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 font-medium">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
