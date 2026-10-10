import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { navigate } = useApp();

  const accountTypes = [
    {
      id: 'student' as const,
      title: 'Student',
      kicker: 'Engineering & Graduate Students',
      description: 'Build your skills, verify placement readiness, and secure verified campus offers.',
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      accentBorder: 'border-blue-500/30 hover:border-blue-500',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      badge: 'Student Registration',
      highlights: [
        'Full Profile, Department, Batch & CGPA Verification',
        'AI Placement Readiness Score & Percentile Rank',
        'Automated Eligibility Checking & One-Click Apply',
        '10-Stage Placement Journey Application Tracker',
      ],
      registerPath: '/register?role=student',
      ctaText: 'Register as Student',
    },
    {
      id: 'recruiter' as const,
      title: 'Recruiter',
      kicker: 'Corporate Talent Acquisition',
      description: 'Launch campus hiring drives, access pre-assessed talent, and schedule multi-round interviews.',
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      accentBorder: 'border-purple-500/30 hover:border-purple-500',
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badge: 'Recruiter Registration',
      highlights: [
        'Unified Campus Drive & Job Requisition Creation',
        'AI Candidate Compatibility Matching (80–98% Fit)',
        'Pre-Screening Filters by CGPA, Branch & Skills',
        'Structured Round-by-Round Evaluations & LOI Dispatch',
      ],
      registerPath: '/register?role=recruiter',
      ctaText: 'Register as Recruiter',
    },
    {
      id: 'placement_cell' as const,
      title: 'Placement Cell',
      kicker: 'University TPO & Placement Leadership',
      description: 'Centralized command center for university placement drives, branch analytics, and scheduling.',
      icon: <Building2 className="w-8 h-8 text-amber-500" />,
      accentBorder: 'border-amber-500/30 hover:border-amber-500',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      badge: 'Placement Cell Registration',
      highlights: [
        'Macro Department & Branch Readiness Comparison',
        'Conflict-Free Central Drive Calendar & Slot Scheduler',
        'At-Risk Student Early-Warning Anomaly Detection',
        'Audited Institutional Placement Reports & CTC Analytics',
      ],
      registerPath: '/register?role=placement_cell',
      ctaText: 'Register as Placement Cell',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white px-4 sm:px-8 py-8 font-sans selection:bg-[#D4F73C] selection:text-black">
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#18191E] text-white flex items-center justify-center font-black text-xs shadow-md ring-1 ring-white/10">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-[#D4F73C] to-emerald-400 flex items-center justify-center text-[#111216] font-black text-[10px]">
              SB
            </div>
          </div>
          <div className="text-left">
            <div className="font-bold text-sm tracking-tight text-gray-900 dark:text-white leading-tight">
              SkillBridge<span className="text-[#84B000] dark:text-[#D4F73C]"> AI</span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
              AI-Powered Campus Placement Management
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Existing Account? Sign In
        </button>
      </header>

      {/* Main Selection Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-10 sm:py-14 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <UserCheck className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
            <span>New Account Onboarding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Choose Account Type
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Select your role to set up your account on the SkillBridge AI Campus Placement Management Platform.
          </p>
        </div>

        {/* 3 Account Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountTypes.map((acc) => (
            <div
              key={acc.id}
              id={`choose-account-${acc.id}`}
              onClick={() => navigate(acc.registerPath)}
              className={`rounded-3xl bg-white dark:bg-[#14151B] border ${acc.accentBorder} p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all cursor-pointer group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {acc.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${acc.badgeClass}`}>
                    {acc.badge}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-gray-400">
                  {acc.kicker}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mt-1 group-hover:text-blue-600 dark:group-hover:text-[#D4F73C] transition-colors">
                  {acc.title}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {acc.description}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2.5">
                  {acc.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-gray-100 dark:border-white/5">
                <button
                  id={`register-account-btn-${acc.id}`}
                  className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#111216] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm group-hover:scale-[1.01]"
                >
                  <span>{acc.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Support Note */}
        <div className="mt-12 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Role-Based Access Control: Each account type is provisioned with verified permissions and dedicated portal routes.</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-gray-900 dark:text-white hover:underline cursor-pointer shrink-0"
          >
            Already registered? Sign In
          </button>
        </div>
      </main>
    </div>
  );
};
