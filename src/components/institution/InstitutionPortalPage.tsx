import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { InstitutionStudentItem, InstitutionCollaborationItem } from '../../types';
import { InstitutionAccessDenied } from './InstitutionAccessDenied';

// Modular Sub-Views
import { InstitutionDashboardView } from './InstitutionDashboardView';
import { InstitutionStudentsView } from './InstitutionStudentsView';
import { InstitutionFacultyView } from './InstitutionFacultyView';
import { InstitutionIndustriesView } from './InstitutionIndustriesView';
import { InstitutionDepartmentsView } from './InstitutionDepartmentsView';
import { InstitutionSkillIntelligenceView } from './InstitutionSkillIntelligenceView';
import { InstitutionInternshipsView } from './InstitutionInternshipsView';
import { InstitutionPlacementsView } from './InstitutionPlacementsView';
import { InstitutionTrainingView } from './InstitutionTrainingView';
import { InstitutionCollaborationsView } from './InstitutionCollaborationsView';
import { InstitutionReportsView } from './InstitutionReportsView';
import { InstitutionNotificationsView } from './InstitutionNotificationsView';
import { InstitutionProfileView } from './InstitutionProfileView';
import { InstitutionSettingsView } from './InstitutionSettingsView';
import { AtRiskStudentDetectionPanel } from './AtRiskStudentDetectionPanel';
import { DriveSchedulerPanel } from './DriveSchedulerPanel';
import { DepartmentComparisonDashboard } from './DepartmentComparisonDashboard';
import { RecruiterEngagementTracker } from './RecruiterEngagementTracker';
import { CentralPlacementDriveCalendar } from '../common/CentralPlacementDriveCalendar';
import { CompanyHiringHistoryView } from '../common/CompanyHiringHistoryView';
import { DocumentVerificationManager } from '../common/DocumentVerificationManager';
import { StudentPlacementFeedbackView } from '../common/StudentPlacementFeedbackView';
import { SkillToJobCompanyMappingView } from '../common/SkillToJobCompanyMappingView';
import { DownloadablePlacementReportsModal } from './DownloadablePlacementReportsModal';
import { PrivacyAndSecuritySettingsModal } from '../common/PrivacyAndSecuritySettingsModal';

// Modals
import { InstitutionStudentModal } from './InstitutionStudentModal';
import { AddPlacementModal } from './AddPlacementModal';
import { AddCollaborationModal } from './AddCollaborationModal';
import { ViewMouModal } from './ViewMouModal';

export const InstitutionPortalPage: React.FC = () => {
  const {
    institutionStudents,
    institutionCollaborations,
    addInstitutionCollaboration,
    institutionPlacements,
    addInstitutionPlacement,
    currentPath,
    navigate,
    isDarkMode,
  } = useApp();
  const { currentRole } = useAuth();

  // Determine active tab from URL path
  const getTabFromPath = (): string => {
    if (currentPath.includes('/institution/students')) return 'students';
    if (currentPath.includes('/institution/industries') || currentPath.includes('/institution/recruiters')) return 'industries';
    if (
      currentPath.includes('/institution/skill-intelligence') ||
      currentPath.includes('/institution/skills') ||
      currentPath.includes('/institution/skill-gaps') ||
      currentPath.includes('/institution/industry-demand')
    ) {
      return 'skill-intelligence';
    }
    if (currentPath.includes('/institution/internships')) return 'internships';
    if (currentPath.includes('/institution/placements') || currentPath.includes('/institution/drives')) return 'placements';
    if (currentPath.includes('/institution/training') || currentPath.includes('/institution/mentorship')) return 'training';
    if (currentPath.includes('/institution/reports') || currentPath.includes('/institution/analytics')) return 'reports';
    if (currentPath.includes('/institution/at-risk')) return 'at-risk';
    if (currentPath.includes('/institution/scheduler')) return 'scheduler';
    if (currentPath.includes('/institution/comparison') || currentPath.includes('/institution/departments')) return 'comparison';
    if (currentPath.includes('/institution/calendar') || currentPath.includes('/institution/drive-calendar')) return 'calendar';
    if (currentPath.includes('/institution/hiring-trends') || currentPath.includes('/institution/company-history')) return 'hiring-trends';
    if (currentPath.includes('/institution/verification') || currentPath.includes('/institution/documents')) return 'verification';
    if (currentPath.includes('/institution/recruiter-tracking') || currentPath.includes('/institution/partners-health')) return 'recruiter-tracking';
    if (currentPath.includes('/institution/skill-mapping')) return 'skill-mapping';
    if (currentPath.includes('/institution/feedback') || currentPath.includes('/institution/interview-experiences')) return 'feedback';
    if (currentPath.includes('/institution/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Synchronize when route changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [currentPath]);

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/institution/${tab}`);
  };

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<InstitutionStudentItem | null>(null);
  const [isAddPlacementOpen, setIsAddPlacementOpen] = useState(false);

  if (currentRole !== 'college_admin' && currentRole !== 'faculty') {
    return <InstitutionAccessDenied />;
  }

  return (
    <div id="placement-cell-portal-root" className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6 font-sans">
      {/* Sub-view rendering based on activeTab */}
      {activeTab === 'dashboard' && (
        <InstitutionDashboardView
          onNavigateTab={handleNavigateTab}
          onOpenAddPlacement={() => setIsAddPlacementOpen(true)}
          onOpenAddCollab={() => handleNavigateTab('placements')}
          onOpenReportsModal={() => setIsReportsModalOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        />
      )}

      {activeTab === 'students' && (
        <InstitutionStudentsView
          onSelectStudent={(student) => setSelectedStudent(student)}
        />
      )}

      {activeTab === 'industries' && <InstitutionIndustriesView />}

      {activeTab === 'skill-intelligence' && <InstitutionSkillIntelligenceView />}

      {activeTab === 'internships' && <InstitutionInternshipsView />}

      {activeTab === 'placements' && (
        <InstitutionPlacementsView
          onOpenAddPlacement={() => setIsAddPlacementOpen(true)}
        />
      )}

      {activeTab === 'training' && <InstitutionTrainingView />}

      {activeTab === 'at-risk' && <AtRiskStudentDetectionPanel />}

      {activeTab === 'scheduler' && <DriveSchedulerPanel />}

      {activeTab === 'comparison' && <DepartmentComparisonDashboard />}

      {activeTab === 'calendar' && <CentralPlacementDriveCalendar />}

      {activeTab === 'hiring-trends' && <CompanyHiringHistoryView />}

      {activeTab === 'verification' && <DocumentVerificationManager embeddedRole="placement_cell" />}

      {activeTab === 'recruiter-tracking' && <RecruiterEngagementTracker />}

      {activeTab === 'skill-mapping' && <SkillToJobCompanyMappingView />}

      {activeTab === 'feedback' && <StudentPlacementFeedbackView />}

      {activeTab === 'reports' && <InstitutionReportsView />}

      {activeTab === 'settings' && <InstitutionSettingsView />}

      {/* Global Placement Record Modal */}
      {selectedStudent && (
        <InstitutionStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {isAddPlacementOpen && (
        <AddPlacementModal
          isOpen={isAddPlacementOpen}
          onClose={() => setIsAddPlacementOpen(false)}
          onAddPlacement={(newPlacement) => {
            addInstitutionPlacement(newPlacement);
          }}
          students={institutionStudents}
        />
      )}

      {/* Downloadable Placement Reports Modal */}
      {isReportsModalOpen && (
        <DownloadablePlacementReportsModal
          isOpen={isReportsModalOpen}
          onClose={() => setIsReportsModalOpen(false)}
        />
      )}

      {/* Privacy and Security Settings Modal */}
      {isPrivacyModalOpen && (
        <PrivacyAndSecuritySettingsModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      )}
    </div>
  );
};
