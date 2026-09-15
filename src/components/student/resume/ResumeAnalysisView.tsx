import React from 'react';
import {
  FullResumeAnalysisResult,
} from '../../../services/aiService';
import {
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Key,
  Layers,
  Sparkles,
  TrendingUp,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ResumeAnalysisViewProps {
  analysis: FullResumeAnalysisResult | null;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onApplySkillsToProfile: () => void;
}

export const ResumeAnalysisView: React.FC<ResumeAnalysisViewProps> = ({
  analysis,
  onRunAnalysis,
  isAnalyzing,
  onApplySkillsToProfile,
}) => {
  if (!analysis) {
    return (
      <div className="p-12 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-base font-bold text-black dark:text-white">
            Resume Has Not Been Analyzed Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 max-w-md mx-auto font-normal">
            Run the Google Gemini ATS engine to extract your complete competency graph, benchmark experience bullet metrics, detect keyword gaps, and receive section-by-section ratings.
          </p>
        </div>
        <button
          id="trigger-first-analysis-btn"
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Auditing Resume...' : 'Analyze Resume with Gemini AI'}</span>
        </button>
      </div>
    );
  }

  const getRatingBadge = (rating: string) => {
    switch (rating?.toLowerCase()) {
      case 'exceptional':
      case 'excellent':
      case 'production-grade':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'proficient':
      case 'good':
      case 'solid academic':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Banner with Sync */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-bold text-black dark:text-white">
              ATS Audit Complete • Composite Score: {analysis.overallScore}%
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
              {analysis.skillsDetected.length} validated skills extracted. Top tier candidate alignment.
            </p>
          </div>
        </div>

        <button
          id="sync-analysis-to-profile-btn"
          onClick={onApplySkillsToProfile}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sync Skills & Score to Official Profile</span>
        </button>
      </div>

      {/* Grid: Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Key Strengths ({analysis.strengths.length})
            </h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.strengths.map((str, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-medium text-black dark:text-gray-200 flex items-start gap-2 leading-relaxed"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Areas Holding You Back ({analysis.weaknesses.length})
            </h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.weaknesses.map((weak, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs font-medium text-black dark:text-gray-200 flex items-start gap-2 leading-relaxed"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills Section: Detected vs Missing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detected Skills */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Skills Detected by ATS ({analysis.skillsDetected.length})
              </h3>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
              Verified by AI
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.skillsDetected.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-black dark:text-white shadow-2xs"
              >
                <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>{skill.name}</span>
                <span className="text-[10px] text-gray-700 dark:text-gray-300 font-normal">
                  ({skill.category})
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Missing High-Demand Skills
              </h3>
            </div>
            <span className="text-[11px] text-red-600 font-semibold">Priority Gap</span>
          </div>

          <div className="space-y-2">
            {analysis.missingSkills.map((mskill, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-red-50/30 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-black dark:text-gray-100">{mskill}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                  Add to Resume
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section-by-Section Deep Analysis: Experience, Education, Projects, Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Experience Analysis */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                Experience & Bullet Impact
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRatingBadge(
                analysis.experienceAnalysis.rating
              )}`}
            >
              {analysis.experienceAnalysis.rating}
            </span>
          </div>

          <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
            {analysis.experienceAnalysis.feedback}
          </p>

          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Bullet Point Critiques:
            </p>
            {analysis.experienceAnalysis.bulletPointsAnalysis.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs text-black dark:text-gray-200 font-normal leading-relaxed"
              >
                • {item}
              </div>
            ))}
          </div>
        </div>

        {/* Education & Projects Analysis */}
        <div className="space-y-4">
          {/* Education */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-black dark:text-white">Education Analysis</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRatingBadge(
                  analysis.educationAnalysis.rating
                )}`}
              >
                {analysis.educationAnalysis.rating}
              </span>
            </div>
            <p className="text-xs font-bold text-black dark:text-white">
              {analysis.educationAnalysis.verifiedDegree}
            </p>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-normal leading-relaxed">
              {analysis.educationAnalysis.feedback}
            </p>
          </div>

          {/* Projects */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-black dark:text-white">Project Analysis</h3>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRatingBadge(
                  analysis.projectAnalysis.rating
                )}`}
              >
                {analysis.projectAnalysis.rating}
              </span>
            </div>
            <p className="text-xs text-gray-800 dark:text-gray-200 font-normal leading-relaxed">
              {analysis.projectAnalysis.feedback}
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 font-medium">
              ⭐ Standout: {analysis.projectAnalysis.highlight}
            </div>
          </div>
        </div>
      </div>

      {/* Keyword Analysis Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                ATS Keyword Frequency & Optimization
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-normal">
                Presence of tier-1 recruiter algorithmic keyword anchors
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Keyword Density Score:
            </span>
            <span className="text-base font-extrabold text-black dark:text-white tabular-nums">
              {analysis.keywordAnalysis.densityScore}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Present Keywords */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Keywords Detected in Resume ({analysis.keywordAnalysis.presentKeywords.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywordAnalysis.presentKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-black dark:text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Missing High-Value Keywords ({analysis.keywordAnalysis.missingCriticalKeywords.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.keywordAnalysis.missingCriticalKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                >
                  +{kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
