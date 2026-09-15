export type SettingsTabType =
  | 'account'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'preferences'
  | 'help';

export interface NotificationSettingsState {
  internshipNotifications: boolean;
  jobNotifications: boolean;
  placementUpdates: boolean;
  applicationUpdates: boolean;
  workshopNotifications: boolean;
  trainingNotifications: boolean;
  mentorshipNotifications: boolean;
  collaborationNotifications: boolean;
  systemNotifications: boolean;
  emailDigest: boolean;
  pushNotifications: boolean;
}

export interface PrivacySettingsState {
  // Student
  profileVisibility: 'public' | 'campus_only' | 'private';
  recruiterVisibility: boolean;
  skillVisibility: boolean;
  portfolioVisibility: boolean;
  internshipRecommendation: boolean;

  // Faculty
  facultyProfileVisibility: 'all' | 'students_only' | 'verified_only';
  showContactEmail: boolean;
  showResearchInterests: boolean;
  showOfficeHours: boolean;

  // Industry
  companyProfileVisibility: 'public' | 'students_only';
  showRecruiterContact: boolean;
  allowDirectCandidateInquiries: boolean;
  showHiringStatistics: boolean;

  // Institution
  institutionVisibility: 'public' | 'verified_partners';
  showPlacementStatistics: boolean;
  showAccreditationData: boolean;
  allowCorporateOutreach: boolean;
}

export interface StudentPreferencesState {
  careerInterests: string[];
  preferredRoles: string[];
  preferredIndustries: string[];
  workMode: 'Remote' | 'On-site' | 'Hybrid' | 'Flexible';
  expectedStipend: string;
  openToRelocation: boolean;
}

export interface FacultyPreferencesState {
  mentorshipInterests: string[];
  researchAreas: string[];
  collaborationInterests: string[];
  maxMenteeCapacity: number;
  availableHoursPerWeek: number;
}

export interface IndustryPreferencesState {
  targetBatches: string[];
  minCgpa: number;
  targetDegrees: string[];
  minAiMatchScore: number;
  requireSkillVerification: boolean;
  fastTrackInterviews: boolean;
}

export interface InstitutionPreferencesState {
  placementRateGoal: number;
  minCtcThresholdLpa: number;
  prioritizeTier1Partners: boolean;
  mandatoryInternshipSemester: string;
  minMoUValidityYears: number;
  requirePrePlacementOffers: boolean;
}

export interface SupportTicket {
  id: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  message: string;
  userEmail: string;
  userName: string;
  userRole: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface BugReport {
  id: string;
  issueType: 'UI Glitch' | 'Performance Issue' | 'Broken Feature' | 'Data Not Saving' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  userEmail: string;
  status: 'Investigating' | 'Reproduced' | 'Resolved';
  createdAt: string;
}
