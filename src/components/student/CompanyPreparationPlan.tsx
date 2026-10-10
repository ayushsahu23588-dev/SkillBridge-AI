import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { skillBridgeEngine, CompanyPrepPlan } from '../../services/skillBridgeIntelligenceEngine';
import {
  Building2,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  BookOpen,
  Code2,
  Bot,
  Layers,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface CompanyPreparationPlanProps {
  initialCompany?: string;
  onApplyPlan?: () => void;
}

export const CompanyPreparationPlan: React.FC<CompanyPreparationPlanProps> = ({
  initialCompany = 'NovaCloud Systems',
  onApplyPlan,
}) => {
  const { studentProfile, jobs, navigate, showToast } = useApp();

  const [selectedCompany, setSelectedCompany] = useState<string>(initialCompany);
  const [activeTab, setActiveTab] = useState<'rounds' | 'roadmap' | 'gaps'>('rounds');

  const availableCompanies = useMemo(() => {
    const defaultList = [
      'NovaCloud Systems',
      'Apex Data Networks',
      'TechNova Global',
      'Google India',
      'Microsoft IDC',
    ];
    const jobCompanies = jobs.map((j) => j.companyName).filter(Boolean);
    return Array.from(new Set([...defaultList, ...jobCompanies]));
  }, [jobs]);

  const prepPlan: CompanyPrepPlan = useMemo(
    () => skillBridgeEngine.generatePersonalizedPrepPlan(studentProfile, selectedCompany),
    [studentProfile, selectedCompany]
  );

  const handleApplyToRoadmap = () => {
    showToast(`Preparation plan for ${selectedCompany} synced with your Career Roadmap!`, 'success');
    if (onApplyPlan) onApplyPlan();
    navigate('/student/roadmap');
  };

  return (
    <div id="company-prep-plan-root" className="space-y-6 font-sans">
      {/* Top Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Company-Specific Career Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Personalized Company Preparation Plan
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Targeted week-by-week syllabus, technical round strategies, and skill gap remediation calibrated directly for your dream recruiter.
            </p>
          </div>

          {/* Company Selector */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-2 min-w-[240px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 block">
              Select Target Recruiter
            </span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121318] text-white text-xs font-bold border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D4F73C] cursor-pointer"
            >
              {availableCompanies.map((c) => (
                <option key={c} value={c} className="bg-[#121318] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Match Metric */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block mb-1">Current Company Fit</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {prepPlan.currentMatchPercentage}% Match
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Against target tech stack</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Timeline Needed */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block mb-1">Recommended Timeline</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {prepPlan.estimatedWeeksNeeded} Weeks Prep
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Intensive 4-stage milestones</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Critical Gaps Count */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block mb-1">Identified Focus Gaps</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {prepPlan.criticalSkillGaps.length} Key Topics
            </div>
            <span className="text-[10px] text-gray-500 font-medium">Prioritized for technical rounds</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('rounds')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rounds'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Interview Rounds Strategy ({prepPlan.roundsStrategy.length} Rounds)
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'roadmap'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Week-by-Week Action Plan ({prepPlan.weekByWeekRoadmap.length} Weeks)
        </button>
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'gaps'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
          }`}
        >
          Critical Skill Gaps ({prepPlan.criticalSkillGaps.length})
        </button>
      </div>

      {/* Tab 1: Rounds Strategy */}
      {activeTab === 'rounds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prepPlan.roundsStrategy.map((round) => (
            <div
              key={round.roundNumber}
              className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-300">
                  Round {round.roundNumber}
                </span>
                <span className="text-[11px] font-mono text-gray-400">Target Weight: 25%</span>
              </div>

              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                {round.roundName}
              </h3>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Core Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {round.focusAreas.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[11px] font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Actionable Strategy:
                </span>
                <p className="text-[11px] leading-relaxed font-normal">
                  {round.recommendedPrep}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Week-by-Week Action Plan */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {prepPlan.weekByWeekRoadmap.map((week, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C]">
                    {week.week}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {week.topic}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {week.milestone}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {week.practiceTasks.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/student/assessment')}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 transition-all cursor-pointer self-start md:self-center shrink-0"
              >
                Practice Tasks
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Critical Skill Gaps */}
      {activeTab === 'gaps' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Skill Gaps specific to {selectedCompany}'s hiring benchmarks
          </h3>
          <p className="text-xs text-gray-500">
            Our AI analyzed {selectedCompany}'s verified technical interviews against your active skill assessment records.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {prepPlan.criticalSkillGaps.map((gap, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-xs text-amber-900 dark:text-amber-200">{gap}</span>
                </div>
                <button
                  onClick={() => navigate('/student/skill-gap')}
                  className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  Bridge Gap →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="p-5 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-xs text-gray-900 dark:text-white">
            Sync this custom plan with your student dashboard
          </h4>
          <p className="text-[11px] text-gray-500">
            Automatically schedules practice tasks and capstone milestones into your 4-month Career Roadmap.
          </p>
        </div>

        <button
          onClick={handleApplyToRoadmap}
          className="px-5 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <span>Apply to Career Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
