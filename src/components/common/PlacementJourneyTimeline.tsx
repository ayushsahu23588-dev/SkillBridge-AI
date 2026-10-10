import React from 'react';
import { StudentProfile, ApplicationItem } from '../../types';
import {
  skillBridgeEngine,
  PlacementJourneyMilestone,
} from '../../services/skillBridgeIntelligenceEngine';
import {
  UserCheck,
  ShieldCheck,
  Target,
  Sparkles,
  Send,
  Filter,
  Bot,
  Award,
  CheckCircle2,
  Building,
  Check,
  Clock,
  Circle,
} from 'lucide-react';

interface PlacementJourneyTimelineProps {
  profile: StudentProfile;
  applications?: ApplicationItem[];
  title?: string;
  subtitle?: string;
}

export const PlacementJourneyTimeline: React.FC<PlacementJourneyTimelineProps> = ({
  profile,
  applications = [],
  title = 'Placement Journey Pipeline',
  subtitle = 'Track your progression from initial profile verification to corporate campus onboarding.',
}) => {
  const milestones: PlacementJourneyMilestone[] = skillBridgeEngine.getPlacementJourneyMilestones(
    profile,
    applications
  );

  const stageIcons: Record<string, React.ReactNode> = {
    Profile: <UserCheck className="w-3.5 h-3.5" />,
    Eligible: <ShieldCheck className="w-3.5 h-3.5" />,
    Applied: <Send className="w-3.5 h-3.5" />,
    Screening: <Filter className="w-3.5 h-3.5" />,
    Assessment: <Target className="w-3.5 h-3.5" />,
    Shortlisted: <Sparkles className="w-3.5 h-3.5" />,
    Interview: <Bot className="w-3.5 h-3.5" />,
    Selected: <Award className="w-3.5 h-3.5" />,
    Offer: <CheckCircle2 className="w-3.5 h-3.5" />,
    Joined: <Building className="w-3.5 h-3.5" />,
  };

  const completedCount = milestones.filter((m) => m.status === 'COMPLETED').length;

  return (
    <div
      id="placement-journey-timeline-root"
      className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 sm:p-7 shadow-sm space-y-6 font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1.5 border border-blue-200 dark:border-blue-800/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Campus Placement Lifecycle</span>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-2xl bg-[#D4F73C]/20 text-[#3f680a] dark:text-[#D4F73C] text-xs font-extrabold border border-[#D4F73C]/30">
            Stage {Math.min(10, completedCount + 1)} of 10
          </span>
        </div>
      </div>

      {/* Responsive Horizontal / Vertical Stepper */}
      <div className="relative">
        {/* Desktop Step Flow */}
        <div className="hidden lg:grid grid-cols-10 gap-1.5 relative">
          {/* Connector Line behind steps */}
          <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200 dark:bg-white/10 -z-0" />

          {milestones.map((m, idx) => {
            const isCompleted = m.status === 'COMPLETED';
            const isCurrent = m.status === 'CURRENT';

            return (
              <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isCurrent
                      ? 'bg-[#181920] dark:bg-purple-600 text-[#D4F73C] ring-4 ring-[#D4F73C]/30 shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stageIcons[m.stage]}
                </div>

                <div className="mt-3 space-y-0.5">
                  <p
                    className={`text-[11px] font-bold tracking-tight ${
                      isCurrent
                        ? 'text-purple-600 dark:text-[#D4F73C]'
                        : isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {m.stage}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                    {m.completedDate || (isCurrent ? 'In-Progress' : 'Next Step')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Step List */}
        <div className="lg:hidden space-y-3">
          {milestones.map((m, idx) => {
            const isCompleted = m.status === 'COMPLETED';
            const isCurrent = m.status === 'CURRENT';

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40 ring-1 ring-purple-400/30'
                    : isCompleted
                    ? 'bg-gray-50/60 dark:bg-white/5 border-gray-200 dark:border-white/5'
                    : 'bg-white dark:bg-white/2 border-gray-100 dark:border-white/5 opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-purple-600 text-[#D4F73C]'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stageIcons[m.stage]}
                </div>

                <div className="space-y-0.5 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-bold ${
                        isCurrent
                          ? 'text-purple-600 dark:text-[#D4F73C]'
                          : isCompleted
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {m.label}
                    </h4>
                    <span
                      className={`text-[10px] font-bold ${
                        isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isCurrent
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {m.completedDate || (isCurrent ? 'Active Now' : 'Upcoming')}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {m.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
