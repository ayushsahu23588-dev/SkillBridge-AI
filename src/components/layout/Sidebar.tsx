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
  } = useApp();
  const { logout } = useAuth();

  const effectiveRole =
    currentPath.startsWith('/faculty')
      ? 'faculty'
      : currentPath.startsWith('/industry')
      ? 'company'
      : currentPath.startsWith('/institution')
      ? 'college_admin'
      : currentPath.startsWith('/admin')
      ? 'super_admin'
      : currentPath.startsWith('/student')
      ? 'student'
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
      { id: 'dashboard', path: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'assessment', path: '/student/assessment', label: 'Skill Assessment', icon: <Target className="w-4 h-4" />, aiHighlight: true },
      { id: 'skills', path: '/student/skills', label: 'My Skills', icon: <Award className="w-4 h-4" /> },
      { id: 'skill_gap', path: '/student/skill-gap', label: 'Skill Gap Analysis', icon: <BarChart3 className="w-4 h-4" />, aiHighlight: true },
      { id: 'roadmap', path: '/student/roadmap', label: 'Career Roadmap', icon: <Compass className="w-4 h-4" />, aiHighlight: true },
      { id: 'internships', path: '/student/internships', label: 'Internships', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'jobs', path: '/student/jobs', label: 'Graduate Jobs', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'applications', path: '/student/applications', label: 'Applications', icon: <CheckCircle className="w-4 h-4" />, badge: pendingApps > 0 ? pendingApps : undefined },
      { id: 'portfolio', path: '/student/portfolio', label: 'Digital Portfolio', icon: <UserIcon className="w-4 h-4" /> },
      { id: 'resume_studio', path: '/student/resume-studio', label: 'AI Resume Studio', icon: <FileText className="w-4 h-4" />, aiHighlight: true },
      { id: 'interview_prep', path: '/student/interview-prep', label: 'AI Interview Prep', icon: <Sparkles className="w-4 h-4" />, aiHighlight: true },
      { id: 'settings', path: '/student/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'faculty') {
    menuItems = [
      { id: 'dashboard', path: '/faculty/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'internships', path: '/faculty/internships', label: 'Internships', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'industrial_training', path: '/faculty/industrial-training', label: 'Industrial Training', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'fdps', path: '/faculty/fdps', label: 'FDPs', icon: <Award className="w-4 h-4" /> },
      { id: 'consultancy', path: '/faculty/consultancy', label: 'Consultancy', icon: <Building className="w-4 h-4" /> },
      { id: 'research', path: '/faculty/research', label: 'Research Collaboration', icon: <FlaskConical className="w-4 h-4" />, aiHighlight: true },
      { id: 'workshops', path: '/faculty/workshops', label: 'Workshops', icon: <Calendar className="w-4 h-4" /> },
      { id: 'guest_lectures', path: '/faculty/guest-lectures', label: 'Guest Lectures', icon: <Sparkles className="w-4 h-4" /> },
      { id: 'projects', path: '/faculty/projects', label: 'Projects', icon: <Target className="w-4 h-4" /> },
      { id: 'mentorship', path: '/faculty/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
      { id: 'profile', path: '/faculty/profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
      { id: 'settings', path: '/faculty/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'company') {
    menuItems = [
      { id: 'dashboard', path: '/industry/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'post_internship', path: '/industry/post-internship', label: 'Post Internship', icon: <PlusCircle className="w-4 h-4" /> },
      { id: 'post_job', path: '/industry/post-job', label: 'Post Job', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'post_project', path: '/industry/post-project', label: 'Post Project', icon: <Target className="w-4 h-4" /> },
      { id: 'manage_opportunities', path: '/industry/opportunities', label: 'Manage Opportunities', icon: <Layers className="w-4 h-4" /> },
      { id: 'candidates', path: '/industry/candidates', label: 'Candidate Matching', icon: <Sparkles className="w-4 h-4" />, aiHighlight: true },
      { id: 'shortlisted', path: '/industry/shortlisted', label: 'Shortlisted Candidates', icon: <CheckCircle className="w-4 h-4" /> },
      { id: 'applications', path: '/industry/applications', label: 'Applications', icon: <FileText className="w-4 h-4" /> },
      { id: 'mentorship', path: '/industry/mentorship', label: 'Mentorship', icon: <Calendar className="w-4 h-4" /> },
      { id: 'workshops', path: '/industry/workshops', label: 'Workshops', icon: <Award className="w-4 h-4" /> },
      { id: 'profile', path: '/industry/profile', label: 'Profile', icon: <Building className="w-4 h-4" /> },
      { id: 'settings', path: '/industry/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'college_admin') {
    menuItems = [
      { id: 'dashboard', path: '/institution/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'students', path: '/institution/students', label: 'Students', icon: <Users className="w-4 h-4" /> },
      { id: 'faculty', path: '/institution/faculty', label: 'Faculty', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'industries', path: '/institution/industries', label: 'Industries', icon: <Building className="w-4 h-4" /> },
      { id: 'departments', path: '/institution/departments', label: 'Departments', icon: <Layers className="w-4 h-4" /> },
      { id: 'skill_intelligence', path: '/institution/skill-intelligence', label: 'Skill Intelligence', icon: <Award className="w-4 h-4" />, aiHighlight: true },
      { id: 'internships', path: '/institution/internships', label: 'Internships', icon: <Briefcase className="w-4 h-4" /> },
      { id: 'placements', path: '/institution/placements', label: 'Placements', icon: <TrendingUp className="w-4 h-4" /> },
      { id: 'training', path: '/institution/training', label: 'Training & Development', icon: <BookOpen className="w-4 h-4" /> },
      { id: 'collaborations', path: '/institution/collaborations', label: 'Industry Collaboration', icon: <Building2 className="w-4 h-4" /> },
      { id: 'reports', path: '/institution/reports', label: 'Reports & Analytics', icon: <FileText className="w-4 h-4" /> },
      { id: 'notifications', path: '/institution/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
      { id: 'profile', path: '/institution/profile', label: 'College Profile', icon: <Building2 className="w-4 h-4" /> },
      { id: 'settings', path: '/institution/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (role === 'super_admin') {
    menuItems = [
      { id: 'dashboard', path: '/admin/dashboard', label: 'Admin Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
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
      if (role === 'faculty' && (currentPath === '/faculty' || currentPath === '/faculty/')) return true;
      if (role === 'company' && (currentPath === '/industry' || currentPath === '/industry/')) return true;
      if (role === 'college_admin' && (currentPath === '/institution' || currentPath === '/institution/')) return true;
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
      item.id === 'workshops' &&
      role === 'company' &&
      (currentPath.includes('/workshops') || currentPath.includes('/challenges'))
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
    if (
      item.id === 'workshops' &&
      role === 'faculty' &&
      (currentPath.includes('/workshops') || currentPath.includes('/guest-lectures'))
    ) {
      return true;
    }
    if (
      item.id === 'projects' &&
      role === 'faculty' &&
      (currentPath.includes('/projects') || currentPath.includes('/mentorship'))
    ) {
      return true;
    }
    if (
      item.id === 'profile' &&
      role === 'faculty' &&
      (currentPath.includes('/profile') || currentPath.includes('/settings'))
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
                  ? 'Industry Portal'
                  : role === 'faculty'
                  ? 'Faculty Portal'
                  : role === 'college_admin'
                  ? 'Institution Portal'
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
                onSelectAiChat?.();
              }}
              className="p-1 rounded-full hover:bg-white/10 text-gray-300 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSelectAiChat?.();
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
