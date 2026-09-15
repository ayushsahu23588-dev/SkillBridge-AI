import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { CareerChatDrawer } from './components/common/CareerChatDrawer';
import { AIAssistant } from './components/common/AIAssistant';
import { AuthModal } from './components/auth/AuthModal';

// Landing & Auth Components
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectionPage } from './components/auth/RoleSelectionPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Student Portal Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAssessmentPage } from './components/student/StudentAssessmentPage';
import { MySkillsPage } from './components/student/MySkillsPage';
import { SkillGapPage } from './components/student/SkillGapPage';
import { CareerRoadmapPage } from './components/student/CareerRoadmapPage';
import { InternshipMarketplace } from './components/student/InternshipMarketplace';
import { JobMarketplace } from './components/student/JobMarketplace';
import { ApplicationTrackingPage } from './components/student/ApplicationTrackingPage';
import { DigitalPortfolioPage } from './components/student/DigitalPortfolioPage';
import { AiResumeStudio } from './components/student/AiResumeStudio';
import { AiInterviewPrepPage } from './components/student/AiInterviewPrepPage';
import { StudentProfileView } from './components/student/StudentProfileView';
import { MentorshipAndWorkshops } from './components/student/MentorshipAndWorkshops';
import { MessagesPage } from './components/common/MessagesPage';

// Faculty Portal Components
import { FacultyPortalPage } from './components/faculty/FacultyPortalPage';

// Industry Portal Components
import { IndustryDashboardPage } from './components/industry/IndustryDashboardPage';
import { PostInternshipPage } from './components/industry/PostInternshipPage';
import { PostJobPage } from './components/industry/PostJobPage';
import { PostProjectPage } from './components/industry/PostProjectPage';
import { ManageOpportunitiesPage } from './components/industry/ManageOpportunitiesPage';
import { AiCandidateMatchingPage } from './components/industry/AiCandidateMatchingPage';
import { ShortlistedCandidatesPage } from './components/industry/ShortlistedCandidatesPage';
import { IndustryApplicationsPage } from './components/industry/IndustryApplicationsPage';
import { IndustryMentorshipPage } from './components/industry/IndustryMentorshipPage';
import { IndustryWorkshopsPage } from './components/industry/IndustryWorkshopsPage';
import { IndustryProfilePage } from './components/industry/IndustryProfilePage';
import { PostOpportunityPage } from './components/industry/PostOpportunityPage';

// Institution Portal Components
import { InstitutionPortalPage } from './components/institution/InstitutionPortalPage';

// Platform Administration Portal Components
import { AdminPortalPage } from './components/admin/AdminPortalPage';

// Settings Page Component
import { SettingsPage } from './components/settings/SettingsPage';

const MainAppLayout: React.FC = () => {
  const {
    currentRole,
    currentPath,
    isLandingView,
    isDarkMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    navigate,
  } = useApp();
  const {
    isAuthenticated,
    isLoggingOut,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    targetRoleForModal,
  } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCareerChatOpen, setIsCareerChatOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  const isPublicRoute =
    isLandingView ||
    currentPath === '/' ||
    currentPath === '' ||
    currentPath === '/login' ||
    currentPath === '/register' ||
    currentPath === '/role-selection';

  // Prevent access to protected routes post-logout
  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      navigate('/login', true);
    }
  }, [isAuthenticated, isPublicRoute, navigate]);

  // UI Loading State during Logout
  if (isLoggingOut) {
    return (
      <div
        id="logout-loading-screen"
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'
        } font-sans px-4`}
      >
        <div className="flex flex-col items-center gap-4 text-center p-8 max-w-sm rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <LogOut className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Signing Out...</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Securing active session and redirecting to login.
            </p>
          </div>
          <div className="w-6 h-6 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mt-1" />
        </div>
      </div>
    );
  }

  // If in landing mode or root route, show Landing Page
  if (isLandingView || currentPath === '/' || currentPath === '') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'} font-sans`}>
        <LandingPage />
        <ToastContainer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          initialRole={targetRoleForModal || currentRole}
        />
      </div>
    );
  }

  // Role Selection Route
  if (currentPath === '/role-selection') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'} font-sans`}>
        <RoleSelectionPage />
        <ToastContainer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          initialRole={targetRoleForModal || currentRole}
        />
      </div>
    );
  }

  // Standalone Login Route or Protected Route Blocked
  if (currentPath === '/login' || (!isAuthenticated && !isPublicRoute)) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'} font-sans`}>
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  // Standalone Register Route
  if (currentPath === '/register') {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'} font-sans`}>
        <RegisterPage />
        <ToastContainer />
      </div>
    );
  }

  // Active View Router for Role Portals
  const renderActivePortalView = () => {
    // 0. Global Settings Route
    if (currentPath === '/settings' || currentPath.endsWith('/settings') || currentPath.includes('/settings')) {
      return <SettingsPage />;
    }

    // 0b. Global Messages Route
    if (currentPath === '/messages' || currentPath.endsWith('/messages') || currentPath.includes('/messages')) {
      return <MessagesPage />;
    }

    // 1. Student Portal Routes
    if (currentRole === 'student' || currentPath.startsWith('/student')) {
      if (currentPath.includes('/profile')) return <StudentProfileView />;
      if (currentPath.includes('/mentorship')) return <MentorshipAndWorkshops />;
      if (currentPath.includes('/messages')) return <MessagesPage />;
      if (currentPath.includes('/assessment')) return <StudentAssessmentPage />;
      if (currentPath.includes('/skills')) return <MySkillsPage />;
      if (currentPath.includes('/skill-gap')) return <SkillGapPage />;
      if (currentPath.includes('/roadmap')) return <CareerRoadmapPage />;
      if (currentPath.includes('/internships')) return <InternshipMarketplace />;
      if (currentPath.includes('/jobs')) return <JobMarketplace />;
      if (currentPath.includes('/applications')) return <ApplicationTrackingPage />;
      if (currentPath.includes('/portfolio')) return <DigitalPortfolioPage />;
      if (currentPath.includes('/resume-studio')) return <AiResumeStudio />;
      if (currentPath.includes('/interview-prep')) return <AiInterviewPrepPage />;
      return <StudentDashboard />;
    }

    // 2. Faculty Portal Routes
    if (currentRole === 'faculty' || currentPath.startsWith('/faculty')) {
      return <FacultyPortalPage />;
    }

    // 3. Industry Portal Routes
    if (currentRole === 'company' || currentPath.startsWith('/industry')) {
      if (currentPath.includes('/post-internship')) return <PostInternshipPage />;
      if (currentPath.includes('/post-job')) return <PostJobPage />;
      if (currentPath.includes('/post-project')) return <PostProjectPage />;
      if (currentPath.includes('/post-opportunity')) return <PostOpportunityPage />;
      if (currentPath.includes('/manage-opportunities') || currentPath.includes('/opportunities'))
        return <ManageOpportunitiesPage />;
      if (currentPath.includes('/candidates')) return <AiCandidateMatchingPage />;
      if (currentPath.includes('/shortlisted')) return <ShortlistedCandidatesPage />;
      if (currentPath.includes('/applications')) return <IndustryApplicationsPage />;
      if (currentPath.includes('/mentorship')) return <IndustryMentorshipPage />;
      if (currentPath.includes('/workshops') || currentPath.includes('/challenges'))
        return <IndustryWorkshopsPage />;
      if (currentPath.includes('/profile') || currentPath.includes('/settings'))
        return <IndustryProfilePage />;
      return <IndustryDashboardPage />;
    }

    // 4. Institution Portal Routes
    if (
      currentRole === 'college_admin' ||
      currentPath.startsWith('/institution')
    ) {
      return <InstitutionPortalPage />;
    }

    // 5. Super Admin / Platform Administration Routes
    if (
      currentRole === 'super_admin' ||
      currentPath.startsWith('/admin')
    ) {
      return <AdminPortalPage />;
    }

    // Fallback to Student Dashboard
    return <StudentDashboard />;
  };

  return (
    <div
      id="app-root"
      className={`min-h-screen ${
        isDarkMode ? 'dark bg-[#0D0E13] text-white' : 'bg-[#F5F6FA] text-gray-900'
      } flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 gap-6">
        {/* Left Sticky Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <Sidebar
              onSelectAiChat={() => setIsCareerChatOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />
          </div>
        </aside>

        {/* Center Content Workspace */}
        <main className="flex-1 min-w-0" id="main-content-area">
          {renderActivePortalView()}
        </main>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative w-80 max-w-[85vw] h-full bg-white dark:bg-[#121318] shadow-2xl p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                onSelectAiChat={() => {
                  setIsMobileMenuOpen(false);
                  setIsCareerChatOpen(true);
                }}
                onOpenNotifications={() => {
                  setIsMobileMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Drawers & Modals */}
      <ToastContainer />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CareerChatDrawer
        isOpen={isCareerChatOpen}
        onClose={() => setIsCareerChatOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        initialRole={targetRoleForModal || currentRole}
      />
      {/* Global AI Assistant Floating Button & Panel */}
      <AIAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppLayout />
      </AppProvider>
    </AuthProvider>
  );
}
