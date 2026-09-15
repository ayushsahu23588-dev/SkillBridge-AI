import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
  BadgeCheck,
  User as UserIcon,
  FolderGit2,
  Award,
  ClipboardCheck,
  MessageSquare,
  Users,
  Settings as SettingsIcon,
  ArrowLeftRight,
  Check,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenNotifications }) => {
  const {
    isDarkMode,
    toggleDarkMode,
    notifications,
    showToast,
    activeTab,
    setActiveTab,
    applications,
    mentorships,
    directConversations,
    navigate,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    switchRole: appSwitchRole,
  } = useApp();
  const { user, currentRole, switchRole, logout, openAuthModal, isAuthenticated } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleSwitcherExpanded, setRoleSwitcherExpanded] = useState(false);

  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;
  const scheduledInterviews = (applications || []).filter(
    (a) => a.status === 'Interview Scheduled' || a.status === 'Technical Round'
  ).length;
  const unreadMessagesCount = (directConversations || []).reduce(
    (acc, c) => acc + (c.unreadCount || 0),
    0
  );
  const requestedMentors = (mentorships || []).filter((m) => m.status === 'Requested').length;

  // Keyboard accessibility and click outside listener
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (!userMenuOpen) return;
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        profileBtnRef.current?.focus();
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleDocumentKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [userMenuOpen]);

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return;
    const focusableElements: HTMLElement[] = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex="0"]'
      )
    );
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % focusableElements.length;
      focusableElements[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      focusableElements[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusableElements[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      focusableElements[focusableElements.length - 1]?.focus();
    }
  };

  const navigateToTab = (tab: string) => {
    setUserMenuOpen(false);
    const rolePrefix =
      currentRole === 'company'
        ? 'industry'
        : currentRole === 'college_admin'
        ? 'institution'
        : currentRole === 'super_admin'
        ? 'admin'
        : currentRole;

    if (tab === 'settings') {
      navigate(`/${rolePrefix}/settings`);
      setActiveTab('settings');
      return;
    }

    if (tab === 'profile') {
      navigate(`/${rolePrefix}/profile`);
      setActiveTab('profile');
      return;
    }

    if (tab === 'portfolio') {
      if (currentRole !== 'student') switchRole('student');
      navigate('/student/portfolio');
      setActiveTab('portfolio');
      return;
    }

    if (tab === 'applications') {
      if (currentRole === 'company') {
        navigate('/industry/applications');
      } else {
        if (currentRole !== 'student') switchRole('student');
        navigate('/student/applications');
      }
      setActiveTab('applications');
      return;
    }

    if (tab === 'messages') {
      navigate(`/${rolePrefix}/messages`);
      setActiveTab('messages');
      return;
    }

    if (tab === 'mentorship') {
      if (currentRole === 'company') {
        navigate('/industry/mentorship');
      } else if (currentRole === 'faculty') {
        navigate('/faculty/projects');
      } else {
        if (currentRole !== 'student') switchRole('student');
        navigate('/student/mentorship');
      }
      setActiveTab('mentorship');
      return;
    }

    setActiveTab(tab);
  };

  const roleConfigs: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      label: 'Student Portal',
      icon: <GraduationCap className="w-4 h-4" />,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    {
      role: 'faculty',
      label: 'Faculty & Mentor',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    {
      role: 'company',
      label: 'Company Recruiter',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    },
    {
      role: 'college_admin',
      label: 'College Administration',
      icon: <Building2 className="w-4 h-4" />,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
  ];

  const superAdminFallbackConfig = {
    role: 'super_admin' as UserRole,
    label: 'College Administration',
    icon: <Building2 className="w-4 h-4" />,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  };

  const currentRoleConfig = roleConfigs.find((r) => r.role === currentRole) || (currentRole === 'super_admin' ? superAdminFallbackConfig : roleConfigs[0]);
  const currentUser: User = user || {
    id: 'usr_guest',
    name: 'Guest User',
    email: 'guest@university.edu',
    role: currentRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'National Institute of Technology',
    department: 'Computer Science & Engineering',
    verified: true,
    createdAt: '2024-01-01',
  };

  const handleLogoutClick = async () => {
    setUserMenuOpen(false);
    await logout();
    showToast('Signed out of active session', 'info');
  };

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full bg-white/70 dark:bg-[#0E0F14]/75 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Identity / Welcome Hint */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            id="brand-logo-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#18191E] text-white flex items-center justify-center shadow-sm ring-1 ring-white/10 group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#D4F73C] to-emerald-400 flex items-center justify-center text-[#111216] font-black text-xs shadow-xs">
                SB
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-black dark:text-white group-hover:text-[#4D7C0F] dark:group-hover:text-[#D4F73C] transition-colors">
                  SkillBridge<span className="text-[#96C200] dark:text-[#D4F73C]">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] border border-[#D4F73C]/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Enterprise Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
                Academia–Industry Portal
              </p>
            </div>
          </button>
        </div>

        {/* Center: Global Search Bar Trigger - Pill shaped like Eduplex reference */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-white dark:bg-[#181920] border border-gray-300 dark:border-white/10 text-xs sm:text-sm text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/20 transition-all cursor-pointer shadow-xs font-medium"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-black dark:text-gray-400" />
              <span>Search internships, skills, mentors, roadmaps...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-black dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-300 dark:border-white/10 font-bold">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="p-2.5 md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-black dark:text-gray-300 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Email Verification Action Pill (if unverified) */}
          {!currentUser.verified && (
            <button
              id="header-verify-email-btn"
              onClick={() => openAuthModal('verify_email')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verify Email</span>
            </button>
          )}

          {/* Role Switcher Pill Dropdown */}
          <div className="relative">
            <button
              id="role-switcher-dropdown-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${currentRoleConfig.color} hover:opacity-90 cursor-pointer`}
            >
              {currentRoleConfig.icon}
              <span className="hidden sm:inline">{currentRoleConfig.label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Switch Persona
                    </p>
                    <p className="text-xs text-black dark:text-gray-300 font-medium">
                      Simulate full enterprise workflow
                    </p>
                  </div>
                  {roleConfigs.map((item) => {
                    const isSelected = item.role === currentRole;
                    return (
                      <button
                        key={item.role}
                        id={`switch-role-${item.role}`}
                        onClick={() => {
                          switchRole(item.role);
                          appSwitchRole(item.role);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4F73C] text-[#121316] font-bold shadow-xs'
                            : 'text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 font-semibold'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`p-1 rounded-lg ${isSelected ? 'bg-black/10 text-[#121316]' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#121316]" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#181920] border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-black dark:text-gray-300 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-black" />}
          </button>

          {/* Notifications Bell with coral badge */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-white dark:bg-[#181920] border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-black dark:text-gray-300 flex items-center justify-center transition-all shadow-xs cursor-pointer"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF6B4A] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Account Menu Dropdown */}
          <div className="relative pl-1">
            <button
              ref={profileBtnRef}
              id="user-profile-menu-btn"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              aria-label="User account menu"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#D4F73C]"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4F73C]/50 shadow-xs"
                />
                {currentUser.verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-xs">
                    <BadgeCheck className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-black dark:text-white leading-tight flex items-center gap-1">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-gray-800 dark:text-gray-400 font-semibold truncate max-w-[120px]">
                  {currentUser.organization || 'NIT'}
                </p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-black dark:text-gray-400 hidden xl:block transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  ref={menuRef}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-profile-menu-btn"
                  onKeyDown={handleMenuKeyDown}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2.5 w-80 sm:w-84 rounded-3xl bg-white/95 dark:bg-[#15161D]/95 backdrop-blur-2xl border border-gray-200/90 dark:border-white/10 shadow-2xl z-50 p-2.5 text-left max-h-[min(88vh,720px)] overflow-y-auto overscroll-contain focus:outline-hidden"
                >
                  {/* User Profile Header Card */}
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#D4F73C]/40 shadow-xs"
                        />
                        {currentUser.verified && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#15161D] flex items-center justify-center text-white">
                            <BadgeCheck className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                          {currentUser.name}
                          {currentUser.verified && (
                            <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 font-normal">
                          {currentUser.email}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-[#D4F73C]/20 text-[#3b6009] dark:text-[#D4F73C] border border-[#D4F73C]/30">
                            {currentRole.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate font-normal">
                            {currentUser.organization || 'University Member'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary Profile Actions Section */}
                  <div className="space-y-0.5 py-1">
                    <div className="px-3 py-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                        Workspace & Records
                      </p>
                    </div>

                    {/* 1. 👤 My Profile */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-my-profile"
                      onClick={() => navigateToTab('profile')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'profile'
                          ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">My Profile</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Academic bio, skills & GPA
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                    </button>

                    {/* 2. 📄 Resume & Portfolio */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-resume-portfolio"
                      onClick={() => navigateToTab('portfolio')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'portfolio'
                          ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Resume & Portfolio</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            GitHub projects & live repositories
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                    </button>

                    {/* 3. 📜 Certificates & Achievements */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-certificates"
                      onClick={() => navigateToTab('portfolio')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer text-gray-700 dark:text-gray-200 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Certificates & Achievements</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Verified credentials & faculty seals
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                    </button>

                    {/* 4. 📋 Application Tracker */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-application-tracker"
                      onClick={() => navigateToTab('applications')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'applications'
                          ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Application Tracker</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Interviews & recruiting pipelines
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {scheduledInterviews > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {scheduledInterviews} Active
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>
                    </button>
                  </div>

                  {/* Connect & Collaborate Section */}
                  <div className="space-y-0.5 py-1 border-t border-gray-100 dark:border-white/5">
                    <div className="px-3 py-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                        Communication & Mentorship
                      </p>
                    </div>

                    {/* 5. 💬 Messages */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-messages"
                      onClick={() => navigateToTab('messages')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'messages'
                          ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Messages</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Recruiter & faculty direct chats
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {unreadMessagesCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {unreadMessagesCount}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>
                    </button>

                    {/* 6. 🔔 Notifications */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-notifications"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenNotifications();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer text-gray-700 dark:text-gray-200 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Notifications</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Deadline alerts & campus updates
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF6B4A] text-white">
                            {unreadCount}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>
                    </button>

                    {/* 7. 🤝 Mentorship */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-mentorship"
                      onClick={() => navigateToTab('mentorship')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'mentorship'
                          ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Mentorship</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            1-on-1 industry guidance & sessions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {requestedMentors > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                            {requestedMentors} Pending
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                      </div>
                    </button>
                  </div>

                  {/* Preferences & System Section */}
                  <div className="space-y-0.5 py-1 border-t border-gray-100 dark:border-white/5">
                    <div className="px-3 py-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-400">
                        Preferences & System
                      </p>
                    </div>

                    {/* 8. ⚙️ Settings */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-settings"
                      onClick={() => navigateToTab('settings')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all text-left group cursor-pointer ${
                        activeTab === 'settings'
                          ? 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-900 dark:text-white font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-500/10 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <SettingsIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Settings</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            Account, privacy & alert preferences
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
                    </button>

                    {/* 9. 🌙 Light/Dark Mode */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-theme-toggle"
                      onClick={toggleDarkMode}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer text-gray-700 dark:text-gray-200 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {isDarkMode ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Moon className="w-4 h-4 text-indigo-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Light/Dark Mode</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                            {isDarkMode ? 'Dark theme active' : 'Light theme active'}
                          </p>
                        </div>
                      </div>
                      {/* Apple-style smooth toggle switch */}
                      <div
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          isDarkMode ? 'bg-[#D4F73C]' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white dark:bg-[#121316] shadow-xs transition-transform transform ${
                            isDarkMode ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>

                    {/* 10. 🔄 Switch Role */}
                    <div className="rounded-2xl overflow-hidden transition-all">
                      <button
                        role="menuitem"
                        id="profile-dropdown-switch-role"
                        onClick={() => setRoleSwitcherExpanded(!roleSwitcherExpanded)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left group cursor-pointer text-gray-700 dark:text-gray-200 font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <ArrowLeftRight className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold leading-tight tracking-tight">Switch Role</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-normal">
                              Active: {currentRoleConfig.label}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                            roleSwitcherExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {/* Expandable Role Selector */}
                      {roleSwitcherExpanded && (
                        <div className="mt-1 px-1 py-1 space-y-1 bg-gray-50/80 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 animate-in fade-in zoom-in-95 duration-150">
                          {roleConfigs.map((item) => {
                            const isSelected = item.role === currentRole;
                            return (
                              <button
                                key={item.role}
                                id={`profile-switch-role-${item.role}`}
                                onClick={() => {
                                  switchRole(item.role);
                                  setUserMenuOpen(false);
                                  showToast(`Switched persona to ${item.label}`, 'success');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#D4F73C] text-[#121316] font-bold shadow-xs'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {item.icon}
                                  <span>{item.label}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#121316]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account & Session Footer */}
                  <div className="pt-2 mt-1 border-t border-gray-100 dark:border-white/5 space-y-1">
                    <button
                      role="menuitem"
                      id="profile-dropdown-switch-account"
                      onClick={() => {
                        setUserMenuOpen(false);
                        openAuthModal('signin');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sign In / Switch Account</span>
                    </button>

                    {/* 11. 🚪 Logout */}
                    <button
                      role="menuitem"
                      id="profile-dropdown-logout"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight tracking-tight">Logout</p>
                          <p className="text-[11px] text-rose-500/80 dark:text-rose-400/80 font-normal">
                            Sign out of current session
                          </p>
                        </div>
                      </div>
                      <LogOut className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
