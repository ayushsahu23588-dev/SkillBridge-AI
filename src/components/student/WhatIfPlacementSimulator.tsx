import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  skillBridgeEngine,
  WhatIfScenarioInput,
  WhatIfSimulationResult,
} from '../../services/skillBridgeIntelligenceEngine';
import {
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  Building2,
  Sliders,
  DollarSign,
  Briefcase,
  X,
  Target,
} from 'lucide-react';

interface WhatIfPlacementSimulatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApplyGoal?: () => void;
}

export const WhatIfPlacementSimulator: React.FC<WhatIfPlacementSimulatorProps> = ({
  isOpen = true,
  onClose,
  onApplyGoal,
}) => {
  const { studentProfile, jobs, showToast, navigate } = useApp();

  // Simulation Controls State
  const [technicalDelta, setTechnicalDelta] = useState<number>(15);
  const [aptitudeDelta, setAptitudeDelta] = useState<number>(10);
  const [communicationDelta, setCommunicationDelta] = useState<number>(10);
  const [addedProjectsCount, setAddedProjectsCount] = useState<number>(1);
  const [mockInterviewScore, setMockInterviewScore] = useState<number>(88);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Docker', 'AWS']);
  const [cgpaBoost, setCgpaBoost] = useState<number>(0.2);

  const availableSkillOptions = ['Docker', 'AWS', 'Kubernetes', 'Redis', 'GraphQL', 'System Design'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const resetSimulation = () => {
    setTechnicalDelta(0);
    setAptitudeDelta(0);
    setCommunicationDelta(0);
    setAddedProjectsCount(0);
    setMockInterviewScore(studentProfile.interviewReadinessScore || 70);
    setSelectedSkills([]);
    setCgpaBoost(0);
    showToast('Simulation parameters reset to current profile.', 'info');
  };

  const scenarioInput: WhatIfScenarioInput = useMemo(
    () => ({
      technicalDelta,
      aptitudeDelta,
      communicationDelta,
      addedProjectsCount,
      mockInterviewScore,
      additionalSkills: selectedSkills,
      cgpaBoost,
    }),
    [
      technicalDelta,
      aptitudeDelta,
      communicationDelta,
      addedProjectsCount,
      mockInterviewScore,
      selectedSkills,
      cgpaBoost,
    ]
  );

  const result: WhatIfSimulationResult = useMemo(
    () => skillBridgeEngine.simulateWhatIfScenario(studentProfile, jobs, scenarioInput),
    [studentProfile, jobs, scenarioInput]
  );

  const handleApplyToRoadmap = () => {
    showToast('Simulated milestones applied to Career Roadmap!', 'success');
    if (onApplyGoal) onApplyGoal();
    if (onClose) onClose();
    navigate('/student/roadmap');
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-700 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <Zap className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Interactive Decision Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              What-If Placement Simulator
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 max-w-xl">
              Model how improving specific technical skills, verified capstones, aptitude test scores, and interview performance directly elevates your placement-fit and unlocks eligibility for new campus recruitment drives.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetSimulation}
              className="px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Controls on Left, Real-Time Impact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Parameter Modifiers */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Skill & Preparation Sliders
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-gray-400">
              Live Adjustment
            </span>
          </div>

          {/* 1. Technical / DSA Boost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">DSA & Coding Benchmark Boost</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">+{technicalDelta}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={technicalDelta}
              onChange={(e) => setTechnicalDelta(Number(e.target.value))}
              className="w-full accent-purple-600 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-gray-400">Simulates solving 20+ algorithmic patterns on LeetCode / HackerRank</span>
          </div>

          {/* 2. Aptitude Speed & Logic */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">Quantitative & Aptitude Boost</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">+{aptitudeDelta}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={aptitudeDelta}
              onChange={(e) => setAptitudeDelta(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-gray-400">Simulates clearing speed-diagnostic tests and logic drills</span>
          </div>

          {/* 3. Verified Projects Added */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">Production Projects Deployed</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{addedProjectsCount} Repos</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setAddedProjectsCount(num)}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    addedProjectsCount === num
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-gray-300'
                  }`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Mock Interview Score */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">AI Mock Interview Target</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{mockInterviewScore}/100</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="2"
              value={mockInterviewScore}
              onChange={(e) => setMockInterviewScore(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 5. In-Demand Skills Toggles */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
              Acquire Trending Cloud & Tech Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableSkillOptions.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#D4F73C] text-[#111216] border-[#D4F73C] shadow-xs'
                        : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Projected Impact & Company Match Changes */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Impact KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Overall Readiness
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                  {result.afterReadiness}%
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  +{result.readinessDelta}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Was {result.beforeReadiness}% before simulation
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Placement-Fit Improvement
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#84B000] dark:text-[#D4F73C] tabular-nums">
                  +{result.estimatedFitImprovementPercentage}%
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Fit Boost
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Average across target company requisitions
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                New Company Eligibility
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
                  +{result.newEligibleCompaniesCount}
                </span>
                <span className="text-xs font-bold text-purple-500">New Drives</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Eligible for new campus recruitment shortlists
              </p>
            </div>
          </div>

          {/* Company-by-Company Match Breakdown Table */}
          <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Company Match Probability Shift
                </h3>
                <p className="text-xs text-gray-400">
                  Real-time match jumps for active campus recruitment drives
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#D4F73C]/20 text-[#3d650b] dark:text-[#D4F73C]">
                Simulated Output
              </span>
            </div>

            <div className="space-y-3">
              {result.companyMatches.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {comp.companyName}
                      </span>
                      {comp.unlocked && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Shortlist Unlocked</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {comp.roleTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through mr-1.5 tabular-nums">
                        {comp.beforeMatch}%
                      </span>
                      <span className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                        {comp.afterMatch}%
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{comp.delta}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Summary Note & Apply Button */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {result.impactSummary}
              </p>

              <button
                type="button"
                onClick={handleApplyToRoadmap}
                className="px-5 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Target className="w-4 h-4" />
                <span>Apply as Roadmap Goals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
