import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { skillBridgeEngine, PlacementReadinessBreakdown } from '../../services/skillBridgeIntelligenceEngine';
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Code2,
  Brain,
  MessageSquare,
  FolderGit2,
  FileText,
  Bot,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

interface PlacementReadinessScoreCardProps {
  profile: StudentProfile;
  onOpenSimulator?: () => void;
  onOpenRoadmap?: () => void;
  compact?: boolean;
}

export const PlacementReadinessScoreCard: React.FC<PlacementReadinessScoreCardProps> = ({
  profile,
  onOpenSimulator,
  onOpenRoadmap,
  compact = false,
}) => {
  const breakdown: PlacementReadinessBreakdown = skillBridgeEngine.computePlacementReadiness(profile);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'actionPlan'>('breakdown');

  const categoryIcons: Record<string, React.ReactNode> = {
    technical: <Code2 className="w-4 h-4 text-blue-500" />,
    aptitude: <Brain className="w-4 h-4 text-purple-500" />,
    communication: <MessageSquare className="w-4 h-4 text-emerald-500" />,
    projects: <FolderGit2 className="w-4 h-4 text-indigo-500" />,
    resume: <FileText className="w-4 h-4 text-amber-500" />,
    interview: <Bot className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div
      id="ai-placement-readiness-card"
      className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-6 font-sans relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4F73C]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Tier Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1.5 border border-purple-200 dark:border-purple-800/40">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Placement Readiness Score</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Placement Readiness Index
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Holistic multi-factor placement benchmark based on coding, aptitude, communication & portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold border ${breakdown.tierColor}`}>
            {breakdown.tier}
          </span>
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="px-3.5 py-1.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>What-If Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score & Predicted CTC Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 items-center">
        {/* Left: Score Gauge */}
        <div className="md:col-span-5 flex items-center gap-5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-gray-200 dark:stroke-white/10"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#84B000] dark:stroke-[#D4F73C] transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * breakdown.overallScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tabular-nums">
                {breakdown.overallScore}
              </span>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Top 5% University Cohort</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Predicted CTC Package:
            </p>
            <p className="text-lg font-black text-gray-900 dark:text-white">
              {breakdown.predictedCtcRange}
            </p>
          </div>
        </div>

        {/* Right: Quick Insights */}
        <div className="md:col-span-7 space-y-2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-5 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Key Strengths:</span>
            </span>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              {breakdown.strengths.slice(0, 2).map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {breakdown.criticalGaps.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Priority Focus Area:</span>
              </span>
              <p className="text-gray-600 dark:text-gray-300">
                {breakdown.criticalGaps[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Category Breakdown vs Action Plan */}
      {!compact && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`text-xs font-bold pb-1 transition-all cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'text-gray-900 dark:text-white border-b-2 border-[#D4F73C]'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              6-Component Competency Breakdown
            </button>
            <button
              onClick={() => setActiveTab('actionPlan')}
              className={`text-xs font-bold pb-1 transition-all cursor-pointer ${
                activeTab === 'actionPlan'
                  ? 'text-gray-900 dark:text-white border-b-2 border-[#D4F73C]'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              Placement Action Plan ({breakdown.actionPlan.length})
            </button>
          </div>

          {activeTab === 'breakdown' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.entries(breakdown.categories).map(([key, cat]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center shrink-0">
                          {categoryIcons[key] || <Award className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-xs font-black text-gray-900 dark:text-white tabular-nums">
                        {cat.score}%
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                      {cat.details}
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          cat.score >= 80
                            ? 'bg-emerald-500'
                            : cat.score >= 65
                            ? 'bg-cyan-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 flex justify-between">
                      <span>Weight: {cat.weight}%</span>
                      <span>{cat.score >= 80 ? 'Placement Ready' : 'In Progress'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {breakdown.actionPlan.map((action, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                        action.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {action.priority} Priority
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {action.task}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4F73C]/20 text-[#3f670c] dark:text-[#D4F73C]">
                      {action.estimatedGain}
                    </span>
                    {onOpenRoadmap && (
                      <button
                        onClick={onOpenRoadmap}
                        className="p-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        title="Start task"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
