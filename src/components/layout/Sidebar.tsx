import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Target,
  Compass,
  Briefcase,
  Bot,
  Award,
  Users,
  CheckCircle,
  Calendar,
  Building,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Search,
  TrendingUp,
  User as UserIcon,
  Layers,
  FlaskConical,
  PlusCircle,
  AlertTriangle,
  Settings,
  ArrowUpRight,
  ChevronRight,
  LogOut,
  GraduationCap,
  Building2,
  Bell,
  Activity,
  Zap,
  Scale,
  MessageSquare,
  Clock,
} from 'lucide-react';

interface SidebarProps {
  onSelectAiChat?: () => void;
  onOpenNotifications?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectAiChat, onOpenNotifications }) => {
  const {
    currentUser,
    currentPath,
    activeTab,
    setActiveTab,
    navigate,
    applications,
    notifications,
    setIsMobileMenuOpen,
    showToast,
    openAiChat,
  } = useApp();
  const { logout } = useAuth();

  const effectiveRole =
    currentPath.startsWith('/industry') || currentPath.startsWith('/recruiter')
      ? 'company'
      : currentPath.startsWith('/institution') || currentPath.startsWith('/placement-cell')
      ? 'college_admin'
      : currentPath.startsWith('/admin')
      ? 'super_admin'
      : currentPath.startsWith('/student')
      ? 'student'
      : currentUser.role === 'faculty'
      ? 'college_admin'
      : currentUser.role;

  const role = effectiveRole;

  // Compute live badges
  const pendingApps = applications.filter((a) => a.status === 'Applied' || a.status === 'Screening').length;

  interface MenuItem {
    id: string;
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
    aiHighlight?: boolean;
  }

  let menuItems: MenuItem[] = [];

  if (role === 'student') {
    menuItems = [
      { id: 'dashboard', path: '/student/dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'calendar', path: '/student/drive-calendar', label: 'Drive Calendar', icon: <Calendar className="w-4 h-4" />, aiHighlight: true },
      { id: 'assessment', path: '/student/assessment', label: 'Skill Assessment', icon: <Target className="w-4 h-4" />, aiHighlight: true },
      { id: 'skills', path: '/student/skills', label: 'My Skills', icon: <Award className="w-4 h-4" /> },
      { id: 'skill_gap', path: '/student/skill-gap', label: 'Skill Gap Analysis', icon: <BarChart3 className="w-4 h-4" />, aiHighlight: true },
      { id: 'simulator', path: '/student/simulator', label: 'What-If Simulator', icon: <Zap className="w-4 h-4" />, aiHighlight: true },
      { id: 'skill_mapping', path: '/student/skill-mapping', label: 'Skill-to-Job Matrix', icon: <Layers className="w-4 h-4" />, aiHighlight: true },
      { id: 'roadmap', path: '/student/roadmap', label: 'Career Roadmap', icon: <Compass className="w-4 h-4" /> },
      { id: 'internships', path: '/student/internships', label: 'Internships', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'jobs', path: '/student/jobs', label: 'Graduate Jobs & Drives', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'applications', path: '/student/applications', label: 'Applications', icon: <CheckCircle className="w-4 h-4" />, badge: pendingApps > 0 ? pendingApps : undefined },
      { id: 'feedback', path: '/student/interview-feedback', label: 'Personal Interview Feedback', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'documents', path: '/student/documents', label: 'Verify Documents', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'portfolio', path: '/student/portfolio', label: 'Digital Portfolio', icon: <UserIcon className="w-4 h-4" /> },
      { id: 'resume_studio', path: '/student/resume-studio', label: 'AI Resume Studio', icon: <FileText className="w-4 h-4" />, aiHighlight: true },
      { id: 'interview_prep', path: '/student/interview-prep', label: 'AI Interview Prep', icon: <Bot className="w-4 h-4" />, aiHighlight: true },
      { id: 'settings', path: '/student/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'company') {
    // Recruiter Portal (Merged Post Job + Post Internship + Post Project into Create Drive / Opportunity)
    menuItems = [
      { id: 'dashboard', path: '/industry/dashboard', label: 'Recruiter Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'create_drive', path: '/industry/post-opportunity', label: 'Create Drive / Opportunity', icon: <PlusCircle className="w-4 h-4" />, aiHighlight: true },
      { id: 'manage_opportunities', path: '/industry/opportunities', label: 'Drives & Openings', icon: <Layers className="w-4 h-4" /> },
      { id: 'calendar', path: '/industry/calendar', label: 'Campus Drive Calendar', icon: <Calendar className="w-4 h-4" /> },
      { id: 'candidates', path: '/industry/candidates', label: 'AI Candidate Matching', icon: <Sparkles className="w-4 h-4" />, aiHighlight: true },
      { id: 'shortlisted', path: '/industry/shortlisted', label: 'Shortlisted Candidates', icon: <CheckCircle className="w-4 h-4" /> },
      { id: 'applications', path: '/industry/applications', label: 'Applications & Pipeline', icon: <FileText className="w-4 h-4" /> },
      { id: 'verification', path: '/industry/verification', label: 'Candidate Credentials', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'profile', path: '/industry/profile', label: 'Recruiter Profile', icon: <Building className="w-4 h-4" /> },
      { id: 'settings', path: '/industry/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'college_admin') {
    // Placement Cell Portal (Focused purely on placement operations, students, and hiring partners)
    menuItems = [
      { id: 'dashboard', path: '/institution/dashboard', label: 'Placement Cell Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'comparison', path: '/institution/comparison', label: 'Branch Comparison', icon: <Scale className="w-4 h-4" />, aiHighlight: true },
      { id: 'calendar', path: '/institution/calendar', label: 'Drive Calendar', icon: <Calendar className="w-4 h-4" />, aiHighlight: true },
      { id: 'at_risk', path: '/institution/at-risk', label: 'At-Risk Student Detection', icon: <AlertTriangle className="w-4 h-4" />, aiHighlight: true },
      { id: 'scheduler', path: '/institution/scheduler', label: 'Conflict-Free Scheduler', icon: <Clock className="w-4 h-4" />, aiHighlight: true },
      { id: 'placements', path: '/institution/placements', label: 'Placement Drives & Offers', icon: <TrendingUp className="w-4 h-4" /> },
      { id: 'verification', path: '/institution/verification', label: 'Verify Documents', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'recruiter_tracking', path: '/institution/recruiter-tracking', label: 'Recruiter Health Index', icon: <Building className="w-4 h-4" /> },
      { id: 'skill_mapping', path: '/institution/skill-mapping', label: 'Skill-to-Job Matrix', icon: <Layers className="w-4 h-4" /> },
      { id: 'feedback', path: '/institution/feedback', label: 'Structured Placement Feedback', icon: <MessageSquare className="w-4 h-4" /> },
      { id: 'reports', path: '/institution/reports', label: 'Placement Analytics', icon: <BarChart3 className="w-4 h-4" />, aiHighlight: true },
      { id: 'students', path: '/institution/students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
      { id: 'industries', path: '/institution/industries', label: 'Recruiter Partners', icon: <Building2 className="w-4 h-4" /> },
      { id: 'settings', path: '/institution/settings', label: 'Placement Cell Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'super_admin') {
    menuItems = [
      { id: 'dashboard', path: '/admin/dashboard', label: 'Admin Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'metrics', path: '/admin/metrics', label: 'Performance Metrics', icon: <Activity className="w-4 h-4" />, aiHighlight: true },
      { id: 'users', path: '/admin/users', label: 'User Directory', icon: <Users className="w-4 h-4" /> },
      { id: 'opportunities', path: '/admin/opportunities', label: 'Opportunity Moderation', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'applications', path: '/admin/applications', label: 'Application Oversight', icon: <FileText className="w-4 h-4" /> },
      { id: 'reports', path: '/admin/reports', label: 'Platform Reports', icon: <Layers className="w-4 h-4" /> },
      { id: 'analytics', path: '/admin/analytics', label: 'Deep Analytics', icon: <TrendingUp className="w-4 h-4" />, aiHighlight: true },
      { id: 'settings', path: '/admin/settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  }

  const handleNavClick = (item: MenuItem) => {
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (currentPath === item.path) return true;

    // Root dashboard checks
    if (item.id === 'dashboard') {
      if (currentPath.endsWith('/dashboard')) return true;
      if (role === 'student' && (currentPath === '/student' || currentPath === '/student/')) return true;
      if (role === 'company' && (currentPath === '/industry' || currentPath === '/industry/' || currentPath === '/recruiter')) return true;
      if (role === 'college_admin' && (currentPath === '/institution' || currentPath === '/institution/' || currentPath === '/placement-cell')) return true;
      if (role === 'super_admin' && (currentPath === '/admin' || currentPath === '/admin/')) return true;
      return false;
    }

    // Sub-path checking (e.g., details pages)
    if (item.path !== '/' && !item.path.endsWith('/dashboard') && currentPath.startsWith(item.path)) {
      return true;
    }

    // Custom route aliases
    if (
      item.id === 'manage_opportunities' &&
      (currentPath.includes('/opportunities') || currentPath.includes('/manage-opportunities'))
    ) {
      return true;
    }
    if (
      item.id === 'skill_intelligence' &&
      role === 'college_admin' &&
      (currentPath.includes('/skills') || currentPath.includes('/skill-gaps') || currentPath.includes('/industry-demand'))
    ) {
      return true;
    }

    return false;
  };

  return (
    <aside
      id="main-sidebar-nav"
      className="w-full lg:w-64 shrink-0 flex flex-col justify-between p-4 bg-[#18191E] text-white rounded-3xl shadow-xl border border-white/5"
    >
      <div className="space-y-5">
        {/* Brand Logo Header */}
        <div className="px-2 pt-1 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4F73C] via-lime-400 to-emerald-400 flex items-center justify-center text-[#121316] font-black text-lg shadow-md shadow-[#D4F73C]/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">
                  SkillBridge<span className="text-[#D4F73C]">AI</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {role === 'company'
                  ? 'Recruiter Portal'
                  : role === 'college_admin'
                  ? 'Placement Cell Portal'
                  : role === 'super_admin'
                  ? 'Platform Admin'
                  : 'Student Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Portal Switcher Button */}
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            navigate('/role-selection');
          }}
          className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white flex items-center justify-between transition-colors border border-white/5 cursor-pointer"
        >
          <span className="text-[11px] font-semibold text-gray-400">Switch Role Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Navigation list */}
        <div className="space-y-1 max-h-[58vh] lg:max-h-[52vh] overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#D4F73C] text-[#121316] shadow-md shadow-[#D4F73C]/20 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`${
                      isActive
                        ? 'text-[#121316]'
                        : item.aiHighlight
                        ? 'text-[#D4F73C]'
                        : 'text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.aiHighlight && !isActive && !item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4F73C]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign Out & Copilot widget */}
      <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
        <button
          id="sidebar-signout-btn"
          onClick={async () => {
            setIsMobileMenuOpen(false);
            await logout();
            showToast('Signed out of active session', 'info');
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-[#24252D] to-[#1C1D24] border border-white/10 p-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#D4F73C] text-[#121316] flex items-center justify-center font-bold">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">AI Copilot</span>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onSelectAiChat) onSelectAiChat();
                else openAiChat();
              }}
              className="p-1 rounded-full hover:bg-white/10 text-gray-300 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onSelectAiChat) onSelectAiChat();
              else openAiChat();
            }}
            className="w-full mt-2.5 py-1.5 rounded-xl bg-[#D4F73C] text-[#111216] text-[11px] font-bold hover:bg-[#c6ea31] transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Launch Career Advisor</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
