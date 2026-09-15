import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Target,
  Briefcase,
  Award,
  TrendingUp,
  FileText,
  Bot,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Calendar as CalendarIcon,
  Layers,
  Zap,
  History,
  Clock,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Star,
  Plus,
  Play,
  Check,
  Code2,
  Cpu,
  Palette,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { motion } from 'motion/react';
import { AIInsightCard } from '../common/AIInsightCard';

export const StudentDashboard: React.FC = () => {
  const { studentProfile, jobs, applications, setActiveTab, isDarkMode, navigate } = useApp();

  const userApps = applications.filter((a) => a.studentId === studentProfile.id);
  const activeRoadmap = studentProfile.activeRoadmaps[0];
  const recommendedJobs = jobs.slice(0, 3);

  // Calendar interactive state
  const [selectedDay, setSelectedDay] = useState<number>(17);
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('We');
  const [monthIndex, setMonthIndex] = useState<number>(1);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState<boolean>(false);

  const months = ['August, 2026', 'September, 2026', 'October, 2026'];

  // Weekly hours activity data matching the reference
  const weeklyHours = [
    { day: 'Su', hours: 2.2, formatted: '2h 15m', isPeak: false },
    { day: 'Mo', hours: 4.8, formatted: '4h 50m', isPeak: false },
    { day: 'Tu', hours: 6.4, formatted: '6h 25m', isPeak: false },
    { day: 'We', hours: 8.75, formatted: '8h 45m', isPeak: true },
    { day: 'Th', hours: 3.1, formatted: '3h 10m', isPeak: false },
    { day: 'Fr', hours: 6.2, formatted: '6h 15m', isPeak: false },
    { day: 'Sa', hours: 5.5, formatted: '5h 30m', isPeak: false },
  ];

  // Radar chart data for student skillset
  const skillCategoryData = [
    { subject: 'Frontend', score: 95, fullMark: 100 },
    { subject: 'Backend', score: 88, fullMark: 100 },
    { subject: 'Cloud & DevOps', score: 78, fullMark: 100 },
    { subject: 'AI & Data', score: 91, fullMark: 100 },
    { subject: 'Database & SQL', score: 86, fullMark: 100 },
    { subject: 'System Design', score: 82, fullMark: 100 },
  ];

  // Featured Skill Tracks (matching the top row in reference)
  const featuredTracks = [
    {
      id: 'track-1',
      title: 'Distributed Cloud Architecture',
      lessons: '12 Milestones',
      rating: '4.8',
      type: 'Cloud & DevOps',
      iconColor: 'bg-[#FFF3EC] text-[#FF6B35] dark:bg-[#FF6B35]/15',
      icon: <Cpu className="w-5 h-5 text-[#FF6B35]" />,
    },
    {
      id: 'track-2',
      title: 'Full-Stack AI Engineering',
      lessons: '15 Milestones',
      rating: '5.0',
      type: 'AI & LLMs',
      iconColor: 'bg-[#F0FDE4] text-[#4D7C0F] dark:bg-[#D4F73C]/15',
      icon: <Code2 className="w-5 h-5 text-[#4D7C0F] dark:text-[#D4F73C]" />,
    },
    {
      id: 'track-3',
      title: 'Scalable Microservices & Kafka',
      lessons: '8 Milestones',
      rating: '4.6',
      type: 'Backend & Data',
      iconColor: 'bg-[#F3E8FF] text-[#7E22CE] dark:bg-[#7E22CE]/15',
      icon: <Layers className="w-5 h-5 text-[#7E22CE]" />,
    },
  ];

  // Daily Schedule items matching reference
  const dailySchedule = [
    {
      id: 'sched-1',
      title: 'System Design Architecture',
      subtitle: 'Lecture • Class',
      iconBg: 'bg-[#FFF3EC] text-[#FF6B35]',
      icon: <Layers className="w-4 h-4" />,
      action: () => navigate('/student/roadmap'),
    },
    {
      id: 'sched-2',
      title: 'AI Mock Interview Prep',
      subtitle: 'Group • Technical Test',
      iconBg: 'bg-[#F3E8FF] text-[#7E22CE]',
      icon: <Bot className="w-4 h-4" />,
      action: () => navigate('/student/interview-prep'),
    },
    {
      id: 'sched-3',
      title: 'Faculty 1-on-1 Mentorship',
      subtitle: 'Mentorship • Slot Review',
      iconBg: 'bg-[#F0FDE4] text-[#4D7C0F] dark:text-[#D4F73C]',
      icon: <ShieldCheck className="w-4 h-4" />,
      action: () => navigate('/student/roadmap'),
    },
    {
      id: 'sched-4',
      title: 'Distributed Web & Redis',
      subtitle: 'Lecture • Practice Test',
      iconBg: 'bg-[#FEF2F2] text-[#DC2626]',
      icon: <Code2 className="w-4 h-4" />,
      action: () => navigate('/student/skill-gap'),
    },
  ];

  // Assignments / Milestones matching reference
  const assignments = [
    {
      id: 'asg-1',
      title: 'Methods of data / Capstone Repo',
      due: '02 Sep, 10:30 AM',
      status: 'in progress',
      badgeClass: 'bg-[#F3E8FF] text-[#7E22CE] dark:bg-[#7E22CE]/20 dark:text-purple-300',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'asg-2',
      title: 'ATS Resume Optimization',
      due: '14 Aug, 12:45 AM',
      status: 'completed',
      badgeClass: 'bg-[#F0FDE4] text-[#4D7C0F] dark:bg-[#D4F73C]/20 dark:text-[#D4F73C]',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'asg-3',
      title: 'NovaCloud Systems Tech Round 1',
      due: '04 Sep, 14:00 PM',
      status: 'upcoming',
      badgeClass: 'bg-[#FEFCE8] text-[#CA8A04] dark:bg-amber-950/40 dark:text-amber-300',
      iconBg: 'bg-amber-100 text-amber-600',
    },
  ];

  // Calendar dates generation
  const calendarDays = [
    { day: 27, inMonth: false },
    { day: 28, inMonth: false },
    { day: 29, inMonth: false },
    { day: 30, inMonth: false },
    { day: 31, inMonth: false },
    { day: 1, inMonth: true },
    { day: 2, inMonth: true },
    { day: 3, inMonth: true },
    { day: 4, inMonth: true },
    { day: 5, inMonth: true },
    { day: 6, inMonth: true },
    { day: 7, inMonth: true },
    { day: 8, inMonth: true },
    { day: 9, inMonth: true },
    { day: 10, inMonth: true },
    { day: 11, inMonth: true },
    { day: 12, inMonth: true },
    { day: 13, inMonth: true },
    { day: 14, inMonth: true },
    { day: 15, inMonth: true },
    { day: 16, inMonth: true },
    { day: 17, inMonth: true, isEvent: true },
    { day: 18, inMonth: true },
    { day: 19, inMonth: true },
    { day: 20, inMonth: true },
    { day: 21, inMonth: true },
    { day: 22, inMonth: true },
    { day: 23, inMonth: true },
    { day: 24, inMonth: true },
    { day: 25, inMonth: true },
    { day: 26, inMonth: true },
    { day: 27, inMonth: true },
    { day: 28, inMonth: true },
    { day: 29, inMonth: true },
    { day: 30, inMonth: true },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Welcome Greeting Header & Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-2">
            <span>Welcome back, {studentProfile.name.split(' ')[0]}</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-black dark:text-gray-300 mt-1 font-medium leading-relaxed">
            Industry Readiness: <strong className="font-bold text-black dark:text-white">{studentProfile.industryReadinessScore}%</strong> • <span className="text-gray-800 dark:text-gray-300">Top 3% of your university cohort.</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="hero-scan-resume-btn"
            onClick={() => navigate('/student/resume-studio')}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#181920] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-300 dark:border-white/10 text-xs font-bold text-black dark:text-gray-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>AI Resume Studio</span>
          </button>
          <button
            id="hero-mock-interview-btn"
            onClick={() => navigate('/student/interview-prep')}
            className="px-3.5 py-2 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#121316] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Mock Interview</span>
          </button>
          <button
            id="hero-view-roadmap-btn"
            onClick={() => navigate('/student/roadmap')}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-[#181920] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-300 dark:border-white/10 text-xs font-bold text-black dark:text-gray-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-500" />
            <span>Roadmap</span>
          </button>
        </div>
      </div>

      {/* AI Career Insight Card (Step 10 Requirement) */}
      <AIInsightCard onViewAnalysis={() => navigate('/student/skill-gap')} />

      {/* 2. Top Highlights Row (Featured Skill Tracks + Promo Banner as seen in reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 3 Cards: New Courses / Active Tracks */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base font-bold text-black dark:text-white tracking-tight">
              Active Skill Tracks
            </h2>
            <button
              id="view-all-tracks-btn"
              onClick={() => navigate('/student/roadmap')}
              className="text-xs font-bold text-black hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => navigate('/student/roadmap')}
                className="soft-card p-4 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${track.iconColor}`}>
                      {track.icon}
                    </div>
                    <span className="text-[11px] font-bold text-gray-800 dark:text-gray-300">
                      {track.lessons}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#D4F73C] transition-colors line-clamp-2 tracking-tight">
                    {track.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-black dark:text-gray-200 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{track.rating}</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-300 font-semibold text-[11px] truncate max-w-[100px]">
                    {track.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Go Premium / AI FastTrack banner matching reference */}
        <div className="lg:col-span-4">
          <div className="h-full rounded-3xl bg-[#18191E] text-white p-5 flex flex-col justify-between relative overflow-hidden shadow-xl border border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[#D4F73C] text-[#121316] flex items-center justify-center font-bold text-xs">
                  EB
                </div>
                <span className="text-xs font-semibold tracking-tight text-white">
                  EduBridge AI
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Unlock AI FastTrack
              </h3>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-normal">
                Explore 25k+ verified internships with direct campus referrals & AI interview simulator.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <button
                id="get-access-banner-btn"
                onClick={() => navigate('/student/internships')}
                className="px-4 py-2 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#121316] text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Get Access
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                🚀
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Analytics Cards Grid (All 6 key metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* ATS Resume Score */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">ATS Resume</span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-black dark:text-white">
              {studentProfile.atsResumeScore}%
            </span>
            <p className="text-[11px] text-purple-700 dark:text-purple-400 font-bold mt-0.5">
              High ATS Pass
            </p>
          </div>
        </div>

        {/* Skill Score */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">Skill Score</span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-black dark:text-white">
              {studentProfile.aiSkillScore}
              <span className="text-xs text-gray-700 dark:text-gray-400 font-bold">/100</span>
            </span>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-bold mt-0.5">
              10 Verified
            </p>
          </div>
        </div>

        {/* Industry Readiness */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">Industry Readiness</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-black dark:text-white">
              {studentProfile.industryReadinessScore}%
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
              +4% This Month
            </p>
          </div>
        </div>

        {/* Active Applications */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">Applications</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-black dark:text-white">
              {userApps.length}
            </span>
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-bold mt-0.5">
              1 Interview Set
            </p>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">Roadmap</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-black dark:text-white">
              {activeRoadmap?.progressPercentage || 68}%
            </span>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold mt-0.5">
              Phase 3 Active
            </p>
          </div>
        </div>

        {/* Internship Status */}
        <div className="soft-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black dark:text-gray-300 tracking-tight">Internship Status</span>
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-base sm:text-lg font-extrabold text-black dark:text-white truncate block tracking-tight">
              NovaCloud
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
              Round 1 Shortlist
            </p>
          </div>
        </div>
      </div>

      {/* 4. Core Middle Grid: Hours Activity + Daily Schedule + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hours Activity Chart (left) - Recreated faithfully from reference */}
        <div className="lg:col-span-5 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Hours Activity
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[11px] font-bold text-black dark:text-gray-200">
                  Weekly ▾
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3% increase than last week</span>
            </div>
          </div>

          {/* Vertical Bar Chart with Peak Tooltip Pill */}
          <div className="mt-8 mb-2 relative">
            <div className="h-48 flex items-end justify-between px-3 gap-2 sm:gap-3">
              {weeklyHours.map((item) => {
                const isSelected = selectedWeekDay === item.day;
                const heightPercent = (item.hours / 10) * 100;
                return (
                  <div
                    key={item.day}
                    onClick={() => setSelectedWeekDay(item.day)}
                    className="flex-1 flex flex-col items-center gap-2 cursor-pointer group relative"
                  >
                    {/* Tooltip bubble on peak/selected day */}
                    {(item.isPeak || isSelected) && (
                      <div className="absolute -top-11 z-10 whitespace-nowrap px-2.5 py-1 rounded-xl bg-[#18191E] text-white text-[10px] font-semibold shadow-lg flex items-center gap-1.5 border border-white/10 animate-in fade-in zoom-in-90">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4F73C]" />
                        <span>{item.formatted}</span>
                      </div>
                    )}

                    {/* Bar Pillar */}
                    <div className="w-2.5 sm:w-3 bg-gray-100 dark:bg-white/5 rounded-full h-36 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-full transition-all duration-300 ${
                          item.isPeak || isSelected
                            ? 'bg-[#D4F73C] shadow-xs'
                            : 'bg-black dark:bg-white/40 group-hover:bg-gray-800'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <span
                      className={`text-[11px] transition-colors ${
                        isSelected || item.isPeak
                          ? 'text-black dark:text-white font-bold'
                          : 'text-gray-800 dark:text-gray-400 font-semibold'
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-800 dark:text-gray-400 font-semibold">
            <span>Avg: 5.3h daily</span>
            <span className="font-bold text-black dark:text-gray-200">Target: 35h/wk</span>
          </div>
        </div>

        {/* Daily Schedule List (center) */}
        <div className="lg:col-span-3 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Daily Schedule
              </h3>
              <span className="text-[10px] font-mono text-gray-800 dark:text-gray-400 font-bold">Today</span>
            </div>

            <div className="space-y-2.5">
              {dailySchedule.map((item) => (
                <div
                  key={item.id}
                  onClick={item.action}
                  className="p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-between gap-2.5 cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-black dark:text-white truncate tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-800 dark:text-gray-300 truncate font-medium">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-700 dark:text-gray-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <button
            id="view-full-schedule-btn"
            onClick={() => setIsCalendarModalOpen(true)}
            className="w-full mt-3 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-black dark:text-gray-200 transition-colors cursor-pointer"
          >
            Open Full Calendar
          </button>
        </div>

        {/* Mini Calendar Widget (right column top) */}
        <div className="lg:col-span-4 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1">
                <button
                  aria-label="Previous month"
                  onClick={() => setMonthIndex((prev) => Math.max(0, prev - 1))}
                  disabled={monthIndex === 0}
                  className="p-1 rounded-lg text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight">
                  {months[monthIndex]}
                </h3>
                <button
                  aria-label="Next month"
                  onClick={() => setMonthIndex((prev) => Math.min(months.length - 1, prev + 1))}
                  disabled={monthIndex === months.length - 1}
                  className="p-1 rounded-lg text-black hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C]">
                1 Round Scheduled
              </span>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-800 dark:text-gray-400 mb-1">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Calendar numbers grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarDays.slice(0, 28).map((d, idx) => {
                const isSelected = selectedDay === d.day && d.inMonth;
                const isHighlight = d.isEvent;
                return (
                  <button
                    key={idx}
                    onClick={() => d.inMonth && setSelectedDay(d.day)}
                    className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-[11px] transition-all ${
                      !d.inMonth
                        ? 'text-gray-400 dark:text-gray-600 font-normal'
                        : isSelected || isHighlight
                        ? 'bg-[#D4F73C] text-[#121316] font-bold shadow-xs'
                        : 'text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 font-semibold'
                    }`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-gray-800 dark:text-gray-400 font-semibold">Selected Day:</span>
            <span className="font-bold text-black dark:text-white">
              Sep {selectedDay} • Tech Mock Round
            </span>
          </div>
        </div>
      </div>

      {/* 5. Course You're Taking & Assignments Tracker Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Course You're Taking (Active Roadmaps / Courses) */}
        <div className="lg:col-span-7 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Course You&apos;re Taking
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[11px] font-bold text-black dark:text-gray-200">
                  Active ▾
                </span>
                <button
                  id="add-course-btn"
                  onClick={() => navigate('/student/roadmap')}
                  className="w-6 h-6 rounded-full bg-[#D4F73C] text-[#121316] flex items-center justify-center font-bold text-xs hover:scale-105 transition-transform cursor-pointer"
                  title="Explore new roadmaps"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Course row items */}
            <div className="space-y-3">
              {/* Row 1 */}
              <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300 flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black dark:text-white tracking-tight">
                      Full-Stack AI Architecture
                    </h4>
                    <p className="text-[11px] text-gray-800 dark:text-gray-300 font-medium">
                      Dr. Evelyn Vance • System Design Lead
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-gray-800 dark:text-gray-400 font-semibold">Remaining</p>
                    <p className="text-xs font-bold tabular-nums text-black dark:text-gray-200">
                      6h 45m
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                    <span>45%</span>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black dark:text-white tracking-tight">
                      Distributed Cloud & Kubernetes
                    </h4>
                    <p className="text-[11px] text-gray-800 dark:text-gray-300 font-medium">
                      Prof. Rajesh Kumar • SRE Director
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] text-gray-800 dark:text-gray-400 font-semibold">Remaining</p>
                    <p className="text-xs font-bold tabular-nums text-black dark:text-gray-200">
                      10h 12m
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-800 dark:text-gray-400 font-semibold">
              Active Capstone: <strong className="font-bold text-black dark:text-white">{activeRoadmap?.capstoneProject.title || 'Multi-agent RAG System'}</strong>
            </span>
            <button
              onClick={() => navigate('/student/roadmap')}
              className="font-bold text-blue-700 dark:text-[#D4F73C] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Continue Track</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Assignments & Milestone Tasks (Right) */}
        <div className="lg:col-span-5 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Assignments & Tasks
              </h3>
              <button
                id="add-assignment-btn"
                onClick={() => navigate('/student/applications')}
                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-[#D4F73C] hover:text-[#121316] text-black dark:text-gray-300 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3 rounded-2xl border border-gray-200/80 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${asg.iconBg}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-black dark:text-white truncate tracking-tight">
                        {asg.title}
                      </h4>
                      <p className="text-[11px] text-gray-800 dark:text-gray-300 font-medium">
                        {asg.due}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize shrink-0 ${asg.badgeClass}`}>
                    {asg.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-800 dark:text-gray-400 font-semibold">All submissions verified by faculty</span>
            <button
              onClick={() => navigate('/student/applications')}
              className="font-bold text-blue-700 dark:text-[#D4F73C] hover:underline cursor-pointer"
            >
              View Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* 6. Recommended Jobs & Upcoming Interviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recommended Opportunities */}
        <div className="lg:col-span-8 soft-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                Recommended Internships & Openings
              </h3>
              <p className="text-[11px] text-gray-800 dark:text-gray-400 font-medium mt-0.5">
                Matched using AI against your verified skills & GPA
              </p>
            </div>
            <button
              id="view-all-jobs-btn"
              onClick={() => navigate('/student/internships')}
              className="text-xs font-bold text-blue-700 dark:text-[#D4F73C] hover:underline cursor-pointer"
            >
              Explore All
            </button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => {
              const isApplied = studentProfile.appliedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-200/80 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-10 h-10 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-tight">
                          {job.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C]">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-800 dark:text-gray-300 mt-0.5 font-medium">
                        {job.companyName} • {job.location}
                      </p>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                        {job.stipendOrSalary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      id={`view-job-details-${job.id}`}
                      onClick={() => navigate('/student/internships')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-black hover:bg-gray-800 text-white dark:bg-[#D4F73C] dark:hover:bg-[#c6ea31] dark:text-[#121316] shadow-xs'
                      }`}
                    >
                      {isApplied ? 'Applied ✓' : 'View & Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Proficiency Radar Chart */}
        <div className="lg:col-span-4 soft-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-2 tracking-tight">
                <Layers className="w-4 h-4 text-blue-500" />
                Skill Competency
              </h3>
              <button
                id="view-skill-gap-btn"
                onClick={() => navigate('/student/skill-gap')}
                className="text-xs font-bold text-blue-700 dark:text-[#D4F73C] hover:underline cursor-pointer"
              >
                Gaps
              </button>
            </div>
            <p className="text-[11px] text-gray-800 dark:text-gray-400 font-medium">
              Verified by course tests & AI assessments
            </p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillCategoryData}>
                <PolarGrid stroke={isDarkMode ? '#2D3139' : '#E5E7EB'} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: isDarkMode ? '#D1D5DB' : '#000000', fontSize: 10, fontWeight: 700 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDarkMode ? '#374151' : '#9CA3AF'} />
                <Radar
                  name="Skill Level"
                  dataKey="score"
                  stroke={isDarkMode ? '#D4F73C' : '#2563eb'}
                  fill={isDarkMode ? '#D4F73C' : '#3b82f6'}
                  fillOpacity={isDarkMode ? 0.4 : 0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-800 dark:text-gray-400 font-semibold">Peak strength:</span>
            <span className="font-bold text-blue-700 dark:text-[#D4F73C]">
              Frontend & Cloud AI (95%)
            </span>
          </div>
        </div>
      </div>

      {/* 7. Activity Timeline & AI Career Copilot Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Live Activity Timeline */}
        <div className="lg:col-span-7 soft-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600 dark:text-[#D4F73C]" />
              <h3 className="text-sm font-bold text-black dark:text-white tracking-tight">
                Verified Activity Ledger
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-800 dark:text-gray-400 font-bold">
              Real-time Blockchain Sync
            </span>
          </div>

          <div className="space-y-2.5">
            {(studentProfile.activityTimeline || []).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl bg-gray-50/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/5 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black dark:text-white">
                      {act.title}
                    </span>
                    {act.metricChange && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C]">
                        {act.metricChange}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black dark:text-gray-300 font-medium leading-relaxed">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-gray-800 dark:text-gray-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-700 dark:text-gray-400" />
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Career Copilot Trajectory Alignment */}
        <div className="lg:col-span-5 rounded-3xl bg-[#18191E] text-white p-5 flex flex-col justify-between border border-white/5 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4F73C]" />
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  AI Career Trajectory
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#D4F73C] text-[#121316]">
                96% Alignment
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                Distributed Systems & AI Platform Engineer
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                Based on your verified TypeScript, Node.js, and GenAI credentials, you are in the 95th percentile for distributed tooling internships.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-gray-300">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D4F73C]" />
                Recommended Next Step:
              </div>
              <p className="text-gray-400 text-[11px] font-normal leading-relaxed">
                Complete remaining milestones in the Full-Stack AI Roadmap to unlock Tier-1 direct recruitment.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/student/roadmap')}
            className="w-full mt-4 py-2.5 px-4 rounded-2xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#121316] font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Continue Active Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Academic & Technical Schedule
                </h3>
                <p className="text-gray-500">
                  {months[monthIndex]} • Verified Campus Timeline
                </p>
              </div>
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-purple-900 dark:text-purple-200">TechNova Technical Assessment Round</h4>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">Sep 17, 2026 • 2:00 PM IST (Google Meet)</p>
                </div>
                <button
                  onClick={() => {
                    setIsCalendarModalOpen(false);
                    navigate('/student/interview-prep');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer"
                >
                  Prepare
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Full-Stack Capstone Milestone 3</h4>
                  <p className="text-[11px] text-gray-500">Sep 24, 2026 • Faculty Review Submission</p>
                </div>
                <button
                  onClick={() => {
                    setIsCalendarModalOpen(false);
                    navigate('/student/roadmap');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs cursor-pointer"
                >
                  View Tasks
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCalendarModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
