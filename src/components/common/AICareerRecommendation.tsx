import React, { useState } from 'react';
import { CareerRecommendationExplanation } from '../../services/aiFallbackService';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  BookOpen,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AICareerRecommendationProps {
  career: CareerRecommendationExplanation;
  isSelected?: boolean;
  onSelectRole?: (role: string) => void;
}

export const AICareerRecommendation: React.FC<AICareerRecommendationProps> = ({
  career,
  isSelected = false,
  onSelectRole,
}) => {
  const [showExplanation, setShowExplanation] = useState(isSelected);

  return (
    <div
      className={`rounded-3xl border transition-all font-sans p-5 sm:p-6 ${
        isSelected
          ? 'bg-white dark:bg-[#14151B] border-[#84B000] dark:border-[#D4F73C] shadow-lg ring-1 ring-[#D4F73C]/50'
          : 'bg-white dark:bg-[#14151B] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              {career.role}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#D4F73C] text-[#111216]">
              {career.matchScore}% Match
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            {career.whyThisCareer}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
            <span>Why This Career?</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onSelectRole && (
            <button
              onClick={() => onSelectRole(career.role)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-[#D4F73C] hover:bg-[#c4e82b] text-[#111216]'
              }`}
            >
              {isSelected ? 'Active Target' : 'Set as Goal'}
            </button>
          )}
        </div>
      </div>

      {showExplanation && (
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/5 space-y-4 text-xs animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white block mb-0.5">
              Career Alignment:
            </span>
            <span>{career.careerAlignment}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matching Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.matchingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Missing Skills to Learn</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 text-amber-800 dark:text-amber-300 font-semibold text-[11px] border border-amber-500/20"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Relevant Projects */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Relevant Projects</span>
              </h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                {career.relevantProjects.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Learning */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                <span>Recommended Learning</span>
              </h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                {career.recommendedLearning.slice(0, 3).map((l, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-purple-500" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Internship Types */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                <span>Target Internship Types</span>
              </h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                {career.suggestedInternshipTypes.map((t, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
