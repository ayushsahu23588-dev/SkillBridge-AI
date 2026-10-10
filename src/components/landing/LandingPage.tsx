import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Target,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ChevronRight,
  Calendar,
  Clock,
  AlertTriangle,
  Brain,
  Zap,
  BarChart3,
  Bot,
  Scale,
  FileCheck2,
  Building,
  Send,
  UserCheck,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, isDarkMode } = useApp();
  const { switchRole } = useAuth();

  // Interactive state for the 8-stage pipeline demonstration
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  // Interactive state for AI intelligence tab
  const [activeAiTab, setActiveAiTab] = useState<
    'readiness' | 'matching' | 'skillgap' | 'atrisk' | 'scheduling'
  >('readiness');

  const handleRoleSelect = (role: 'student' | 'recruiter' | 'placement_cell') => {
    if (role === 'student') {
      switchRole('student');
      navigate('/student/dashboard');
    } else if (role === 'recruiter') {
      switchRole('company');
      navigate('/industry/dashboard');
    } else if (role === 'placement_cell') {
      switchRole('college_admin');
      navigate('/institution/dashboard');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 8-stage placement lifecycle pipeline
  const pipelineStages = [
    {
      id: 'profile',
      number: '01',
      title: 'Profile',
      shortTitle: 'Profile',
      description: 'Comprehensive student profile verification including verified CGPA, branch, active backlogs, capstone repositories, and credential proofs.',
      metrics: 'Verified Academics & Repos',
      icon: <UserCheck className="w-5 h-5" />,
      detail: 'Aggregates transcripts, GitHub contributions, verified course attainments, and disciplinary clearance into a tamper-proof student record.',
    },
    {
      id: 'readiness',
      number: '02',
      title: 'AI Readiness',
      shortTitle: 'AI Readiness',
      description: 'Algorithmic assessment of student competency across technical DSA, core engineering fundamentals, aptitude speed, and communication.',
      metrics: 'Predictive 0–100% Score',
      icon: <Brain className="w-5 h-5" />,
      detail: 'Evaluates real-time aptitude metrics, code execution efficiency, and mock interview performance to predict hiring clearance likelihood.',
    },
    {
      id: 'skillgap',
      number: '03',
      title: 'Skill Gap',
      shortTitle: 'Skill Gap',
      description: 'Granular delta intelligence revealing exact missing skills needed to unlock Dream, Super Dream, and Tier-1 company criteria.',
      metrics: 'Targeted Competency Delta',
      icon: <TrendingUp className="w-5 h-5" />,
      detail: 'Identifies specific gaps (e.g. System Design, Cloud Infra, Concurrency) and automatically recommends curated practice milestones.',
    },
    {
      id: 'match',
      number: '04',
      title: 'Company Match',
      shortTitle: 'Company Match',
      description: 'Transparent AI matching connecting eligible students with relevant corporate recruitment drives and live openings.',
      metrics: '80–98% Compatibility Fit',
      icon: <Target className="w-5 h-5" />,
      detail: 'Matches verified candidate capabilities with specific job descriptions and recruiter weightings, ranking top fit candidates.',
    },
    {
      id: 'apply',
      number: '05',
      title: 'Apply',
      shortTitle: 'Apply',
      description: 'One-click application with automated eligibility verification against strict company cutoffs, branch filters, and deadline gates.',
      metrics: 'Instant Eligibility Check',
      icon: <Send className="w-5 h-5" />,
      detail: 'Automated verification instantly confirms GPA, arrears count, and branch eligibility before submitting to prevent disqualifications.',
    },
    {
      id: 'interview',
      number: '06',
      title: 'Interview',
      shortTitle: 'Interview',
      description: 'End-to-end multi-round interview tracking (Aptitude, Technical Rounds 1 & 2, System Architecture, HR) with conflict-free scheduling.',
      metrics: 'Conflict-Free Orchestration',
      icon: <Calendar className="w-5 h-5" />,
      detail: 'Coordinates interview panels, room venues, online video links, and personalized round-by-round rubric evaluations.',
    },
    {
      id: 'offer',
      number: '07',
      title: 'Offer',
      shortTitle: 'Offer',
      description: 'Formal release and institutional tracking of Letters of Intent (LOI), package breakdowns (Base + CTC), and joining contingencies.',
      metrics: 'Digital LOI & Package Breakdown',
      icon: <Award className="w-5 h-5" />,
      detail: 'Secure release of corporate offers with institutional verification and multi-offer policy enforcement.',
    },
    {
      id: 'placement',
      number: '08',
      title: 'Placement',
      shortTitle: 'Placement',
      description: 'Confirmed corporate onboarding, placement cell registry closure, and automated departmental reporting.',
      metrics: 'Institutional Registry Sign-off',
      icon: <FileCheck2 className="w-5 h-5" />,
      detail: 'Final records logged into departmental archives with institutional placement reports, average CTC metrics, and conversion data.',
    },
  ];

  // AI Intelligence Core Modules
  const aiIntelligenceModules = [
    {
      id: 'readiness' as const,
      title: 'Placement Readiness',
      tagline: 'Predictive capability scoring based on multi-factor student telemetry',
      description: 'Our proprietary machine learning model computes an objective, dynamic 0–100% Placement Readiness Index. Combining algorithmic problem solving, academic GPA constancy, capstone project depth, and mock interview communication, institutions know exactly which students are ready for Tier-1 recruitment.',
      capabilities: [
        'Multi-factor evaluation: DSA speed, core CS concepts, verified git repositories, and behavioral communication',
        'Dynamic percentile ranking against historical institutional cohorts and national benchmarks',
        'Actionable roadmap suggestions to elevate readiness score by 15–25% before drive dates',
      ],
      mockMetric: '88.4%',
      metricLabel: 'Cohort Mean Readiness',
      accentColor: 'text-blue-500',
    },
    {
      id: 'matching' as const,
      title: 'Explainable Matching',
      tagline: 'Transparent compatibility breakdown between candidate profiles and job requisitions',
      description: 'Eliminate black-box screening. Recruiters and placement officers see an explicit, explainable breakdown of why a student matches a company profile: verified technical skill overlaps, relevant capstone domains, problem-solving percentiles, and workplace preference synergy.',
      capabilities: [
        'Granular percentage scores explaining exact skill overlaps and domain proficiencies',
        'Recruiter custom weighting: prioritize algorithmic coding vs. full-stack framework experience',
        'Direct identification of student competitive advantages that standard resumes miss',
      ],
      mockMetric: '94.2%',
      metricLabel: 'Fit Confidence Score',
      accentColor: 'text-[#D4F73C]',
    },
    {
      id: 'skillgap' as const,
      title: 'Skill Gap Analysis',
      tagline: 'Automated delta intelligence comparing individual skills against market cutoffs',
      description: 'Bridge the precise delta between what universities teach and what companies test. SkillBridge AI scans active hiring partner requirements and isolates the missing 2–3 technologies needed for a student to jump from standard service-tier packages to high-CTC product roles.',
      capabilities: [
        'Real-time comparison against active campus drive job descriptions and hiring trends',
        'What-If simulation: calculate projected company eligibility jumps before learning begins',
        'Personalized roadmap integration with curated algorithmic patterns and system design modules',
      ],
      mockMetric: '-14%',
      metricLabel: 'Average Gap Deficit Closed',
      accentColor: 'text-purple-500',
    },
    {
      id: 'atrisk' as const,
      title: 'At-Risk Prediction',
      tagline: 'Early-warning detection to prevent unplaced students before graduation',
      description: 'Identify vulnerable students 3 to 6 months before campus drives launch. By continuously monitoring assessment attempts, practice cadence, academic arrears, and interview preparation, placement cells receive automated flags to initiate remedial coaching early.',
      capabilities: [
        'Early-stage flagging based on stagnant assessment trends and missing core prerequisites',
        'Automated categorization: technical intervention, aptitude coaching, or communication mentorship',
        'Institutional intervention tracker to measure remedial coaching outcomes over time',
      ],
      mockMetric: '100%',
      metricLabel: 'Proactive Alert Coverage',
      accentColor: 'text-amber-500',
    },
    {
      id: 'scheduling' as const,
      title: 'Conflict-Free Scheduling',
      tagline: 'Combinatorial scheduling engine for complex campus recruitment drive calendars',
      description: 'Eliminate exam clashes, recruiter double-booking, and candidate interview overlaps. The scheduling engine orchestrates test windows, pre-placement talks (PPT), multi-round interview slots, and venue allocations across concurrent visiting companies.',
      capabilities: [
        'Constraint-satisfaction algorithm prevents interview overlap across concurrent corporate drives',
        'Automated synchronization with student personal calendars and interview panel availability',
        'Dynamic buffer management for technical round delays and extended evaluation sessions',
      ],
      mockMetric: '0',
      metricLabel: 'Schedule Clashes Recorded',
      accentColor: 'text-emerald-500',
    },
  ];

  // 3 Primary Portal Cards
  const portalCards = [
    {
      role: 'student' as const,
      title: 'Student Portal',
      kicker: 'For Engineering & Graduate Students',
      tagline: 'Track readiness, bridge skill gaps, and secure your campus placement.',
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      features: [
        'AI Placement Readiness Score & Percentile Rank',
        'Skill-to-Job Matrix & Automated Gap Diagnostics',
        '10-Stage Placement Journey Application Tracker',
        'Personal Interview Feedback & Rubric Reviews',
        'Central Drive Calendar with 1-Click Eligibility Check',
      ],
      ctaText: 'Enter Student Portal',
    },
    {
      role: 'recruiter' as const,
      title: 'Recruiter Portal',
      kicker: 'For Corporate Talent Acquisition',
      tagline: 'Orchestrate hiring drives and discover pre-assessed campus talent.',
      icon: <Briefcase className="w-6 h-6 text-purple-500" />,
      features: [
        'Unified Campus Drive & Job Opening Creation',
        'AI Candidate Compatibility Matching (80–98% Fit)',
        'Pre-Screening Filters by CGPA, Skills & Project Quality',
        'Pipeline Management: Shortlist, Interview & LOI Dispatch',
        'Digital Candidate Credential & Transcript Verification',
      ],
      ctaText: 'Enter Recruiter Portal',
    },
    {
      role: 'placement_cell' as const,
      title: 'Placement Cell Portal',
      kicker: 'For University TPO & Placement Leadership',
      tagline: 'Centralized command center for university placement operations.',
      icon: <Building2 className="w-6 h-6 text-amber-500" />,
      features: [
        'Macro Department & Branch Placement Comparison',
        'Conflict-Free Drive Calendar & Slot Orchestrator',
        'At-Risk Student Early-Warning Anomaly Detection',
        'Hiring Partner Relationship & Recruiter Health Index',
        'Exportable Institutional Placement Reports & CTC Analytics',
      ],
      ctaText: 'Enter Placement Cell Portal',
    },
  ];

  // Representative visual hiring-network examples (illustrative active hiring network)
  const representativeHiringNetwork = [
    { name: 'Google', domain: 'Cloud & Systems' },
    { name: 'Microsoft', domain: 'Software Engineering' },
    { name: 'Amazon', domain: 'Distributed Systems' },
    { name: 'Deloitte', domain: 'Technology Consulting' },
    { name: 'TCS', domain: 'Digital Enterprise' },
    { name: 'Infosys', domain: 'Enterprise Tech' },
    { name: 'Accenture', domain: 'Applied Intelligence' },
    { name: 'Cisco', domain: 'Networking & Security' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0E13] text-white selection:bg-[#D4F73C] selection:text-black font-sans">
      {/* 1. Public Header */}
      <header className="sticky top-0 z-50 bg-[#121318]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
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
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white">
                  SkillBridge<span className="text-[#D4F73C]"> AI</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
                Campus Placement Management
              </p>
            </div>
          </div>

          {/* Section Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-gray-300">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#D4F73C] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('ai-intelligence')}
              className="hover:text-[#D4F73C] transition-colors cursor-pointer"
            >
              AI Intelligence
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="hover:text-[#D4F73C] transition-colors cursor-pointer"
            >
              Portals
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-[#D4F73C] transition-colors cursor-pointer"
            >
              Who It's For
            </button>
          </nav>

          {/* Auth / Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="landing-signin-btn"
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl border border-white/15 text-xs font-bold text-gray-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="landing-getstarted-btn"
              onClick={() => navigate('/role-selection')}
              className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c4e832] text-[#111216] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden pt-14 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
          {/* Subtle Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D4F73C]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative text-center max-w-4xl mx-auto space-y-6">
            {/* Kicker */}
            <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Campus Placement Intelligence & Lifecycle Orchestration</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              SkillBridge AI —{' '}
              <span className="bg-gradient-to-r from-white via-[#D4F73C] to-lime-400 bg-clip-text text-transparent">
                AI-Powered Campus Placement Management
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Predict placement readiness, match students with the right companies, optimize hiring drives, and manage the complete placement journey with AI.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <button
                id="hero-primary-get-started"
                onClick={() => navigate('/role-selection')}
                className="px-7 py-3.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-sm shadow-lg shadow-[#D4F73C]/20 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-secondary-how-it-works"
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 font-bold text-sm text-gray-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore How It Works</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Placement-Focused KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 border-t border-white/10 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">14,800+</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Students Assessed</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-[#D4F73C] tabular-nums">280+</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Hiring Partners</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">94.8%</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Drive Clearance Rate</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-blue-400 tabular-nums">1,450+</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Verified Campus Offers</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Visual Hiring Network Ecosystem (Representative Recruitment Examples) */}
        <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto border-y border-white/10">
          <div className="text-center space-y-4">
            <div className="text-xs text-gray-400 font-medium">
              Representative campus recruitment network & illustrative technical hiring benchmarks
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {representativeHiringNetwork.map((company) => (
                <div
                  key={company.name}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-gray-200"
                >
                  <span className="font-bold text-white">{company.name}</span>
                  <span className="text-gray-500 font-normal">·</span>
                  <span className="text-gray-400">{company.domain}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. How It Works Section: Standardized 8-Stage Pipeline */}
        <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4F73C]">
              <Zap className="w-4 h-4" />
              <span>Closed-Loop Recruitment Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works: The 8-Stage Placement Journey
            </h2>
            <p className="text-sm text-gray-300">
              A synchronized, AI-supervised lifecycle connecting initial student profile verification to final corporate offer onboarding.
            </p>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            {pipelineStages.map((stage, idx) => {
              const isActive = activePipelineStep === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#181920] border-[#D4F73C] shadow-lg shadow-[#D4F73C]/10 ring-1 ring-[#D4F73C]/30'
                      : 'bg-[#121318] border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#D4F73C]' : 'text-gray-500'}`}>
                      {stage.number}
                    </span>
                    <div className={isActive ? 'text-[#D4F73C]' : 'text-gray-400'}>
                      {stage.icon}
                    </div>
                  </div>
                  <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {stage.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Showcase Card */}
          <div className="rounded-3xl bg-[#14151B] border border-white/10 p-6 sm:p-10 relative overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#D4F73C]">
                    Stage {pipelineStages[activePipelineStep].number} of 08
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="text-xs font-semibold text-gray-400">
                    {pipelineStages[activePipelineStep].metrics}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#D4F73C]">
                    {pipelineStages[activePipelineStep].icon}
                  </span>
                  <span>{pipelineStages[activePipelineStep].title}</span>
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {pipelineStages[activePipelineStep].description}
                </p>

                <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-[#D4F73C]/40 pl-3">
                  {pipelineStages[activePipelineStep].detail}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() =>
                      setActivePipelineStep((prev) => (prev + 1) % pipelineStages.length)
                    }
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate('/role-selection')}
                    className="px-4 py-2 rounded-xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Try in Sandbox</span>
                  </button>
                </div>
              </div>

              {/* Visual Simulated Mock Display */}
              <div className="lg:col-span-5 bg-[#181920] rounded-2xl border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                  <span className="text-gray-400 font-medium">Pipeline Telemetry</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real-time Sync</span>
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                    <span className="text-gray-300">Phase Trigger</span>
                    <span className="font-mono font-bold text-white">{pipelineStages[activePipelineStep].title}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                    <span className="text-gray-300">System Gate</span>
                    <span className="font-semibold text-[#D4F73C]">Automated Check</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/5">
                    <span className="text-gray-300">Stakeholder Access</span>
                    <span className="text-gray-400">Student · Recruiter · TPO</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Enforced across Student & Recruiter trackers</span>
                  <span className="font-mono text-gray-500">v2.6 Stable</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. AI Intelligence Section: 5 Core Models */}
        <section id="ai-intelligence" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-400">
              <Brain className="w-4 h-4" />
              <span>Predictive Decision Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Intelligence Built for Campus Placement
            </h2>
            <p className="text-sm text-gray-300">
              Five specialized machine learning capabilities designed to solve institutional hiring mismatches and bandwidth bottlenecks.
            </p>
          </div>

          {/* AI Intelligence Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {aiIntelligenceModules.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveAiTab(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAiTab === item.id
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Active AI Intelligence Showcase Grid */}
          {(() => {
            const activeModule =
              aiIntelligenceModules.find((m) => m.id === activeAiTab) ||
              aiIntelligenceModules[0];
            return (
              <div className="rounded-3xl bg-[#14151B] border border-white/10 p-6 sm:p-10 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <span>Core Engine Capability</span>
                      <span>·</span>
                      <span className={activeModule.accentColor}>{activeModule.tagline}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {activeModule.title}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {activeModule.description}
                    </p>

                    <div className="pt-2 space-y-2">
                      {activeModule.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-[#D4F73C] shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#181920] rounded-2xl border border-white/10 p-6 flex flex-col justify-between text-center space-y-4">
                    <span className="text-xs text-gray-400 font-medium">Model Output Benchmark</span>
                    <div>
                      <div className={`text-4xl sm:text-5xl font-black ${activeModule.accentColor} tabular-nums`}>
                        {activeModule.mockMetric}
                      </div>
                      <p className="text-xs text-gray-300 font-semibold mt-1">
                        {activeModule.metricLabel}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-400">
                      Calibrated across 280+ enterprise job specifications and verified candidate rubrics.
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>

        {/* 6. Portals Section: 3 Dedicated Portals */}
        <section id="portals" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-purple-400">
              <Layers className="w-4 h-4" />
              <span>Unified Access</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Select Your Portal
            </h2>
            <p className="text-sm text-gray-300">
              Purpose-built environments equipped with role-specific intelligence, workflows, and actionable dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portalCards.map((portal) => (
              <div
                key={portal.role}
                id={`portal-card-${portal.role}`}
                className="rounded-3xl bg-[#14151B] border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-lg hover:border-white/30 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      {portal.icon}
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      {portal.kicker}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {portal.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    {portal.tagline}
                  </p>

                  <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                    {portal.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#D4F73C] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10">
                  <button
                    id={`enter-${portal.role}-portal-btn`}
                    onClick={() => handleRoleSelect(portal.role)}
                    className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-[#111216] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md group-hover:scale-[1.01]"
                  >
                    <span>{portal.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Built for Students, Recruiters & Placement Cells Section */}
        <section id="stakeholders" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Students, Recruiters & Placement Cells
            </h2>
            <p className="text-sm text-gray-300">
              Engineered to replace fragmented spreadsheets, manual resume reviews, and uncoordinated email threads with automated placement infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* For Students */}
            <div className="p-6 rounded-3xl bg-[#14151B] border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Students</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Gain exact clarity on where you stand relative to company criteria. Eliminate blind applications with instant eligibility verifications, targeted skill delta bridges, and round-by-round interview feedback.
              </p>
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Automated eligibility check against backlogs & CGPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Personal interview feedback to improve between rounds</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>10-stage live progress visibility from Applied to Offer</span>
                </div>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="p-6 rounded-3xl bg-[#14151B] border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Recruiters</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Save hundreds of screening hours. Access pre-screened talent pools ranked by verified coding benchmarks, capstone validity, and algorithmic capabilities with zero duplicate resume spam.
              </p>
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>80–98% compatibility rankings for target tech stacks</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Direct round-by-round interview pipeline management</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Digital LOI rollout and offer acceptance tracking</span>
                </div>
              </div>
            </div>

            {/* For Placement Cells */}
            <div className="p-6 rounded-3xl bg-[#14151B] border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">For Placement Cells</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Full institutional command center. Monitor department-by-department placement conversion rates, orchestrate collision-free drive schedules, and detect at-risk students before recruitment commences.
              </p>
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Conflict-free calendar orchestration for concurrent drives</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Early-warning alerts for at-risk and unplaced cohorts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#D4F73C]">✓</span>
                  <span>Audited institutional placement reports & CTC benchmarks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Bottom CTA Callout */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#181920] to-blue-950/40 border border-white/10 p-8 sm:p-12 space-y-5 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Upgrade Your Campus Placement Operations?
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience end-to-end placement management with AI-backed readiness, explainable candidate matching, and conflict-free drive scheduling.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/role-selection')}
                className="px-6 py-3.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-[#111216] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all cursor-pointer"
              >
                <span>Sign In to Your Account</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Public Footer */}
      <footer className="bg-[#101116] border-t border-white/10 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#D4F73C] flex items-center justify-center text-[#111216] font-black text-[10px]">
                SB
              </div>
              <span className="font-bold text-white text-sm">SkillBridge AI</span>
            </div>
            <span className="hidden sm:inline text-gray-600">·</span>
            <span className="text-gray-400">AI-Powered Campus Placement Management Platform</span>
          </div>

          <div className="flex items-center gap-5 text-gray-400">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('ai-intelligence')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              AI Intelligence
            </button>
            <button
              onClick={() => scrollToSection('portals')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portals
            </button>
            <button
              onClick={() => navigate('/role-selection')}
              className="text-[#D4F73C] hover:underline font-semibold cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
