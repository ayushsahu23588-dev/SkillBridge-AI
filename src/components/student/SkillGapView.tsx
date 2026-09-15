import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService, SkillGapResult } from '../../services/aiService';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  FolderGit2,
  Compass,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';

const TARGET_ROLES = [
  'Full-Stack Cloud & Distributed Systems Engineer',
  'AI / Machine Learning Solutions Architect',
  'Cloud Infrastructure & DevOps / SRE Engineer',
  'Quantitative Software Developer',
  'Frontend & Mobile Product Architect',
  'Cybersecurity & Zero-Trust Engineer',
];

export const SkillGapView: React.FC = () => {
  const { studentProfile, addLearningRoadmap, setActiveTab, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0]);
  const [experienceLevel, setExperienceLevel] = useState('Entry-Level / Graduate');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SkillGapResult | null>(null);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const skills = studentProfile.skills.map((s) => s.name);
      const result = await aiService.analyzeSkillGap(skills, selectedRole, experienceLevel);
      setAnalysis(result);
      showToast(`Analyzed skill gaps for "${selectedRole}"!`, 'success');
    } catch (err: any) {
      showToast('Error analyzing skill gap: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoadmapFromGap = async () => {
    if (!analysis) return;
    try {
      showToast('Generating personalized 8-week curriculum with AI...', 'info');
      const skills = studentProfile.skills.map((s) => s.name);
      const rmData = await aiService.generateRoadmap(selectedRole, skills, 8);

      const newRoadmap = {
        id: `roadmap_${Date.now()}`,
        title: rmData.title,
        role: rmData.role,
        totalWeeks: rmData.totalWeeks,
        progressPercentage: 0,
        milestones: rmData.milestones.map((m, idx) => ({
          ...m,
          completed: idx === 0, // first milestone marked active
        })),
        capstoneProject: rmData.capstoneProject,
      };

      addLearningRoadmap(newRoadmap);
      setActiveTab('roadmaps');
    } catch (err: any) {
      showToast('Error creating roadmap: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-blue-900/40 border border-emerald-200/60 dark:border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Role Benchmarking
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Skill Gap & Industry Readiness Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl font-normal leading-relaxed">
            Compare your verified academic profile against real-time job market requirements to discover high-priority missing competencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
              Verified Skills
            </span>
            <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
              {studentProfile.skills.length}
            </span>
          </div>
        </div>
      </div>

      {/* Target Role & Level Configuration Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" />
          Select Target Dream Career
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Target Role
            </label>
            <select
              id="target-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {TARGET_ROLES.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Target Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-normal text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Entry-Level / Graduate">Entry-Level / Campus Placement</option>
              <option value="Junior Engineer (1-2 yrs)">Junior Engineer (1-2 yrs)</option>
              <option value="Mid-Level Specialist (3+ yrs)">Mid-Level Specialist</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            id="run-skill-gap-analysis-btn"
            onClick={handleRunAnalysis}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auditing Requirements with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Skill Gap Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysis && (
        <div className="space-y-6">
          {/* Summary Match Score Header Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex flex-col items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <span className="text-xl font-bold tracking-tight leading-none tabular-nums">{analysis.matchPercentage}%</span>
                <span className="text-[9px] uppercase font-semibold mt-0.5">Match</span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  Readiness: {analysis.readinessLevel}
                </span>
                <h3 className="text-base font-bold tracking-tight text-gray-900 dark:text-white mt-1">
                  {analysis.targetRole}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {analysis.matchedSkills.length} matching skills • {analysis.missingCoreSkills.length} critical gaps to bridge
                </p>
              </div>
            </div>

            <button
              id="create-roadmap-from-gap-btn"
              onClick={handleCreateRoadmapFromGap}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Generate 8-Week AI Learning Roadmap</span>
            </button>
          </div>

          {/* Matched Skills vs Missing Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Validated Candidate Strengths ({analysis.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Core Skills with Hours to Bridge */}
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Missing Core Industry Skills ({analysis.missingCoreSkills.length})
              </h3>
              <div className="space-y-2.5">
                {analysis.missingCoreSkills.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {gap.skill}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                            gap.importance === 'Critical'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}
                        >
                          {gap.importance} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 font-normal">
                        {gap.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 shrink-0 flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3 text-amber-500" /> ~{gap.estimatedHoursToLearn} hrs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Project Idea to Close Gaps */}
          {analysis.projectIdea && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-900/80 border border-blue-200/80 dark:border-blue-800/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Recommended High-Impact Portfolio Project
                  </span>
                  <h4 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                    {analysis.projectIdea.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {analysis.projectIdea.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {analysis.projectIdea.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Value: {analysis.projectIdea.portfolioValue}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
