import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { AiSkillAnalysisData } from '../../services/aiFallbackService';
import { AILoadingState } from './AILoadingState';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  Layers,
  RotateCcw,
} from 'lucide-react';

interface AISkillAnalysisProps {
  techSkills?: Record<string, number>;
  softSkills?: Record<string, number>;
  interests?: string[];
  onTakeAction?: () => void;
}

export const AISkillAnalysis: React.FC<AISkillAnalysisProps> = ({
  techSkills,
  softSkills,
  interests,
  onTakeAction,
}) => {
  const { studentProfile, navigate } = useApp();
  const [analysis, setAnalysis] = useState<AiSkillAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await geminiService.generateSkillAnalysis(
        studentProfile,
        techSkills,
        interests?.length ? interests : ['Backend Developer', 'Software Developer']
      );
      setAnalysis(res);
    } catch {
      // Handled via fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [studentProfile, techSkills, interests]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4F73C] text-[#111216] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                AI Skill Analysis
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] border border-[#D4F73C]/30">
                AI Intelligence
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Comprehensive evaluation grounded strictly in your verified assessment benchmarks.
            </p>
          </div>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-Analyze</span>
        </button>
      </div>

      {loading ? (
        <AILoadingState message="SkillBridge AI is evaluating technical assessment and soft skills..." />
      ) : analysis ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
              Assessment Summary
            </span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Strengths & Weak Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Strengths</span>
              </h3>
              <div className="space-y-2">
                {analysis.strengths.map((str, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-gray-800 dark:text-gray-200 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-medium">{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Areas */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Priority Gaps (Weak Areas)</span>
              </h3>
              <div className="space-y-2">
                {analysis.weakAreas.map((weak, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-gray-800 dark:text-gray-200 flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-medium">{weak}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Career Fit & Recommended Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Career Fit
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600 text-white">
                  {analysis.careerFit.fitScore}% Match
                </span>
              </div>
              <h4 className="text-base font-black text-gray-900 dark:text-white">
                {analysis.careerFit.role}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                {analysis.careerFit.explanation}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#121319] to-[#1E202A] text-white border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4F73C]">
                  Recommended Next Action
                </span>
                <p className="text-xs font-semibold text-gray-100 mt-1 leading-relaxed">
                  {analysis.recommendedAction}
                </p>
              </div>

              <div className="pt-3">
                <button
                  id="action-skill-gap-roadmap-btn"
                  onClick={() => {
                    if (onTakeAction) onTakeAction();
                    else navigate('/student/roadmap');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea2f] text-[#111216] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Generate Career Roadmap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
