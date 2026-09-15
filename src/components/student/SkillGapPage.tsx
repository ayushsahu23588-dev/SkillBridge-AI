import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';
import {
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Compass,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Check,
  RefreshCw,
  X,
  Clock,
  BookOpen,
} from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { SkillGapExplanationData } from '../../services/aiFallbackService';

export const SkillGapPage: React.FC = () => {
  const {
    studentProfile,
    assessmentSession,
    selectedCareerRole,
    setSelectedCareerRole,
    navigate,
    showToast,
  } = useApp();

  const [activeTabRole, setActiveTabRole] = useState<string>(
    selectedCareerRole || 'Software Developer'
  );

  // Gemini AI "Why is this a gap?" Reasoning State
  const [selectedSkillForReasoning, setSelectedSkillForReasoning] = useState<string | null>(null);
  const [explanationData, setExplanationData] = useState<SkillGapExplanationData | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleOpenReasoning = async (skillName: string, current = 45, target = 80) => {
    setSelectedSkillForReasoning(skillName);
    setIsLoadingExplanation(true);
    try {
      const data = await geminiService.generateSkillGapExplanation(
        skillName,
        current,
        target,
        activeTabRole
      );
      setExplanationData(data);
    } catch {
      // fallback handles
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const availableRoles = [
    'Software Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'AI/ML Developer',
    'Cloud & DevOps Engineer',
  ];

  // Helper to convert skill level to numeric score
  const getSkillNumericScore = (s: { level?: string; score?: number; verifiedScore?: number }) => {
    if (typeof s.score === 'number') return s.score;
    if (typeof s.verifiedScore === 'number') return s.verifiedScore;
    if (s.level === 'Expert') return 90;
    if (s.level === 'Advanced') return 75;
    if (s.level === 'Intermediate') return 60;
    return 45;
  };

  // Calculate dynamic skill gap data based on student skills and target role
  const gapAnalysis = useMemo(() => {
    const skillsMap: Record<string, number> = {};
    (studentProfile.skills || []).forEach((s) => {
      skillsMap[s.name] = getSkillNumericScore(s);
    });
    const gaps = aiService.calculateSkillGap(skillsMap, activeTabRole);
    const avgScore = Math.round(
      gaps.reduce((sum, g) => sum + Math.max(0, 100 - Math.max(0, g.gap)), 0) / (gaps.length || 1)
    );
    const priorityGaps = gaps.filter((g) => g.status === 'High Priority' || g.gap > 15);
    return {
      allGaps: gaps,
      priorityGaps,
      overallReadiness: Math.min(95, Math.max(50, avgScore)),
    };
  }, [studentProfile.skills, activeTabRole]);

  // Generate career recommendations
  const careerRecommendations = useMemo(() => {
    const skillsMap: Record<string, number> = {};
    (studentProfile.skills || []).forEach((s) => {
      skillsMap[s.name] = getSkillNumericScore(s);
    });
    return aiService.generateCareerRecommendations(skillsMap);
  }, [studentProfile.skills]);

  // Overall readiness calculation for selected role
  const readinessScore = gapAnalysis.overallReadiness;
  const criticalGaps = gapAnalysis.priorityGaps;

  const handleSelectRole = (role: string) => {
    setActiveTabRole(role);
    setSelectedCareerRole(role);
    showToast(`Switched target benchmark to ${role}`, 'info');
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>AI Skill Gap Analyzer • Real-Time Industry Benchmark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Skill Gap & Industry Readiness
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Based on your latest verified skill assessment data, we compare your evaluated proficiency against requirements from 280+ active hiring partners to generate actionable improvement steps.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              id="retake-assessment-btn"
              onClick={() => navigate('/student/assessment')}
              className="px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-gray-200 dark:border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Assessment</span>
            </button>
            <button
              id="generate-career-roadmap-btn"
              onClick={() => {
                setSelectedCareerRole(activeTabRole);
                navigate('/student/roadmap');
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>View 5-Phase Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Target Role Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Target Career Benchmark:
            </span>
            <span className="text-xs text-gray-400">
              Target role is synced with your Career Roadmap
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTabRole === role
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-sm'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-500" />
            Target Benchmark
          </span>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">
            {activeTabRole}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Calibrated against entry-level job descriptions from partner companies including TCS, NovaCloud, and Wipro.
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Calculated Readiness Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-[#4D7C0F] dark:text-[#D4F73C] tabular-nums">
              {readinessScore}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {readinessScore >= 75 ? 'Placement Ready' : 'In Acceleration'}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-[#D4F73C] rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-1.5">
            <span>Threshold: 75%</span>
            <span>Delta: {readinessScore >= 75 ? '+Ready' : `-${75 - readinessScore}% to Goal`}</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-xs">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Priority Gaps To Close
          </span>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {criticalGaps.slice(0, 4).map((item, i) => (
              <button
                key={i}
                onClick={() => handleOpenReasoning(item.skill, 45, 80)}
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                title="Click to view AI analysis of why this is a priority gap"
              >
                <span>{item.skill}</span>
                <span className="text-[10px] opacity-75">(-{item.gap}%)</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Targeted in Phases 1 & 2 of your personal learning roadmap.
          </p>
        </div>
      </div>

      {/* Top Strengths and Competitive Advantages */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Verified Competency Strengths
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {assessmentSession?.topStrengths?.map((strength, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {strength.category}
                </span>
                <div className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5">
                  {strength.skill}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {strength.score}% Proficiency
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Comparison Matrix Table */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Skill Comparison Matrix: {activeTabRole}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Exact delta between your current verified score and target industry threshold.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full w-fit">
            {gapAnalysis.allGaps.length} Skills Evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="py-3.5 px-6">Skill Name</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Current Score</th>
                <th className="py-3.5 px-6">Required Benchmark</th>
                <th className="py-3.5 px-6">Gap Delta</th>
                <th className="py-3.5 px-6">Priority</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">AI Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
              {gapAnalysis.allGaps.map((row, idx) => {
                let statusBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-500/30';
                const statusStr = row.status as string;
                if (statusStr === 'Improve' || statusStr === 'Needs Improvement' || statusStr === 'Moderate Gap') {
                  statusBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-500/30';
                } else if (statusStr === 'High Priority' || statusStr === 'Critical Gap') {
                  statusBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-500/30';
                }

                return (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      <div>{row.skill}</div>
                      {row.whyItMatters && (
                        <div className="text-[11px] font-normal text-gray-400 mt-0.5 max-w-sm">
                          {row.whyItMatters}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                      {row.category || 'Technical'}
                    </td>
                    <td className="py-4 px-6 tabular-nums font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.currentLevel >= 75
                                ? 'bg-emerald-500'
                                : row.currentLevel >= 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, row.currentLevel)}%` }}
                          />
                        </div>
                        <span>{row.currentLevel}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 tabular-nums font-semibold text-gray-600 dark:text-gray-300">
                      {row.requiredLevel}%
                    </td>
                    <td className="py-4 px-6 tabular-nums font-semibold">
                      {row.gap <= 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Surplus (+{Math.abs(row.gap)}%)
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          -{row.gap}% Gap
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          row.priority === 'Critical' || row.priority === 'High'
                            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
                            : row.priority === 'Medium'
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                            : 'text-gray-500 bg-gray-100 dark:bg-white/5'
                        }`}
                      >
                        {row.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                        {row.status || (row.gap <= 0 ? 'Strong' : 'Improve')}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {row.gap > 0 ? (
                        <button
                          onClick={() => handleOpenReasoning(row.skill, row.currentLevel, row.requiredLevel)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] flex items-center gap-1.5 border border-blue-500/30 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#84B000] dark:text-[#D4F73C]" />
                          <span>Why is this a gap?</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Standard Met
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI Career Path Recommendations */}
      <section className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4D7C0F] dark:text-[#D4F73C]" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                AI Career Path Recommendations
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ranked by compatibility with your current verified skill profile.
            </p>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full w-fit">
            Calibrated against 2026 hiring demand
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {careerRecommendations.map((career) => (
            <div
              key={career.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                activeTabRole.toLowerCase().includes(career.title.toLowerCase())
                  ? 'bg-[#D4F73C]/5 dark:bg-[#D4F73C]/5 border-[#D4F73C]/60 shadow-xs'
                  : 'bg-gray-50/50 dark:bg-white/[0.02] border-gray-200 dark:border-white/10 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {career.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Demand: <b className="text-emerald-600 dark:text-emerald-400">{career.marketDemand}</b></span>
                      <span>•</span>
                      <span>Avg CTC: <b className="text-gray-800 dark:text-gray-200">{career.avgSalaryRange}</b></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-[#4D7C0F] dark:text-[#D4F73C] tabular-nums">
                      {career.matchPercentage}%
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Match</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                  {career.whyRecommended}
                </p>

                <div className="mt-3.5 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase mr-1 self-center">Strengths:</span>
                    {career.strongestMatchingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase mr-1 self-center">Missing:</span>
                    {career.missingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleSelectRole(career.targetRoleKey || career.title)}
                  className={`text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    activeTabRole.toLowerCase().includes(career.title.toLowerCase())
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {activeTabRole.toLowerCase().includes(career.title.toLowerCase()) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Benchmark Role</span>
                    </>
                  ) : (
                    <>
                      <span>Set as Active Target</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setSelectedCareerRole(career.targetRoleKey || career.title);
                    navigate('/student/roadmap');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Build Roadmap</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Footer Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-[#D4F73C]/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-[#D4F73C]/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Ready to convert these gap recommendations into action?
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Open the 5-phase career roadmap with milestone tracking, verified projects, and direct internship access.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/student/internships')}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#111216] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer"
          >
            Explore Matching Jobs
          </button>
          <button
            onClick={() => {
              setSelectedCareerRole(activeTabRole);
              navigate('/student/roadmap');
            }}
            className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-[#111216] text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open 5-Phase Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Gemini AI Skill Gap Reasoning Modal (Step 10 Requirement) */}
      {selectedSkillForReasoning && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center font-sans">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setSelectedSkillForReasoning(null);
              setExplanationData(null);
            }}
          />

          <div className="relative w-full max-w-2xl bg-white dark:bg-[#14151B] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden transform transition-all p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 text-[#84B000] dark:text-[#D4F73C]" />
                  <span>AI Skill Gap Reasoning</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Why is <span className="text-blue-600 dark:text-blue-400">{selectedSkillForReasoning}</span> a Gap?
                </h3>
                <p className="text-xs text-gray-500">
                  Benchmarked for <strong className="text-gray-800 dark:text-gray-200">{activeTabRole}</strong> requirements
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedSkillForReasoning(null);
                  setExplanationData(null);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingExplanation || !explanationData ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-gray-500 font-semibold">
                  Synthesizing industry expectations and corporate interview standards...
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* 1. Why Industry Values */}
                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40">
                  <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-xs flex items-center gap-1.5 mb-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Why Industry Values This Skill
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {explanationData.whyIndustryValues}
                  </p>
                </div>

                {/* 2. What Happens If You Lack It */}
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40">
                  <h4 className="font-extrabold text-rose-900 dark:text-rose-300 text-xs flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    What Happens If You Lack It (Hiring Impact)
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {explanationData.riskOfLacking}
                  </p>
                </div>

                {/* 3. Time to Learn & Recommended Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Estimated Time to Learn
                    </span>
                    <p className="font-extrabold text-gray-900 dark:text-white mt-1">
                      {explanationData.timeToLearn}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Best Learning Project to Close It
                    </span>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                      {explanationData.recommendedProject}
                    </p>
                  </div>
                </div>

                {/* Recommended Milestones */}
                {explanationData.recommendedMilestones && explanationData.recommendedMilestones.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Target Milestone Sequence
                    </span>
                    <div className="space-y-1">
                      {explanationData.recommendedMilestones.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/5">
                  <button
                    onClick={() => {
                      setSelectedSkillForReasoning(null);
                      setExplanationData(null);
                    }}
                    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSkillForReasoning(null);
                      setExplanationData(null);
                      setSelectedCareerRole(activeTabRole);
                      navigate('/student/roadmap');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Add to 5-Phase Roadmap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
