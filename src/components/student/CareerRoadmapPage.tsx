import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  Compass,
  CheckCircle2,
  Circle,
  Calendar,
  Layers,
  Award,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  Rocket,
  ShieldCheck,
  RotateCcw,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AIRoadmap } from '../common/AIRoadmap';

export const CareerRoadmapPage: React.FC = () => {
  const {
    studentProfile,
    roadmapMilestones,
    updateRoadmapMilestoneStatus,
    selectedCareerRole,
    setSelectedCareerRole,
    assessmentSession,
    navigate,
    showToast,
  } = useApp();

  const [activeRole, setActiveRole] = useState<string>(
    selectedCareerRole || 'Software Developer'
  );

  const [viewMode, setViewMode] = useState<'gemini_ai' | 'timeline'>('gemini_ai');

  const availableRoles = [
    'Software Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'AI/ML Developer',
    'Cloud & DevOps Engineer',
  ];

  // Calculate stats
  const completedPhases = roadmapMilestones.filter((m) => m.status === 'Completed').length;
  const inProgressPhases = roadmapMilestones.filter((m) => m.status === 'In Progress').length;
  const totalPhases = roadmapMilestones.length;
  const averageProgress = Math.round(
    roadmapMilestones.reduce((acc, m) => acc + m.progress, 0) / (totalPhases || 1)
  );

  const handleTogglePhaseStatus = (milestoneId: string, currentStatus: string) => {
    if (currentStatus === 'Completed') {
      updateRoadmapMilestoneStatus(milestoneId, 'In Progress', 50);
    } else if (currentStatus === 'In Progress') {
      updateRoadmapMilestoneStatus(milestoneId, 'Completed', 100);
    } else if (currentStatus === 'Upcoming' || currentStatus === 'Locked') {
      updateRoadmapMilestoneStatus(milestoneId, 'In Progress', 25);
    }
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setSelectedCareerRole(role);
    showToast(`Roadmap calibrated for ${role}`, 'info');
  };

  const handleRegenerate = () => {
    const currentSkills = (studentProfile.skills || []).map((s) => s.name);
    const gaps = (assessmentSession?.skillGaps || []).map((g) => ({
      skill: g.skill,
      gap: g.gap,
    }));
    const newRoadmap = aiService.generateLearningRoadmap(
      activeRole,
      currentSkills,
      gaps
    );
    newRoadmap.phases.forEach((phase) => {
      updateRoadmapMilestoneStatus(phase.id, phase.status, phase.progress);
    });
    showToast(`Regenerated 5-phase career roadmap for ${activeRole}!`, 'success');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Step 4 • AI-Generated 5-Phase Career Trajectory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Personalized Learning & Career Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Target Track: <span className="font-bold text-gray-900 dark:text-white">{activeRole}</span>.
              A structured 5-month progression from closing diagnostic skill gaps to verified portfolio projects and campus hiring placement.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleRegenerate}
              className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Roadmap</span>
            </button>
            <button
              onClick={() => navigate('/student/skill-gap')}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#14151B] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-gray-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Skill Gap Matrix</span>
            </button>
            <button
              onClick={() => navigate('/student/internships')}
              className="px-5 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Internships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Target Track Switcher */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Career Roadmap Target:
            </span>
            <span className="text-xs text-gray-400">
              Synced with your Skill Gap Assessment
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRole === role
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-sm'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
            <button
              onClick={() => setViewMode('gemini_ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'gemini_ai'
                  ? 'bg-white dark:bg-[#111216] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
              <span>Dynamic AI Roadmap</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-[#111216] text-gray-900 dark:text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Campus Timeline Breakdown</span>
            </button>
          </div>

          <span className="text-xs text-gray-400 font-medium">
            AI-Calibrated for 2026 hiring cycles
          </span>
        </div>

        {/* Overall Completion Progress */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-gray-600 dark:text-gray-300">
              Overall Roadmap Trajectory ({completedPhases} of {totalPhases} Phases Completed • {inProgressPhases} In Progress)
            </span>
            <span className="text-purple-600 dark:text-purple-400 tabular-nums">
              {averageProgress}% Placement Readiness
            </span>
          </div>
          <div className="h-2.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-[#D4F73C] rounded-full transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* View Mode: Gemini AI vs Timeline */}
      {viewMode === 'gemini_ai' ? (
        <AIRoadmap
          initialGoal={activeRole}
          onMilestoneComplete={(m) => showToast(`Milestone completed: ${m}`, 'success')}
        />
      ) : (
        <>
      {/* Horizontal Milestone Pipeline Flow */}
      <div className="rounded-3xl bg-gray-50 dark:bg-[#14151B]/50 border border-gray-200 dark:border-white/10 p-5 overflow-x-auto">
        <div className="flex items-center min-w-[720px] justify-between text-center text-xs font-bold">
          <div className="flex-1 space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-gray-900 dark:text-white block">Phase 1: Foundation</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Completed (100%)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

          <div className="flex-1 space-y-1">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-gray-900 dark:text-white block">Phase 2: Development</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Active (65%)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

          <div className="flex-1 space-y-1">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-gray-900 dark:text-white block">Phase 3: Capstone</span>
            <span className="text-[10px] text-gray-400">Upcoming (Month 3)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

          <div className="flex-1 space-y-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-gray-900 dark:text-white block">Phase 4: Interview Prep</span>
            <span className="text-[10px] text-gray-400">Upcoming (Month 4)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />

          <div className="flex-1 space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#D4F73C] text-[#111216] flex items-center justify-center mx-auto shadow-sm font-black">
              <Rocket className="w-4 h-4" />
            </div>
            <span className="text-gray-900 dark:text-white block">Phase 5: Placement</span>
            <span className="text-[10px] text-[#4D7C0F] dark:text-[#D4F73C] font-bold">Offer Pipeline</span>
          </div>
        </div>
      </div>

      {/* 5-Month Step-by-Step Breakdown Cards */}
      <div className="space-y-6">
        {roadmapMilestones.map((phase) => {
          let badgeColor = 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300';
          let borderAccent = 'border-gray-200 dark:border-white/10';

          if (phase.status === 'Completed') {
            badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-500/30';
            borderAccent = 'border-emerald-500/20';
          } else if (phase.status === 'In Progress') {
            badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-500/30';
            borderAccent = 'border-blue-500/30';
          } else if (phase.status === 'Upcoming') {
            badgeColor = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-500/30';
          }

          return (
            <div
              key={phase.id}
              className={`rounded-3xl bg-white dark:bg-[#14151B] border ${borderAccent} p-6 sm:p-8 shadow-sm space-y-5 transition-all`}
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                      Phase {phase.phaseNumber} • {phase.month}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                      {phase.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {phase.title}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {phase.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tabular-nums block">
                      {phase.progress}% Complete
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Est: {phase.estimatedDuration}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTogglePhaseStatus(phase.id, phase.status)}
                    className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-white/10 cursor-pointer"
                    title="Toggle phase progress"
                  >
                    {phase.status === 'Completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : phase.status === 'In Progress' ? (
                      <Clock className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    phase.status === 'Completed'
                      ? 'bg-emerald-500'
                      : phase.status === 'In Progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              {/* Focus Topics List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Core Modules & Practical Milestones:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {phase.focusTopics.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-xl bg-gray-50/70 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 flex items-center gap-2.5 text-xs text-gray-800 dark:text-gray-200"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          phase.status === 'Completed'
                            ? 'text-emerald-500'
                            : phase.status === 'In Progress' && tIdx < 2
                            ? 'text-blue-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                      <span className="font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gained Skills and Action CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Skills Gained:</span>
                  {phase.skillsGained.map((sk, skIdx) => (
                    <span
                      key={skIdx}
                      className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {phase.actionTarget && (
                  <button
                    onClick={() => navigate(phase.actionTarget!)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>{phase.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
