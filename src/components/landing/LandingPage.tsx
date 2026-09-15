import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  Compass,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, isDarkMode } = useApp();
  const { switchRole } = useAuth();

  const handleRoleSelect = (role: 'student' | 'faculty' | 'industry' | 'institution') => {
    if (role === 'student') {
      switchRole('student');
      navigate('/student/dashboard');
    } else if (role === 'faculty') {
      switchRole('faculty');
      navigate('/faculty/dashboard');
    } else if (role === 'industry') {
      switchRole('company');
      navigate('/industry/dashboard');
    } else if (role === 'institution') {
      switchRole('college_admin');
      navigate('/institution/dashboard');
    }
  };

  const roleCards = [
    {
      role: 'student' as const,
      title: 'Student Portal',
      tagline: 'Build your skills. Find internships. Get career-ready.',
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 hover:border-blue-500',
      badge: 'Job Ready',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      features: [
        'AI Skill Assessment & Scorecard',
        'Automated Industry Skill Gap Analysis',
        'Personalized 4-Month Career Roadmap',
        'Verified Digital Resume & Portfolio',
      ],
      ctaText: 'Enter Student Portal',
      targetPath: '/student/dashboard',
    },
    {
      role: 'faculty' as const,
      title: 'Faculty / Academician',
      tagline: 'Discover industry collaboration, FDPs and research opportunities.',
      icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-500',
      badge: 'Academic Excellence',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      features: [
        'Faculty Industry Internships & Immersion',
        'Industrial Training & FDP Programs',
        'Funded Research & Joint Patents',
        'Corporate Consultancy Projects',
      ],
      ctaText: 'Enter Faculty Portal',
      targetPath: '/faculty/dashboard',
    },
    {
      role: 'industry' as const,
      title: 'Industry Partner',
      tagline: 'Find skilled talent and collaborate with academia.',
      icon: <Briefcase className="w-6 h-6 text-purple-500" />,
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500',
      badge: 'Talent Acquisition',
      badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      features: [
        'Post Internships, Jobs & Capstones',
        'AI Compatibility Candidate Matching',
        'Direct Campus Pipeline & Pre-Screening',
        'Innovation Challenges & Mentorship',
      ],
      ctaText: 'Enter Industry Portal',
      targetPath: '/industry/dashboard',
    },
    {
      role: 'institution' as const,
      title: 'Institution / College',
      tagline: 'Monitor skills, internships and placement readiness.',
      icon: <Building2 className="w-6 h-6 text-amber-500" />,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30 hover:border-amber-500',
      badge: 'Institutional Analytics',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      features: [
        'Macro Student Skill Distribution Heatmap',
        'Departmental Skill Gap Intelligence',
        'NAAC/NBA Accreditation Readiness Reports',
        'Industry MOU & Placement Tracking',
      ],
      ctaText: 'Enter Institution Portal',
      targetPath: '/institution/dashboard',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white selection:bg-[#D4F73C] selection:text-black">
      {/* 1. Landing Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121318]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#18191E] text-white flex items-center justify-center shadow-md ring-1 ring-white/10 group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#D4F73C] to-emerald-400 flex items-center justify-center text-[#111216] font-black text-xs">
                SB
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-black dark:text-white">
                  SkillBridge<span className="text-[#84B000] dark:text-[#D4F73C]"> AI</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] border border-[#D4F73C]/30 hidden sm:inline-block">
                  Enterprise Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                Academia–Industry Collaboration Portal
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
            <a href="#roles" className="hover:text-black dark:hover:text-white transition-colors">
              User Portals
            </a>
            <button
              onClick={() => navigate('/student/assessment')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              AI Assessment
            </button>
            <button
              onClick={() => navigate('/student/internships')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Internships
            </button>
            <button
              onClick={() => navigate('/student/roadmap')}
              className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              Career Roadmap
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="landing-signin-btn"
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/15 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="landing-getstarted-btn"
              onClick={() => navigate('/role-selection')}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c4e832] text-[#111216] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4F73C]/10 dark:bg-[#D4F73C]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xs text-xs font-semibold text-gray-800 dark:text-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
              <span>Bridging Academia, Skills & Industry</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
              SkillBridge AI —{' '}
              <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-[#84B000] dark:to-[#D4F73C] bg-clip-text text-transparent">
                Academia–Industry Collaboration
              </span>{' '}
              Platform
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
              An AI-powered platform connecting students, academicians, institutions, and industries through skill mapping, internships, projects, mentorship, and career opportunities.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                id="hero-select-portal-btn"
                onClick={() => navigate('/role-selection')}
                className="px-6 py-3.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Select Your Role & Enter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-quick-assess-btn"
                onClick={() => {
                  switchRole('student');
                  navigate('/student/assessment');
                }}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Target className="w-4 h-4 text-blue-500" />
                <span>Take AI Skill Assessment</span>
              </button>
              <button
                id="hero-explore-internships-btn"
                onClick={() => {
                  switchRole('student');
                  navigate('/student/internships');
                }}
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Briefcase className="w-4 h-4 text-emerald-500" />
                <span>Explore Internships</span>
              </button>
            </div>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-gray-200 dark:border-white/10 text-left">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tabular-nums">14,800+</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Students Assessed</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tabular-nums">280+</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Corporate Partners</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-[#4D7C0F] dark:text-[#D4F73C] tabular-nums">91.4%</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Placement Readiness</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">45+</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">Institutional MOUs</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. STEP 2 PRIMARY FEATURE: The 4 Role Portals Grid */}
        <section id="roles" className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Choose Your Portal & Experience Step 2
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Each stakeholder accesses specialized intelligence, workflows, and tools built to bridge industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleCards.map((card) => (
              <div
                key={card.role}
                id={`role-card-${card.role}`}
                className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-gray-400 dark:hover:border-white/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    "{card.tagline}"
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2">
                    {card.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                  <button
                    id={`enter-${card.role}-portal-btn`}
                    onClick={() => handleRoleSelect(card.role)}
                    className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#111216] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:scale-[1.02]"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Core Features Showcase */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-gray-50 to-white dark:from-[#15161D] dark:to-[#101116] border border-gray-200 dark:border-white/10 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4D7C0F] dark:text-[#D4F73C]">
                Integrated Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
                How SkillBridge AI Drives Tangible Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
                A closed-loop platform connecting curriculum analysis to verified candidate placement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => {
                  switchRole('student');
                  navigate('/student/assessment');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  AI Skill Assessment
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Evaluate technical, soft, and aptitude competencies using adaptive questionnaires, sliders, and live diagnostic scoring.
                </p>
              </div>

              <div
                onClick={() => {
                  switchRole('student');
                  navigate('/student/skill-gap');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  Skill Gap Intelligence
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Mathematically calculate current vs required market benchmarks (DSA, Cloud, Git, APIs) with custom delta percentages.
                </p>
              </div>

              <div
                onClick={() => {
                  switchRole('student');
                  navigate('/student/roadmap');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">
                  Visual Career Roadmaps
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Follow a structured path: Current Skills → Skill Gaps → Learning → Projects → Certifications → Internship → Placement.
                </p>
              </div>

              <div
                onClick={() => {
                  switchRole('student');
                  navigate('/student/internships');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-[#84B000] dark:hover:border-[#D4F73C] transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#84B000] dark:group-hover:text-[#D4F73C] transition-colors">
                  Opportunity Marketplaces
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Real-time internship and job listings with AI match ratings, stipend visibility, and single-click application tracking.
                </p>
              </div>

              <div
                onClick={() => {
                  switchRole('company');
                  navigate('/industry/candidates');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  AI Candidate Matching
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Recruiters get ranked candidates (Candidate A 94%, B 87%, C 81%) based on verified skills, projects, and coursework.
                </p>
              </div>

              <div
                onClick={() => {
                  switchRole('college_admin');
                  navigate('/institution/dashboard');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  Institutional Analytics
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                  Dean and HOD dashboards with student readiness distribution, top skill gaps, and industry demand metrics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Indian Industry Partners Section */}
        <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-gray-200 dark:border-white/10">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Enterprise & Academic Network
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-5 text-gray-600 dark:text-gray-300 font-bold text-sm sm:text-base">
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">TCS</span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">Infosys</span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">Wipro</span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">Accenture</span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">Tech Mahindra</span>
              <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">Deloitte</span>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-white dark:bg-[#101116] border-t border-gray-200 dark:border-white/10 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white">SkillBridge AI</span>
            <span>•</span>
            <span>Bridging Academia, Skills & Industry</span>
          </div>

          <p className="text-[11px] text-center sm:text-right max-w-md">
            Connecting students, academicians, institutions, and industries through intelligent skill mapping and career opportunities.
          </p>
        </div>
      </footer>
    </div>
  );
};
