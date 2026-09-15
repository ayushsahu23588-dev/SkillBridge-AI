import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { navigate, isDarkMode } = useApp();
  const { switchRole } = useAuth();

  const handleSelectRole = (role: 'student' | 'faculty' | 'industry' | 'institution') => {
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

  const roles = [
    {
      id: 'student' as const,
      title: 'Student',
      description: 'Build your skills. Find internships. Get career-ready.',
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      accentColor: 'border-blue-500/30 hover:border-blue-500 shadow-blue-500/5',
      badge: 'Job Ready',
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
      highlights: [
        'AI Skill Assessment & Gap Scorecard',
        'Direct Match to Verified Internships',
        'Personalized 4-Month Roadmaps',
        'Digital Portfolio & AI Resume Studio',
      ],
      destination: '/student/dashboard',
    },
    {
      id: 'faculty' as const,
      title: 'Faculty / Academician',
      description: 'Discover industry collaboration, FDPs and research opportunities.',
      icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
      accentColor: 'border-emerald-500/30 hover:border-emerald-500 shadow-emerald-500/5',
      badge: 'Academic Excellence',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
      highlights: [
        'Faculty Immersion & Industry Internships',
        'Funded Research & Industry Grants',
        'Corporate Consultancy Projects',
        'Faculty Development Programs (FDPs)',
      ],
      destination: '/faculty/dashboard',
    },
    {
      id: 'industry' as const,
      title: 'Industry',
      description: 'Find skilled talent and collaborate with academia.',
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      accentColor: 'border-purple-500/30 hover:border-purple-500 shadow-purple-500/5',
      badge: 'Talent Acquisition',
      badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400',
      highlights: [
        'Post Internships & Full-Time Jobs',
        'AI Compatibility Matching (80-95%)',
        'Direct Campus Hiring Pipeline',
        'Mentorship & Campus Sponsorship',
      ],
      destination: '/industry/dashboard',
    },
    {
      id: 'institution' as const,
      title: 'Institution',
      description: 'Monitor skills, internships and placement readiness.',
      icon: <Building2 className="w-8 h-8 text-amber-500" />,
      accentColor: 'border-amber-500/30 hover:border-amber-500 shadow-amber-500/5',
      badge: 'Placement Analytics',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      highlights: [
        'Macro Student Skill Distribution Heatmap',
        'Departmental Placement Readiness (72%)',
        'Top Skill Gaps Intelligence',
        'Industry Demand Trends & MOU Tracking',
      ],
      destination: '/institution/dashboard',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] dark:bg-[#0D0E13] text-gray-900 dark:text-white px-4 sm:px-8 py-8">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#18191E] text-white flex items-center justify-center font-black text-xs">
            EB
          </div>
          <span className="font-bold text-sm">
            SkillBridge<span className="text-[#84B000] dark:text-[#D4F73C]"> AI</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Existing Account? Sign In
        </button>
      </div>

      {/* Main Selection Body */}
      <main className="flex-1 max-w-6xl mx-auto w-full py-12 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
            <span>Role-Based Portal Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Select Your Role
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Choose how you participate in the academia-industry collaboration network.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              id={`role-select-${role.id}`}
              onClick={() => handleSelectRole(role.id)}
              className={`rounded-3xl bg-white dark:bg-[#14151B] border ${role.accentColor} p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all cursor-pointer group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${role.badgeClass}`}>
                    {role.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-[#D4F73C] transition-colors">
                  {role.title}
                </h2>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                  "{role.description}"
                </p>

                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 space-y-2">
                  {role.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                <button
                  id={`enter-role-btn-${role.id}`}
                  className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-[#111216] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Enter as {role.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Prototype Demo Switcher Footer */}
        <div className="mt-12 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Direct portal access enabled: Explore each persona with preconfigured workflows.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="font-bold text-gray-900 dark:text-white underline hover:opacity-80"
            >
              Sign In with Custom Email
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('/register')}
              className="font-bold text-gray-900 dark:text-white underline hover:opacity-80"
            >
              Register New Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
