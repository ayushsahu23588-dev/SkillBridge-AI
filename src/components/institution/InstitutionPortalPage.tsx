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
    if (currentPath.includes('/institution/faculty')) return 'faculty';
    if (currentPath.includes('/institution/industries')) return 'industries';
    if (currentPath.includes('/institution/departments')) return 'departments';
    if (
      currentPath.includes('/institution/skill-intelligence') ||
      currentPath.includes('/institution/skills') ||
      currentPath.includes('/institution/skill-gaps') ||
      currentPath.includes('/institution/industry-demand')
    ) {
      return 'skill-intelligence';
    }
    if (currentPath.includes('/institution/internships')) return 'internships';
    if (currentPath.includes('/institution/placements')) return 'placements';
    if (currentPath.includes('/institution/training')) return 'training';
    if (currentPath.includes('/institution/collaborations')) return 'collaborations';
    if (currentPath.includes('/institution/reports')) return 'reports';
    if (currentPath.includes('/institution/notifications')) return 'notifications';
    if (currentPath.includes('/institution/profile')) return 'profile';
    if (currentPath.includes('/institution/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath);

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
  const [isAddCollabOpen, setIsAddCollabOpen] = useState(false);
  const [selectedCollabForMou, setSelectedCollabForMou] = useState<InstitutionCollaborationItem | null>(null);

  if (currentRole !== 'college_admin') {
    return <InstitutionAccessDenied />;
  }

  return (
    <div id="institution-portal-root" className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Sub-view rendering based on activeTab */}
      {activeTab === 'dashboard' && (
        <InstitutionDashboardView
          onNavigateTab={handleNavigateTab}
          onOpenAddPlacement={() => setIsAddPlacementOpen(true)}
          onOpenAddCollab={() => setIsAddCollabOpen(true)}
        />
      )}

      {activeTab === 'students' && (
        <InstitutionStudentsView
          onSelectStudent={(student) => setSelectedStudent(student)}
        />
      )}

      {activeTab === 'faculty' && <InstitutionFacultyView />}

      {activeTab === 'industries' && <InstitutionIndustriesView />}

      {activeTab === 'departments' && <InstitutionDepartmentsView />}

      {activeTab === 'skill-intelligence' && <InstitutionSkillIntelligenceView />}

      {activeTab === 'internships' && <InstitutionInternshipsView />}

      {activeTab === 'placements' && (
        <InstitutionPlacementsView
          onOpenAddPlacement={() => setIsAddPlacementOpen(true)}
        />
      )}

      {activeTab === 'training' && <InstitutionTrainingView />}

      {activeTab === 'collaborations' && (
        <InstitutionCollaborationsView
          onOpenAddCollab={() => setIsAddCollabOpen(true)}
        />
      )}

      {activeTab === 'reports' && <InstitutionReportsView />}

      {activeTab === 'notifications' && <InstitutionNotificationsView />}

      {activeTab === 'profile' && <InstitutionProfileView />}

      {activeTab === 'settings' && <InstitutionSettingsView />}

      {/* Global Modals */}
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

      {isAddCollabOpen && (
        <AddCollaborationModal
          isOpen={isAddCollabOpen}
          onClose={() => setIsAddCollabOpen(false)}
          onAddCollaboration={(newCollab) => {
            addInstitutionCollaboration(newCollab);
          }}
        />
      )}

      {selectedCollabForMou && (
        <ViewMouModal
          collab={selectedCollabForMou}
          onClose={() => setSelectedCollabForMou(null)}
        />
      )}
    </div>
  );
};
