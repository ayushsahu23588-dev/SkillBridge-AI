import React from 'react';
import { Target, CheckCircle2, Award, Zap, TrendingUp } from 'lucide-react';

interface ResumeScorecardsProps {
  atsScore: number;
  skillMatch: number;
  resumeQuality: number;
  industryReadiness: number;
  onAnalyzeClick?: () => void;
  isAnalyzing?: boolean;
}

export const ResumeScorecards: React.FC<ResumeScorecardsProps> = ({
  atsScore,
  skillMatch,
  resumeQuality,
  industryReadiness,
}) => {
  const cards = [
    {
      id: 'ats-score-card',
      title: 'ATS Compatibility',
      score: atsScore,
      target: 'Target: 85%+',
      badge: atsScore >= 85 ? 'ATS Optimized' : 'Needs Optimization',
      badgeColor: atsScore >= 85 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      description: 'Parsability across Workday, Lever & Greenhouse systems',
      icon: <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'skill-match-card',
      title: 'Skill Match Index',
      score: skillMatch,
      target: 'Target: 80%+',
      badge: skillMatch >= 80 ? 'Tier-1 Aligned' : 'Skill Gaps Present',
      badgeColor: skillMatch >= 80 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      description: 'Overlap with top 50 enterprise tech job requirements',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'resume-quality-card',
      title: 'Resume Quality Score',
      score: resumeQuality,
      target: 'Target: 90%+',
      badge: resumeQuality >= 85 ? 'High Quality' : 'Action Required',
      badgeColor: resumeQuality >= 85 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      description: 'Google XYZ quantification, impact verbs & layout clarity',
      icon: <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'industry-readiness-card',
      title: 'Industry Readiness',
      score: industryReadiness,
      target: 'Target: 88%+',
      badge: industryReadiness >= 85 ? 'Job Ready' : 'In Progress',
      badgeColor: industryReadiness >= 85 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      description: 'Composite campus placement and hiring readiness index',
      icon: <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200/90 dark:border-white/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
                {card.icon}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {card.title}
            </p>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-black dark:text-white tabular-nums tracking-tight">
                {card.score}%
              </span>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {card.target}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${card.color} transition-all duration-700`}
                style={{ width: `${Math.min(card.score, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-700 dark:text-gray-300 font-normal mt-3 pt-2 border-t border-gray-100 dark:border-white/5 leading-relaxed">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
};
