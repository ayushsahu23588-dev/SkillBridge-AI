import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  JobPosting,
  Application,
  FacultyMember,
  CollegeInfo,
  CompanyPartner,
  MentorshipSession,
  Workshop,
  NotificationItem,
  AuditLog,
  ApplicationStatus,
  StudentSkill,
  Certification,
  Project,
  Experience,
  LearningRoadmap,
  Education,
  Achievement,
  StudentActivity,
  CompanyOffer,
  CompanyInterview,
  CompanyTeamMember,
  CandidateSearchProfile,
  CompanySettings,
  SkillAssessmentSession,
  RoadmapPhaseMilestone,
  IndustryOpportunity,
  ShortlistedCandidate,
  IndustryMentorshipProgram,
  IndustryWorkshopItem,
  IndustryProfileData,
  FacultyInternshipItem,
  IndustrialTrainingItem,
  FDPProgramItem,
  FacultyConsultancyItem,
  ResearchCollaborationItem,
  FacultyWorkshopItem,
  GuestLectureItem,
  FacultyIndustryProjectItem,
  FacultyMentorshipItem,
  AcademicProfileData,
  InstitutionStudentItem,
  InstitutionCollaborationItem,
  InstitutionPlacementItem,
  InstitutionSettingsData,
  AdminUserItem,
  AdminOpportunityItem,
  AdminApplicationItem,
  PlatformSettingsData,
} from '../types';
import { SupabaseDataService } from '../services/supabaseDataService';
import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_FACULTY,
  INITIAL_COLLEGE,
  INITIAL_MENTORSHIPS,
  INITIAL_WORKSHOPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DIRECT_MESSAGES,
  INITIAL_COMPANY_OFFERS,
  INITIAL_COMPANY_INTERVIEWS,
  INITIAL_COMPANY_TEAM,
  INITIAL_CANDIDATE_POOL,
  INITIAL_COMPANY_SETTINGS,
} from '../data/mockData';
import {
  DEMO_CANDIDATES,
  INITIAL_INDUSTRY_OPPORTUNITIES,
  INITIAL_SHORTLISTED_CANDIDATES,
  INITIAL_INDUSTRY_MENTORSHIP,
  INITIAL_INDUSTRY_WORKSHOPS,
  INITIAL_INDUSTRY_PROFILE,
  INITIAL_FACULTY_INTERNSHIPS,
  INITIAL_INDUSTRIAL_TRAINING,
  INITIAL_FDP_PROGRAMS,
  INITIAL_FACULTY_CONSULTANCY,
  INITIAL_RESEARCH_COLLABORATIONS,
  INITIAL_FACULTY_WORKSHOPS,
  INITIAL_GUEST_LECTURES,
  INITIAL_FACULTY_PROJECTS,
  INITIAL_FACULTY_MENTORSHIP,
  INITIAL_ACADEMIC_PROFILE,
} from '../data/industryFacultyMockData';
import {
  STORAGE_KEYS,
  INITIAL_INSTITUTION_STUDENTS,
  INITIAL_INSTITUTION_COLLABORATIONS,
  INITIAL_INSTITUTION_PLACEMENTS,
  INITIAL_INSTITUTION_SETTINGS,
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_OPPORTUNITIES,
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_PLATFORM_SETTINGS,
} from '../data/institutionAdminMockData';

interface ToastState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface ConversationItem {
  id: string;
  contactName: string;
  contactRole: string;
  contactAvatar: string;
  avatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isSelf: boolean;
  }[];
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  addSkillToStudent: (skill: Omit<StudentSkill, 'id'>) => void;
  deleteSkill: (skillId: string) => void;
  updateSkillLevel: (skillId: string, level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert', score?: number) => void;
  recordSkillAssessment: (skillName: string, score: number) => void;
  
  addCertification: (cert: Omit<Certification, 'id' | 'verified'>) => void;
  deleteCertification: (certId: string) => void;
  
  addProject: (proj: Omit<Project, 'id' | 'likesCount'>) => void;
  updateProject: (projId: string, proj: Partial<Project>) => void;
  deleteProject: (projId: string) => void;
  toggleProjectFeatured: (projId: string) => void;
  
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (eduId: string, edu: Partial<Education>) => void;
  deleteEducation: (eduId: string) => void;
  
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (expId: string, exp: Partial<Experience>) => void;
  deleteExperience: (expId: string) => void;
  
  addAchievement: (ach: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (achId: string) => void;
  
  addStudentActivity: (act: Omit<StudentActivity, 'id' | 'timestamp'>) => void;
  
  uploadResumeFile: (fileName: string, extractedText: string, fileUrl?: string) => void;
  updateCareerPreferences: (prefs: StudentProfile['careerPreferences']) => void;
  updateStudentSettings: (settings: StudentProfile['settings']) => void;
  
  addLearningRoadmap: (roadmap: LearningRoadmap) => void;
  toggleMilestone: (roadmapId: string, phaseIndex: number) => void;
  
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, 'id' | 'postedDate' | 'applicantCount'>) => void;
  editJob: (jobId: string, updates: Partial<JobPosting>) => void;
  deleteJob: (jobId: string) => void;
  applyForJob: (jobId: string) => void;
  saveJob: (jobId: string) => void;
  
  applications: Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  
  facultyMembers: FacultyMember[];
  verifyStudentCertificate: (certId: string, facultyName: string) => void;
  endorseStudentSkill: (skillId: string, endorsement: string, score: number) => void;
  
  companies: CompanyPartner[];
  currentCompany: CompanyPartner;
  updateCompanyProfile: (companyId: string, updates: Partial<CompanyPartner>) => void;
  requestCompanyVerification: (doc: { title: string; type: string; fileUrl: string }) => void;
  verifyCompany: (companyId: string) => void;
  
  companyOffers: CompanyOffer[];
  extendCompanyOffer: (offerData: Omit<CompanyOffer, 'id' | 'extendedAt'>) => void;
  updateOfferStatus: (offerId: string, status: CompanyOffer['status']) => void;
  
  companyInterviews: CompanyInterview[];
  scheduleCompanyInterview: (interviewData: Omit<CompanyInterview, 'id'>) => void;
  updateCompanyInterview: (interviewId: string, updates: Partial<CompanyInterview>) => void;
  
  companyTeam: CompanyTeamMember[];
  addCompanyTeamMember: (member: Omit<CompanyTeamMember, 'id' | 'companyId' | 'addedAt'>) => void;
  removeCompanyTeamMember: (memberId: string) => void;
  
  candidatePool: CandidateSearchProfile[];
  inviteCandidateToJob: (candidateId: string, jobId: string, message: string) => void;
  
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  
  collegeInfo: CollegeInfo;
  updateCollegeInfo: (info: Partial<CollegeInfo>) => void;
  
  mentorships: MentorshipSession[];
  requestMentorship: (facultyId: string, topic: string, date: string, time: string) => void;
  updateMentorshipStatus: (sessionId: string, status: 'Scheduled' | 'Completed' | 'Declined', meetingLink?: string) => void;
  
  workshops: Workshop[];
  registerForWorkshop: (workshopId: string) => void;
  createWorkshop: (workshop: Omit<Workshop, 'id' | 'registeredCount'>) => void;
  
  directConversations: ConversationItem[];
  sendDirectMessage: (conversationId: string, text: string) => void;
  
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  
  auditLogs: AuditLog[];
  addAuditLog: (action: string, status?: 'Success' | 'Warning' | 'Security Alert') => void;
  
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Navigation & role-based routing
  currentRole: UserRole;
  isLandingView: boolean;
  goToLanding: () => void;
  currentPath: string;
  navigate: (path: string, replace?: boolean) => void;
  selectedInternshipId: string | null;
  setSelectedInternshipId: (id: string | null) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  publishNewOpportunity: (opportunity: Partial<JobPosting>) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Step 4 & 5 Assessment, Roadmap, and Matching States
  assessmentSession: SkillAssessmentSession | null;
  saveAssessmentSession: (session: SkillAssessmentSession) => void;
  selectedCareerRole: string;
  setSelectedCareerRole: (role: string) => void;
  roadmapMilestones: RoadmapPhaseMilestone[];
  updateRoadmapMilestoneStatus: (
    milestoneId: string,
    status: RoadmapPhaseMilestone['status'],
    progress: number
  ) => void;
  savedInternshipIds: string[];
  toggleSaveInternship: (internshipId: string) => void;
  applyForJobWithDetails: (
    jobId: string,
    pitch?: string,
    customResume?: string
  ) => Promise<boolean>;

  // Step 6: Industry Portal Specific State & Handlers
  industryOpportunities: IndustryOpportunity[];
  addOpportunity: (opportunity: Omit<IndustryOpportunity, 'id' | 'postedDate' | 'applicationsCount'>) => void;
  updateOpportunity: (oppId: string, updates: Partial<IndustryOpportunity>) => void;
  closeOpportunity: (oppId: string) => void;
  deleteOpportunity: (oppId: string) => void;
  shortlistedCandidates: ShortlistedCandidate[];
  shortlistCandidate: (candidateId: string, opportunityId: string, notes?: string) => void;
  removeFromShortlist: (shortlistId: string) => void;
  removeShortlistedCandidate: (candidateIdOrShortlistId: string, opportunityId?: string) => void;
  updateShortlistStatus: (shortlistId: string, status: ShortlistedCandidate['status']) => void;
  updateShortlistedStatus: (
    candidateIdOrShortlistId: string,
    opportunityIdOrStatus: string | ShortlistedCandidate['status'],
    maybeStatus?: ShortlistedCandidate['status']
  ) => void;
  scheduleInterview: (
    candidateIdOrShortlistId: string,
    details: { date: string; time: string; type: 'Online' | 'In-person'; locationOrLink: string; notes?: string }
  ) => void;
  industryMentorship: IndustryMentorshipProgram[];
  addMentorshipProgram: (program: Omit<IndustryMentorshipProgram, 'id' | 'currentStudents'>) => void;
  industryWorkshopsList: IndustryWorkshopItem[];
  addIndustryWorkshop: (workshop: Omit<IndustryWorkshopItem, 'id' | 'registeredCount'>) => void;
  industryProfile: IndustryProfileData;
  updateIndustryProfileData: (updates: Partial<IndustryProfileData>) => void;

  // Step 7: Faculty Portal Specific State & Handlers
  facultyInternships: FacultyInternshipItem[];
  recommendFacultyInternship: (internshipId: string) => void;
  industrialTraining: IndustrialTrainingItem[];
  addIndustrialTraining: (training: Omit<IndustrialTrainingItem, 'id' | 'progress'>) => void;
  updateIndustrialTraining: (trainingId: string, updates: Partial<IndustrialTrainingItem>) => void;
  fdpPrograms: FDPProgramItem[];
  addFDPProgram: (fdp: Omit<FDPProgramItem, 'id'>) => void;
  registerForFDP: (fdpId: string) => void;
  facultyConsultancy: FacultyConsultancyItem[];
  addFacultyConsultancy: (cons: Omit<FacultyConsultancyItem, 'id'>) => void;
  updateFacultyConsultancyStatus: (consId: string, status: FacultyConsultancyItem['status']) => void;
  researchCollaborations: ResearchCollaborationItem[];
  addResearchCollaboration: (collab: Omit<ResearchCollaborationItem, 'id'>) => void;
  updateResearchCollaborationStatus: (collabId: string, status: ResearchCollaborationItem['status']) => void;
  facultyWorkshops: FacultyWorkshopItem[];
  addFacultyWorkshop: (workshop: Omit<FacultyWorkshopItem, 'id' | 'enrolledStudentsCount'>) => void;
  guestLectures: GuestLectureItem[];
  addGuestLecture: (gl: Omit<GuestLectureItem, 'id' | 'participantsCount'>) => void;
  cancelGuestLecture: (lectureId: string) => void;
  facultyIndustryProjects: FacultyIndustryProjectItem[];
  addFacultyIndustryProject: (proj: Omit<FacultyIndustryProjectItem, 'id' | 'progressPercentage'>) => void;
  assignStudentToFacultyProject: (projectId: string, student: { id: string; name: string; avatar?: string; role: string }) => void;
  updateFacultyProjectProgress: (projectId: string, progress: number, status?: FacultyIndustryProjectItem['status']) => void;
  facultyMentorship: FacultyMentorshipItem[];
  addFacultyMentorshipFeedback: (mentorshipId: string, feedback: string, progress?: number, status?: FacultyMentorshipItem['status']) => void;
  academicProfile: AcademicProfileData;
  updateAcademicProfileData: (updates: Partial<AcademicProfileData>) => void;

  // Step 8: Institution Portal Specific State & Handlers
  institutionStudents: InstitutionStudentItem[];
  updateInstitutionStudent: (id: string, updates: Partial<InstitutionStudentItem>) => void;
  institutionCollaborations: InstitutionCollaborationItem[];
  addInstitutionCollaboration: (collab: Omit<InstitutionCollaborationItem, 'id'>) => void;
  updateInstitutionCollaboration: (id: string, updates: Partial<InstitutionCollaborationItem>) => void;
  deleteInstitutionCollaboration: (id: string) => void;
  institutionPlacements: InstitutionPlacementItem[];
  addInstitutionPlacement: (placement: Omit<InstitutionPlacementItem, 'id'>) => void;
  institutionSettings: InstitutionSettingsData;
  updateInstitutionSettings: (updates: Partial<InstitutionSettingsData>) => void;

  // Step 9: Platform Administration & Analytics State & Handlers
  adminUsers: AdminUserItem[];
  updateAdminUserStatus: (userId: string, status: AdminUserItem['status']) => void;
  updateAdminUserRole: (userId: string, role: UserRole) => void;
  updateAdminUser: (userId: string, updates: Partial<AdminUserItem>) => void;
  deleteAdminUser: (userId: string) => void;
  adminOpportunities: AdminOpportunityItem[];
  updateAdminOpportunityStatus: (oppId: string, status: AdminOpportunityItem['status']) => void;
  updateAdminOpportunity: (oppId: string, updates: Partial<AdminOpportunityItem>) => void;
  adminApplications: AdminApplicationItem[];
  updateAdminApplicationStatus: (appId: string, status: AdminApplicationItem['status']) => void;
  updateAdminApplication: (appId: string, updates: Partial<AdminApplicationItem>) => void;
  platformSettings: PlatformSettingsData;
  updatePlatformSettings: (updates: Partial<PlatformSettingsData>) => void;
  resetPlatformDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'edubridge_platform_state_v1';

export const DEFAULT_ASSESSMENT_SESSION: SkillAssessmentSession = {
  techSkills: {
    'Python': 78,
    'SQL': 82,
    'Java': 61,
    'DSA': 48,
    'Algorithms': 52,
    'Git/GitHub': 70,
    'REST APIs': 45,
    'Cloud Fundamentals': 40,
    'Web Development': 74,
  },
  softSkills: {
    'Communication': 68,
    'Problem Solving': 80,
    'Teamwork': 85,
    'Leadership': 70,
    'Time Management': 65,
  },
  interests: ['Software Development', 'AI/ML', 'Cloud Computing'],
  aptitudeScore: 75,
  submittedAt: 'Verified Benchmark Session',
  overallReadiness: 72,
  technicalScore: 68,
  softSkillScore: 74,
  aptitudeCalculatedScore: 75,
  toolsScore: 70,
  topStrengths: [
    { skill: 'SQL', score: 82, category: 'Database Systems' },
    { skill: 'Problem Solving', score: 80, category: 'Aptitude & Logic' },
    { skill: 'Python', score: 78, category: 'Backend & Data' },
    { skill: 'Web Development', score: 74, category: 'Frontend' },
    { skill: 'Git/GitHub', score: 70, category: 'Tooling & CI/CD' },
  ],
  skillGaps: [
    {
      skill: 'Python',
      currentLevel: 78,
      requiredLevel: 80,
      gap: 2,
      status: 'Strong',
      category: 'Technical',
      priority: 'Low',
      recommendedAction: 'Continue hands-on scripts and clean modular OOP architecture.',
      whyItMatters: 'Core scripting and backend foundation used in 70%+ of modern software engineering stacks.',
    },
    {
      skill: 'SQL',
      currentLevel: 82,
      requiredLevel: 80,
      gap: -2,
      status: 'Strong',
      category: 'Technical',
      priority: 'Low',
      recommendedAction: 'Master PostgreSQL query optimization and distributed database schemas.',
      whyItMatters: 'Essential for high-throughput transactional databases and enterprise report generation.',
    },
    {
      skill: 'Java',
      currentLevel: 61,
      requiredLevel: 75,
      gap: 14,
      status: 'Needs Improvement',
      category: 'Technical',
      priority: 'Medium',
      recommendedAction: 'Build Spring Boot REST microservices with JPA/Hibernate data access.',
      whyItMatters: 'Core requirement for enterprise banking, financial and cloud infrastructure positions.',
    },
    {
      skill: 'DSA',
      currentLevel: 48,
      requiredLevel: 75,
      gap: 27,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Practice LeetCode mediums focusing on Trees, Graphs, and Dynamic Programming.',
      whyItMatters: 'Primary screening benchmark for technical online tests and live coding rounds.',
    },
    {
      skill: 'Algorithms',
      currentLevel: 52,
      requiredLevel: 75,
      gap: 23,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Study Divide & Conquer, greedy strategies, and algorithmic complexity analysis.',
      whyItMatters: 'Crucial for coding test efficiency, space-time optimization, and system scalability.',
    },
    {
      skill: 'Git/GitHub',
      currentLevel: 70,
      requiredLevel: 75,
      gap: 5,
      status: 'Improve',
      category: 'Tools',
      priority: 'Low',
      recommendedAction: 'Set up GitHub Actions CI/CD workflows and practice branch rebasing/cherry-picks.',
      whyItMatters: 'Universal team collaboration standard across every modern technology company.',
    },
    {
      skill: 'Communication',
      currentLevel: 68,
      requiredLevel: 75,
      gap: 7,
      status: 'Improve',
      category: 'Soft Skills',
      priority: 'Medium',
      recommendedAction: 'Practice the STAR method for behavioral interviews and explain technical architecture out loud.',
      whyItMatters: 'Determines interview conversion rates, team leadership, and cross-functional velocity.',
    },
    {
      skill: 'REST APIs',
      currentLevel: 45,
      requiredLevel: 70,
      gap: 25,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Build full CRUD RESTful endpoints with authentication, rate limiting, and Swagger documentation.',
      whyItMatters: 'The universal communication backbone connecting client applications with backend services.',
    },
    {
      skill: 'Cloud Fundamentals',
      currentLevel: 40,
      requiredLevel: 65,
      gap: 25,
      status: 'High Priority',
      category: 'Tools',
      priority: 'High',
      recommendedAction: 'Deploy containerized Docker applications on AWS Elastic Beanstalk or Google Cloud Run.',
      whyItMatters: 'Modern engineering requires familiarity with cloud infrastructure, VMs, and serverless compute.',
    },
  ],
  priorityGaps: [
    {
      skill: 'DSA',
      currentLevel: 48,
      requiredLevel: 75,
      gap: 27,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Practice LeetCode mediums focusing on Trees, Graphs, and Dynamic Programming.',
      whyItMatters: 'Primary screening benchmark for technical online tests and live coding rounds.',
    },
    {
      skill: 'REST APIs',
      currentLevel: 45,
      requiredLevel: 70,
      gap: 25,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Build full CRUD RESTful endpoints with authentication, rate limiting, and Swagger documentation.',
      whyItMatters: 'The universal communication backbone connecting client applications with backend services.',
    },
    {
      skill: 'Cloud Fundamentals',
      currentLevel: 40,
      requiredLevel: 65,
      gap: 25,
      status: 'High Priority',
      category: 'Tools',
      priority: 'High',
      recommendedAction: 'Deploy containerized Docker applications on AWS Elastic Beanstalk or Google Cloud Run.',
      whyItMatters: 'Modern engineering requires familiarity with cloud infrastructure, VMs, and serverless compute.',
    },
    {
      skill: 'Algorithms',
      currentLevel: 52,
      requiredLevel: 75,
      gap: 23,
      status: 'High Priority',
      category: 'Technical',
      priority: 'High',
      recommendedAction: 'Study Divide & Conquer, greedy strategies, and algorithmic complexity analysis.',
      whyItMatters: 'Crucial for coding test efficiency, space-time optimization, and system scalability.',
    },
    {
      skill: 'Java',
      currentLevel: 61,
      requiredLevel: 75,
      gap: 14,
      status: 'Needs Improvement',
      category: 'Technical',
      priority: 'Medium',
      recommendedAction: 'Build Spring Boot REST microservices with JPA/Hibernate data access.',
      whyItMatters: 'Core requirement for enterprise banking, financial and cloud infrastructure positions.',
    },
  ],
  recommendedCareers: [
    {
      id: 'rec_swe',
      title: 'Software Developer',
      targetRoleKey: 'Software Developer',
      matchPercentage: 84,
      requiredSkills: ['Python', 'SQL', 'DSA', 'Git', 'REST APIs'],
      strongestMatchingSkills: ['Python (78%)', 'SQL (82%)', 'Git (70%)'],
      missingSkills: ['DSA', 'REST APIs'],
      marketDemand: 'Very High',
      avgSalaryRange: '₹6.5 - ₹12.0 LPA',
      whyRecommended:
        'Your strong Python, SQL and problem-solving foundation makes Software Development your highest-probability career match. Improving DSA and REST APIs will accelerate placement readiness.',
    },
    {
      id: 'rec_be',
      title: 'Backend Developer',
      targetRoleKey: 'Backend Developer',
      matchPercentage: 81,
      requiredSkills: ['Python', 'SQL', 'REST APIs', 'Java', 'Databases'],
      strongestMatchingSkills: ['SQL (82%)', 'Python (78%)'],
      missingSkills: ['REST APIs', 'Java', 'Docker'],
      marketDemand: 'Very High',
      avgSalaryRange: '₹7.0 - ₹13.5 LPA',
      whyRecommended:
        'Your database proficiency and server-side scripting provide an exceptional base for building high-scale distributed backend systems.',
    },
    {
      id: 'rec_da',
      title: 'Data Analyst',
      targetRoleKey: 'Data Analyst',
      matchPercentage: 73,
      requiredSkills: ['SQL', 'Python', 'Statistics', 'PowerBI / Tableau'],
      strongestMatchingSkills: ['SQL (82%)', 'Python (78%)'],
      missingSkills: ['Tableau', 'PowerBI', 'Data Warehousing'],
      marketDemand: 'High',
      avgSalaryRange: '₹5.5 - ₹9.0 LPA',
      whyRecommended:
        'Strong SQL and algorithmic analysis make you a natural fit for structured data wrangling, KPI dashboards, and business intelligence.',
    },
    {
      id: 'rec_ai',
      title: 'AI/ML Developer',
      targetRoleKey: 'AI/ML Developer',
      matchPercentage: 69,
      requiredSkills: ['Python', 'Linear Algebra', 'PyTorch / TensorFlow', 'DSA'],
      strongestMatchingSkills: ['Python (78%)', 'Problem Solving (80%)'],
      missingSkills: ['Deep Learning', 'PyTorch', 'Vector Databases'],
      marketDemand: 'Very High',
      avgSalaryRange: '₹8.0 - ₹16.0 LPA',
      whyRecommended:
        'High Python proficiency and mathematical aptitude provide a great springboard. Closing gaps in model training pipelines will unlock senior AI roles.',
    },
  ],
  aiExplanation:
    'Your strong Python, SQL and problem-solving foundation makes Software Development a strong match. Improving DSA, Algorithms and REST APIs would significantly increase your readiness.',
};

export const DEFAULT_ROADMAP_MILESTONES: RoadmapPhaseMilestone[] = [
  {
    id: 'phase_1',
    phaseNumber: 1,
    phaseName: 'Foundation',
    month: 'Month 1',
    title: 'DSA Fundamentals & Core Computer Science Gaps',
    description: 'Master binary search, linked lists, trees, graphs, and algorithmic complexity analysis.',
    focusTopics: [
      'Data Structures & Algorithms (Trees, Graphs, DP)',
      'Time & Space Complexity Benchmarks',
      'Advanced Git & GitHub Team Collaboration',
      'Diagnostic Coding Tests & LeetCode Practice',
    ],
    status: 'Completed',
    progress: 100,
    estimatedDuration: '4 Weeks (10 hrs/wk)',
    skillsGained: ['DSA', 'Algorithms', 'Git/GitHub'],
    actionLabel: 'Review Practice Solutions',
    actionTarget: '/student/assessment',
  },
  {
    id: 'phase_2',
    phaseNumber: 2,
    phaseName: 'Development Skills',
    month: 'Month 2',
    title: 'Modern Backend, REST APIs & Database Architecture',
    description: 'Build enterprise-grade REST APIs with authentication, middleware, and optimized SQL schemas.',
    focusTopics: [
      'RESTful API Principles & OpenAPI Specification',
      'Backend Microservices in Python & Java',
      'Relational Database Indexing & Query Tuning',
      'Unit & Integration Testing Automation',
    ],
    status: 'In Progress',
    progress: 65,
    estimatedDuration: '4 Weeks (12 hrs/wk)',
    skillsGained: ['REST APIs', 'Java', 'SQL Optimization'],
    actionLabel: 'Continue Learning Module',
    actionTarget: '/student/skills',
  },
  {
    id: 'phase_3',
    phaseNumber: 3,
    phaseName: 'Project Building',
    month: 'Month 3',
    title: 'Production Capstone Project & Cloud Deployment',
    description: 'Construct and containerize a full-stack production application deployed to real cloud infrastructure.',
    focusTopics: [
      'Containerization with Docker & Multi-Stage Builds',
      'Cloud Deployment (AWS Elastic Beanstalk / Cloud Run)',
      'CI/CD Workflows with GitHub Actions',
      'Open Source Project Readme & Demo Video',
    ],
    status: 'Upcoming',
    progress: 0,
    estimatedDuration: '4 Weeks (12 hrs/wk)',
    skillsGained: ['Docker', 'Cloud Fundamentals', 'CI/CD Pipelines'],
    actionLabel: 'View Project Specs',
    actionTarget: '/student/portfolio',
  },
  {
    id: 'phase_4',
    phaseNumber: 4,
    phaseName: 'Industry Preparation',
    month: 'Month 4',
    title: 'Resume Polishing & Technical Interview Mastery',
    description: 'Tweak ATS resume metrics, build public digital portfolio, and run simulated technical rounds.',
    focusTopics: [
      'ATS Resume Optimization (Action Verbs & Metrics)',
      'Digital Portfolio with Live Demo Links',
      'System Design Basics & Behavioral STAR Method',
      'AI Simulated Mock Technical Interviews',
    ],
    status: 'Upcoming',
    progress: 0,
    estimatedDuration: '3 Weeks (6 hrs/wk)',
    skillsGained: ['Communication', 'Interview Prep', 'ATS Resume Tuning'],
    actionLabel: 'Open AI Resume Studio',
    actionTarget: '/student/resume-studio',
  },
  {
    id: 'phase_5',
    phaseNumber: 5,
    phaseName: 'Internship & Career',
    month: 'Month 5+',
    title: 'Internship Applications & Placement Pipeline',
    description: 'Directly apply to verified partner openings with high AI match scores and faculty endorsements.',
    focusTopics: [
      'Direct Application to Verified Industry Partners',
      'Faculty Endorsement & Certificate Verification',
      'Live Technical Evaluation Rounds',
      'Offer Negotiation & Onboarding Formalities',
    ],
    status: 'Locked',
    progress: 0,
    estimatedDuration: 'Ongoing',
    skillsGained: ['Industry Experience', 'Placement Readiness'],
    actionLabel: 'Browse Matching Internships',
    actionTarget: '/student/internships',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('edubridge_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'dark';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edubridge_dark_mode');
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
    localStorage.setItem('edubridge_theme_mode', mode);
    if (mode === 'light') {
      setIsDarkMode(false);
    } else if (mode === 'dark') {
      setIsDarkMode(true);
    } else if (mode === 'system') {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(Boolean(prefersDark));
    }
  };

  useEffect(() => {
    if (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Cached state restore
  const getCachedState = () => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };
  const cachedState = getCachedState();

  // Current User
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  
  // Data states
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    return cachedState?.studentProfile || INITIAL_STUDENT_PROFILE;
  });
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    return cachedState?.jobs || INITIAL_JOBS;
  });
  const [applications, setApplications] = useState<Application[]>(() => {
    return cachedState?.applications || INITIAL_APPLICATIONS;
  });
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [companies, setCompanies] = useState<CompanyPartner[]>(INITIAL_COMPANIES);
  const [companyOffers, setCompanyOffers] = useState<CompanyOffer[]>(INITIAL_COMPANY_OFFERS);
  const [companyInterviews, setCompanyInterviews] = useState<CompanyInterview[]>(INITIAL_COMPANY_INTERVIEWS);
  const [companyTeam, setCompanyTeam] = useState<CompanyTeamMember[]>(INITIAL_COMPANY_TEAM);
  const [candidatePool, setCandidatePool] = useState<CandidateSearchProfile[]>(INITIAL_CANDIDATE_POOL);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [collegeInfo, setCollegeInfo] = useState<CollegeInfo>(INITIAL_COLLEGE);
  const [mentorships, setMentorships] = useState<MentorshipSession[]>(INITIAL_MENTORSHIPS);
  const [workshops, setWorkshops] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [directConversations, setDirectConversations] = useState<ConversationItem[]>(INITIAL_DIRECT_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Step 4 & 5 States
  const [assessmentSession, setAssessmentSession] = useState<SkillAssessmentSession | null>(() => {
    return cachedState?.assessmentSession || DEFAULT_ASSESSMENT_SESSION;
  });
  const [selectedCareerRole, setSelectedCareerRole] = useState<string>(() => {
    return cachedState?.selectedCareerRole || 'Software Developer';
  });
  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapPhaseMilestone[]>(() => {
    return cachedState?.roadmapMilestones || DEFAULT_ROADMAP_MILESTONES;
  });
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>(() => {
    return cachedState?.savedInternshipIds || ['job_1', 'job_4'];
  });

  // Step 6 Industry States
  const [industryOpportunities, setIndustryOpportunities] = useState<IndustryOpportunity[]>(() => {
    return cachedState?.industryOpportunities || INITIAL_INDUSTRY_OPPORTUNITIES;
  });
  const [shortlistedCandidates, setShortlistedCandidates] = useState<ShortlistedCandidate[]>(() => {
    return cachedState?.shortlistedCandidates || INITIAL_SHORTLISTED_CANDIDATES;
  });
  const [industryMentorship, setIndustryMentorship] = useState<IndustryMentorshipProgram[]>(() => {
    return cachedState?.industryMentorship || INITIAL_INDUSTRY_MENTORSHIP;
  });
  const [industryWorkshopsList, setIndustryWorkshopsList] = useState<IndustryWorkshopItem[]>(() => {
    return cachedState?.industryWorkshopsList || INITIAL_INDUSTRY_WORKSHOPS;
  });
  const [industryProfile, setIndustryProfile] = useState<IndustryProfileData>(() => {
    return cachedState?.industryProfile || INITIAL_INDUSTRY_PROFILE;
  });

  // Step 7 Faculty States
  const [facultyInternships, setFacultyInternships] = useState<FacultyInternshipItem[]>(() => {
    return cachedState?.facultyInternships || INITIAL_FACULTY_INTERNSHIPS;
  });
  const [industrialTraining, setIndustrialTraining] = useState<IndustrialTrainingItem[]>(() => {
    return cachedState?.industrialTraining || INITIAL_INDUSTRIAL_TRAINING;
  });
  const [fdpPrograms, setFdpPrograms] = useState<FDPProgramItem[]>(() => {
    return cachedState?.fdpPrograms || INITIAL_FDP_PROGRAMS;
  });
  const [facultyConsultancy, setFacultyConsultancy] = useState<FacultyConsultancyItem[]>(() => {
    return cachedState?.facultyConsultancy || INITIAL_FACULTY_CONSULTANCY;
  });
  const [researchCollaborations, setResearchCollaborations] = useState<ResearchCollaborationItem[]>(() => {
    return cachedState?.researchCollaborations || INITIAL_RESEARCH_COLLABORATIONS;
  });
  const [facultyWorkshops, setFacultyWorkshops] = useState<FacultyWorkshopItem[]>(() => {
    return cachedState?.facultyWorkshops || INITIAL_FACULTY_WORKSHOPS;
  });
  const [guestLectures, setGuestLectures] = useState<GuestLectureItem[]>(() => {
    return cachedState?.guestLectures || INITIAL_GUEST_LECTURES;
  });
  const [facultyIndustryProjects, setFacultyIndustryProjects] = useState<FacultyIndustryProjectItem[]>(() => {
    return cachedState?.facultyIndustryProjects || INITIAL_FACULTY_PROJECTS;
  });
  const [facultyMentorship, setFacultyMentorship] = useState<FacultyMentorshipItem[]>(() => {
    return cachedState?.facultyMentorship || INITIAL_FACULTY_MENTORSHIP;
  });
  const [academicProfile, setAcademicProfile] = useState<AcademicProfileData>(() => {
    return cachedState?.academicProfile || INITIAL_ACADEMIC_PROFILE;
  });

  // Step 8: Institution Portal States
  const [institutionStudents, setInstitutionStudents] = useState<InstitutionStudentItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_INSTITUTION_STUDENTS;
  });

  const [institutionCollaborations, setInstitutionCollaborations] = useState<InstitutionCollaborationItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COLLABORATIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_INSTITUTION_COLLABORATIONS;
  });

  const [institutionPlacements, setInstitutionPlacements] = useState<InstitutionPlacementItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLACEMENTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_INSTITUTION_PLACEMENTS;
  });

  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettingsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INSTITUTION_SETTINGS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_INSTITUTION_SETTINGS;
  });

  // Step 9: Platform Administration States
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_ADMIN_USERS;
  });

  const [adminOpportunities, setAdminOpportunities] = useState<AdminOpportunityItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_ADMIN_OPPORTUNITIES;
  });

  const [adminApplications, setAdminApplications] = useState<AdminApplicationItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_ADMIN_APPLICATIONS;
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettingsData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_PLATFORM_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(institutionStudents));
      localStorage.setItem(STORAGE_KEYS.COLLABORATIONS, JSON.stringify(institutionCollaborations));
      localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(institutionPlacements));
      localStorage.setItem(STORAGE_KEYS.INSTITUTION_SETTINGS, JSON.stringify(institutionSettings));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(adminUsers));
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(adminOpportunities));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(adminApplications));
      localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(platformSettings));
    } catch {}
  }, [
    institutionStudents,
    institutionCollaborations,
    institutionPlacements,
    institutionSettings,
    adminUsers,
    adminOpportunities,
    adminApplications,
    platformSettings,
  ]);
  
  // Navigation & UI
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedInternshipId, setSelectedInternshipId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Path-based routing synced with browser URL
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      const p = window.location.pathname;
      if (p && p.length > 0) return p;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/student/internships/')) {
        const id = path.replace('/student/internships/', '');
        setSelectedInternshipId(id);
      } else {
        setSelectedInternshipId(null);
      }
      if (path.startsWith('/student/jobs/')) {
        const id = path.replace('/student/jobs/', '');
        setSelectedJobId(id);
      } else {
        setSelectedJobId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, replace?: boolean) => {
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (cleanPath.startsWith('/student/internships/')) {
      const id = cleanPath.replace('/student/internships/', '');
      setSelectedInternshipId(id);
    } else {
      setSelectedInternshipId(null);
    }

    if (cleanPath.startsWith('/student/jobs/')) {
      const id = cleanPath.replace('/student/jobs/', '');
      setSelectedJobId(id);
    } else {
      setSelectedJobId(null);
    }

    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      if (replace || cleanPath === '/login') {
        window.history.replaceState({}, '', cleanPath);
      } else {
        window.history.pushState({}, '', cleanPath);
      }
    }

    // Role switching & tab synchronization
    if (cleanPath.startsWith('/student')) {
      if (currentUser.role !== 'student') {
        const studentUser = INITIAL_USERS.find(u => u.role === 'student') || INITIAL_USERS[0];
        setCurrentUser(studentUser);
      }
      const sub = cleanPath.replace('/student/', '');
      if (sub === 'dashboard') setActiveTab('dashboard');
      else if (sub === 'assessment') setActiveTab('assessment');
      else if (sub === 'skills') setActiveTab('skills');
      else if (sub === 'skill-gap') setActiveTab('skill_gap');
      else if (sub === 'roadmap') setActiveTab('roadmaps');
      else if (sub === 'internships' || sub.startsWith('internships/')) setActiveTab('internships');
      else if (sub === 'jobs' || sub.startsWith('jobs/')) setActiveTab('jobs');
      else if (sub === 'applications') setActiveTab('applications');
      else if (sub === 'portfolio') setActiveTab('portfolio');
      else if (sub === 'settings') setActiveTab('settings');
      else if (sub === 'resume-studio') setActiveTab('ai_resume');
    } else if (cleanPath.startsWith('/faculty')) {
      if (currentUser.role !== 'faculty') {
        const facultyUser = INITIAL_USERS.find(u => u.role === 'faculty') || INITIAL_USERS[1];
        setCurrentUser(facultyUser);
      }
      setActiveTab('overview');
    } else if (cleanPath.startsWith('/industry')) {
      if (currentUser.role !== 'company') {
        const companyUser = INITIAL_USERS.find(u => u.role === 'company') || INITIAL_USERS[3];
        setCurrentUser(companyUser);
      }
      if (cleanPath.includes('post-opportunity')) setActiveTab('post_opportunity');
      else if (cleanPath.includes('candidates')) setActiveTab('candidates');
      else setActiveTab('overview');
    } else if (cleanPath.startsWith('/institution')) {
      if (currentUser.role !== 'college_admin' && currentUser.role !== 'super_admin') {
        const adminUser = INITIAL_USERS.find(u => u.role === 'college_admin') || INITIAL_USERS[2];
        setCurrentUser(adminUser);
      }
      setActiveTab('overview');
    } else if (cleanPath.startsWith('/admin')) {
      if (currentUser.role !== 'super_admin') {
        const superAdminUser = INITIAL_USERS.find(u => u.role === 'super_admin') || INITIAL_USERS[4];
        if (superAdminUser) {
          setCurrentUser(superAdminUser);
        }
      }
      setActiveTab('overview');
    }
  };

  const publishNewOpportunity = (opp: Partial<JobPosting>) => {
    const newId = `job_${Date.now()}`;
    const newJob: JobPosting = {
      id: newId,
      companyId: opp.companyId || 'comp_custom',
      companyName: opp.companyName || 'Verified Partner Corp',
      companyLogo: opp.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      title: opp.title || 'Software Developer Intern',
      type: opp.type || 'Internship',
      workplaceType: opp.workplaceType || 'Remote',
      location: opp.location || 'Bangalore, India (Remote Available)',
      stipendOrSalary: opp.stipendOrSalary || '₹25,000 / month',
      experienceLevel: opp.experienceLevel || 'Entry-Level',
      departmentTarget: opp.departmentTarget || ['Computer Science', 'Information Technology'],
      requiredSkills: opp.requiredSkills || ['Python', 'SQL', 'Git'],
      preferredSkills: opp.preferredSkills || ['Docker', 'REST APIs'],
      description: opp.description || 'Exciting hands-on opportunity to build real-world systems with our engineering team.',
      responsibilities: opp.responsibilities || [
        'Design and deploy scalable backend microservices and APIs',
        'Participate in agile sprints, peer code reviews, and test automation',
        'Collaborate closely with senior engineering and product mentors'
      ],
      qualifications: opp.qualifications || [
        'Pursuing or completed B.Tech / B.E / M.Tech in CS / IT or related field',
        'Strong problem-solving foundation in algorithms and systems'
      ],
      benefits: opp.benefits || [
        'Competitive monthly stipend + performance bonus',
        'Pre-Placement Offer (PPO) opportunity upon successful completion',
        '1-on-1 industry mentorship and learning allowance'
      ],
      deadline: opp.deadline || '2026-05-30',
      postedDate: 'Just now',
      applicantCount: 0,
      status: 'Active',
    };

    setJobs(prev => [newJob, ...prev]);
    showToast(`Opportunity "${newJob.title}" published successfully! Visible in student marketplace.`, 'success');
  };

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('edubridge_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Synchronize entire state to localStorage for persistence across page refreshes
  useEffect(() => {
    try {
      const stateToCache = {
        studentProfile,
        jobs,
        applications,
        assessmentSession,
        selectedCareerRole,
        roadmapMilestones,
        savedInternshipIds,
        industryOpportunities,
        shortlistedCandidates,
        industryMentorship,
        industryWorkshopsList,
        industryProfile,
        facultyInternships,
        industrialTraining,
        fdpPrograms,
        facultyConsultancy,
        researchCollaborations,
        facultyWorkshops,
        guestLectures,
        facultyIndustryProjects,
        facultyMentorship,
        academicProfile,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToCache));
    } catch {
      // quota or private mode fallback
    }
  }, [
    studentProfile,
    jobs,
    applications,
    assessmentSession,
    selectedCareerRole,
    roadmapMilestones,
    savedInternshipIds,
    industryOpportunities,
    shortlistedCandidates,
    industryMentorship,
    industryWorkshopsList,
    industryProfile,
    facultyInternships,
    industrialTraining,
    fdpPrograms,
    facultyConsultancy,
    researchCollaborations,
    facultyWorkshops,
    guestLectures,
    facultyIndustryProjects,
    facultyMentorship,
    academicProfile,
  ]);

  // Synchronize with remote Supabase database if configured
  useEffect(() => {
    if (SupabaseDataService.isConfigured()) {
      SupabaseDataService.getJobs().then((remoteJobs) => {
        if (remoteJobs && remoteJobs.length > 0) {
          setJobs(remoteJobs);
        }
      });
      SupabaseDataService.getApplications().then((remoteApps) => {
        if (remoteApps && remoteApps.length > 0) {
          setApplications(remoteApps);
        }
      });
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      setThemeModeState(next ? 'dark' : 'light');
      localStorage.setItem('edubridge_theme_mode', next ? 'dark' : 'light');
      return next;
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = (action: string, status: 'Success' | 'Warning' | 'Security Alert' = 'Success') => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentUser.name,
      role: currentUser.role,
      action,
      ipAddress: '127.0.0.1 (Authorized Cloud Session)',
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const userForRole = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(userForRole);
    setActiveTab('dashboard');
    showToast(`Switched active view to ${role.replace('_', ' ').toUpperCase()}`, 'info');
    addAuditLog(`Switched operational role persona to ${role}`);

    // Direct user to the matching portal dashboard
    if (role === 'student') {
      navigate('/student/dashboard');
    } else if (role === 'faculty') {
      navigate('/faculty/dashboard');
    } else if (role === 'company') {
      navigate('/industry/dashboard');
    } else if (role === 'college_admin') {
      navigate('/institution/dashboard');
    } else if (role === 'super_admin') {
      navigate('/admin/dashboard');
    }
  };

  const updateStudentProfile = (profile: Partial<StudentProfile>) => {
    setStudentProfile((prev) => {
      const updated = { ...prev, ...profile };
      void SupabaseDataService.syncStudentProfile(updated);
      return updated;
    });
    showToast('Student profile updated successfully!');
    addAuditLog('Updated student profile details');
  };

  const addSkillToStudent = (skill: Omit<StudentSkill, 'id'>) => {
    const newSkill: StudentSkill = {
      ...skill,
      id: `s_${Date.now()}`,
    };
    setStudentProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
      aiSkillScore: Math.min(99, prev.aiSkillScore + 2),
    }));
    showToast(`Added skill "${skill.name}" to profile!`);
    addAuditLog(`Added technical skill: ${skill.name}`);
  };

  const addCertification = (cert: Omit<Certification, 'id' | 'verified'>) => {
    const newCert: Certification = {
      ...cert,
      id: `cert_${Date.now()}`,
      verified: false,
    };
    setStudentProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
    showToast(`Submitted "${cert.title}" for faculty verification!`, 'info');
    addNotification({
      userId: 'user_faculty_1',
      title: 'New Certificate Verification Request',
      message: `${studentProfile.name} submitted "${cert.title}" from ${cert.issuer}.`,
      type: 'verification',
    });
    addAuditLog(`Submitted certificate for verification: ${cert.title}`);
  };

  const deleteSkill = (skillId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== skillId),
    }));
    showToast('Skill removed from profile.');
  };

  const updateSkillLevel = (
    skillId: string,
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    score?: number
  ) => {
    setStudentProfile((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.id === skillId
          ? {
              ...s,
              level,
              verifiedScore: score !== undefined ? score : s.verifiedScore,
            }
          : s
      ),
    }));
    showToast('Skill level updated successfully.');
  };

  const recordSkillAssessment = (skillName: string, score: number) => {
    const passed = score >= 70;
    setStudentProfile((prev) => {
      const existing = prev.skills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );
      let updatedSkills = [...prev.skills];
      if (existing) {
        updatedSkills = updatedSkills.map((s) =>
          s.id === existing.id
            ? {
                ...s,
                verifiedScore: score,
                level: score >= 90 ? 'Expert' : score >= 75 ? 'Advanced' : 'Intermediate',
                verifiedByFaculty: passed ? true : s.verifiedByFaculty,
              }
            : s
        );
      } else {
        updatedSkills.push({
          id: `s_${Date.now()}`,
          name: skillName,
          category: 'Frontend',
          level: score >= 90 ? 'Expert' : 'Advanced',
          verifiedScore: score,
          verifiedByFaculty: passed,
        });
      }

      const newTimeline: StudentActivity = {
        id: `act_${Date.now()}`,
        type: 'assessment_completed',
        title: `Skill Assessment Completed: ${skillName}`,
        description: `Achieved ${score}% score. ${passed ? 'Verified badge awarded.' : 'Review recommended.'}`,
        timestamp: 'Just now',
        metricChange: `+${Math.round(score / 20)}% AI Skill Score`,
      };

      return {
        ...prev,
        skills: updatedSkills,
        aiSkillScore: Math.min(99, Math.round(prev.aiSkillScore * 0.9 + score * 0.1)),
        activityTimeline: [newTimeline, ...(prev.activityTimeline || [])],
      };
    });

    showToast(`Assessment recorded! You scored ${score}%.`, passed ? 'success' : 'info');
    addAuditLog(`Completed skill assessment for ${skillName} with score ${score}%`);
  };

  const addProject = (project: Omit<Project, 'id' | 'featured' | 'likesCount'>) => {
    const newProj: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      featured: false,
      likesCount: 0,
    };
    setStudentProfile((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
      industryReadinessScore: Math.min(99, prev.industryReadinessScore + 3),
    }));
    showToast('Project added to showcase!');
    addAuditLog(`Published new project: ${project.title}`);
  };

  const deleteCertification = (certId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== certId),
    }));
    showToast('Certification removed from portfolio.');
  };

  const updateProject = (projId: string, projectData: Partial<Project>) => {
    setStudentProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === projId ? { ...p, ...projectData } : p)),
    }));
    showToast('Project updated successfully!');
  };

  const deleteProject = (projId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== projId),
    }));
    showToast('Project removed.');
  };

  const toggleProjectFeatured = (projId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId ? { ...p, featured: !p.featured } : p
      ),
    }));
    showToast('Project showcase status updated.');
  };

  const addEducation = (edu: Omit<Education, 'id'>) => {
    const newEdu: Education = {
      ...edu,
      id: `edu_${Date.now()}`,
    };
    setStudentProfile((prev) => ({
      ...prev,
      educations: [...(prev.educations || []), newEdu],
    }));
    showToast('Education record added!');
    addAuditLog(`Added education entry: ${edu.degree} at ${edu.institution}`);
  };

  const updateEducation = (eduId: string, edu: Partial<Education>) => {
    setStudentProfile((prev) => ({
      ...prev,
      educations: (prev.educations || []).map((e) => (e.id === eduId ? { ...e, ...edu } : e)),
    }));
    showToast('Education record updated!');
  };

  const deleteEducation = (eduId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      educations: (prev.educations || []).filter((e) => e.id !== eduId),
    }));
    showToast('Education record removed.');
  };

  const addExperience = (exp: Omit<Experience, 'id'>) => {
    const newExp: Experience = {
      ...exp,
      id: `exp_${Date.now()}`,
    };
    setStudentProfile((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExp],
      industryReadinessScore: Math.min(99, prev.industryReadinessScore + 2),
    }));
    showToast('Experience added to profile!');
    addAuditLog(`Added work experience: ${exp.role} at ${exp.company}`);
  };

  const updateExperience = (expId: string, exp: Partial<Experience>) => {
    setStudentProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === expId ? { ...e, ...exp } : e)),
    }));
    showToast('Experience record updated!');
  };

  const deleteExperience = (expId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== expId),
    }));
    showToast('Experience record removed.');
  };

  const addAchievement = (ach: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = {
      ...ach,
      id: `ach_${Date.now()}`,
    };
    setStudentProfile((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), newAch],
    }));
    showToast('Achievement published to showcase!');
    addAuditLog(`Added achievement: ${ach.title}`);
  };

  const deleteAchievement = (achId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((a) => a.id !== achId),
    }));
    showToast('Achievement removed.');
  };

  const addStudentActivity = (act: Omit<StudentActivity, 'id' | 'timestamp'>) => {
    const newAct: StudentActivity = {
      ...act,
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
    };
    setStudentProfile((prev) => ({
      ...prev,
      activityTimeline: [newAct, ...(prev.activityTimeline || [])],
    }));
  };

  const uploadResumeFile = (fileName: string, extractedText: string, fileUrl?: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      resumeFileName: fileName,
      resumeText: extractedText,
      resumeUrl: fileUrl || 'https://assets.edubridge.ai/resumes/' + fileName,
      resumeUploadedAt: new Date().toISOString(),
      atsResumeScore: Math.max(prev.atsResumeScore, 88),
    }));
    addStudentActivity({
      type: 'resume_parsed',
      title: `Resume Uploaded & Parsed: ${fileName}`,
      description: 'Document parsed into structured JSON and scored by AI ATS analyzer.',
      metricChange: '+6 ATS Points',
    });
    showToast(`Resume "${fileName}" uploaded and parsed successfully!`);
    addAuditLog(`Uploaded resume document: ${fileName}`);
  };

  const updateCareerPreferences = (prefs: StudentProfile['careerPreferences']) => {
    setStudentProfile((prev) => ({
      ...prev,
      careerPreferences: prefs,
    }));
    showToast('Career preferences saved successfully!');
  };

  const updateStudentSettings = (settings: StudentProfile['settings']) => {
    setStudentProfile((prev) => ({
      ...prev,
      settings,
    }));
    showToast('Student settings updated!');
  };

  const sendDirectMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const msgId = `m_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setDirectConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [
            ...c.messages,
            {
              id: msgId,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text,
              timestamp,
              isSelf: true,
            },
          ],
        };
      })
    );

    // Auto simulated response after 1.5s for rich interactivity
    setTimeout(() => {
      setDirectConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          let replyText = 'Thank you for following up! We will review this promptly.';
          if (c.contactRole.includes('Recruiter')) {
            replyText = 'Received! We are coordinating the technical panel calendar and will notify you with the Google Meet link.';
          } else if (c.contactRole.includes('Faculty')) {
            replyText = 'Great initiative! Come by during office hours or review the recommended chapter in the learning roadmap.';
          } else if (c.contactRole.includes('Bot')) {
            replyText = 'AI Tip: Tailor your resume summary with 2 quantifiable metrics before your upcoming interview.';
          }
          return {
            ...c,
            lastMessage: replyText,
            lastTimestamp: 'Just now',
            messages: [
              ...c.messages,
              {
                id: `rep_${Date.now()}`,
                senderId: 'contact_auto',
                senderName: c.contactName.split(' ')[0],
                text: replyText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isSelf: false,
              },
            ],
          };
        })
      );
    }, 1500);
  };

  const addLearningRoadmap = (roadmap: LearningRoadmap) => {
    setStudentProfile((prev) => ({
      ...prev,
      activeRoadmaps: [roadmap, ...prev.activeRoadmaps.filter((r) => r.id !== roadmap.id)],
    }));
    showToast(`Enrolled in AI Learning Roadmap: ${roadmap.title}!`);
    addAuditLog(`Generated & enrolled in learning roadmap: ${roadmap.title}`);
  };

  const toggleMilestone = (roadmapId: string, phaseIndex: number) => {
    setStudentProfile((prev) => {
      const updatedRoadmaps = prev.activeRoadmaps.map((rm) => {
        if (rm.id !== roadmapId) return rm;
        const updatedMilestones = rm.milestones.map((m, idx) => {
          if (idx === phaseIndex) return { ...m, completed: !m.completed };
          return m;
        });
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...rm,
          milestones: updatedMilestones,
          progressPercentage: progress,
        };
      });
      return { ...prev, activeRoadmaps: updatedRoadmaps };
    });
    showToast('Updated roadmap milestone progress!');
  };

  const addJob = (jobData: Omit<JobPosting, 'id' | 'postedDate' | 'applicantCount'>) => {
    const newJob: JobPosting = {
      ...jobData,
      id: `job_${Date.now()}`,
      postedDate: new Date().toISOString().slice(0, 10),
      applicantCount: 0,
    };
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Job listing "${newJob.title}" posted successfully!`);
    addNotification({
      userId: 'user_student_1',
      title: `New Opening at ${newJob.companyName}`,
      message: `${newJob.companyName} is hiring: ${newJob.title} (${newJob.type}).`,
      type: 'application',
    });
    addAuditLog(`Posted new hiring opportunity: ${newJob.title} by ${newJob.companyName}`);
  };

  const editJob = (jobId: string, updates: Partial<JobPosting>) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j)));
    showToast('Job posting updated successfully!');
    addAuditLog(`Updated job posting #${jobId}`);
  };

  const deleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    showToast('Job opening removed from active listings.', 'info');
    addAuditLog(`Deleted job opening #${jobId}`);
  };

  const applyForJob = (jobId: string) => {
    if (studentProfile.appliedJobIds.includes(jobId)) {
      showToast('You have already applied for this opening.', 'info');
      return;
    }
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    // Create new application
    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: studentProfile.email,
      studentAvatar: studentProfile.avatar,
      studentCollege: studentProfile.college,
      studentDepartment: studentProfile.department,
      studentGpa: studentProfile.gpa,
      studentSkills: studentProfile.skills.map((s) => s.name),
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Applied',
      aiMatchScore: Math.floor(Math.random() * 15) + 85,
      aiMatchSummary: `High candidate potential with verified competencies in ${studentProfile.skills.slice(0, 3).map((s) => s.name).join(', ')}.`,
    };

    setApplications((prev) => [newApp, ...prev]);
    setStudentProfile((prev) => ({
      ...prev,
      appliedJobIds: [...prev.appliedJobIds, jobId],
    }));
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );

    showToast(`Application submitted to ${job.companyName}!`);
    void SupabaseDataService.createApplication(newApp);
    addNotification({
      userId: 'user_company_1',
      title: 'New Candidate Application Received',
      message: `${studentProfile.name} applied for ${job.title}. AI Match: ${newApp.aiMatchScore}%`,
      type: 'application',
    });
    addAuditLog(`Submitted application for ${job.title} at ${job.companyName}`);
  };

  const saveJob = (jobId: string) => {
    setStudentProfile((prev) => {
      const isSaved = prev.savedJobIds.includes(jobId);
      const newSaved = isSaved
        ? prev.savedJobIds.filter((id) => id !== jobId)
        : [...prev.savedJobIds, jobId];
      showToast(isSaved ? 'Removed from saved jobs.' : 'Saved job to your bookmarks!');
      return { ...prev, savedJobIds: newSaved };
    });
  };

  const toggleSaveInternship = (internshipId: string) => {
    setSavedInternshipIds((prev) => {
      const isSaved = prev.includes(internshipId);
      const updated = isSaved
        ? prev.filter((id) => id !== internshipId)
        : [...prev, internshipId];
      showToast(isSaved ? 'Removed from saved internships.' : 'Internship saved to your bookmarks!', 'info');
      return updated;
    });
  };

  const applyForJobWithDetails = async (
    jobId: string,
    pitch?: string,
    customResume?: string
  ): Promise<boolean> => {
    if (studentProfile.appliedJobIds.includes(jobId)) {
      showToast('You have already applied for this opening.', 'info');
      return false;
    }
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return false;

    // Calculate real AI match percentage
    const studentSkillNames = studentProfile.skills.map((s) => s.name);
    const reqSkills = job.requiredSkills || [];
    const matched = reqSkills.filter((r) =>
      studentSkillNames.some(
        (s) => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase())
      )
    );
    const matchScore = Math.max(68, Math.min(98, Math.round(((matched.length / (reqSkills.length || 1)) * 75) + 20)));

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentEmail: studentProfile.email,
      studentAvatar: studentProfile.avatar,
      studentCollege: studentProfile.college,
      studentDepartment: studentProfile.department,
      studentGpa: studentProfile.gpa,
      studentSkills: studentSkillNames,
      appliedDate: new Date().toISOString().slice(0, 10),
      status: 'Applied',
      aiMatchScore: matchScore,
      aiMatchSummary: pitch
        ? `Application submitted with custom candidate pitch. AI Match: ${matchScore}% with verified skills in ${matched.slice(0, 3).join(', ')}.`
        : `Verified student profile submitted. AI Match: ${matchScore}% with ${matched.length}/${reqSkills.length} competencies.`,
      coverLetter: pitch,
      resumeUrl: customResume || studentProfile.resumeFileName || 'verified_student_resume.pdf',
    };

    setApplications((prev) => [newApp, ...prev]);
    setStudentProfile((prev) => ({
      ...prev,
      appliedJobIds: [...prev.appliedJobIds, jobId],
    }));
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );

    showToast(`Application submitted successfully for ${job.title} at ${job.companyName}!`, 'success');
    void SupabaseDataService.createApplication(newApp);
    addNotification({
      userId: 'user_company_1',
      title: 'New Candidate Application Received',
      message: `${studentProfile.name} applied for ${job.title}. AI Match Score: ${matchScore}%`,
      type: 'application',
    });
    addAuditLog(`Applied for ${job.title} at ${job.companyName} with ${matchScore}% AI match`);
    return true;
  };

  const saveAssessmentSession = (session: SkillAssessmentSession) => {
    setAssessmentSession(session);
    setStudentProfile((prev) => {
      const updatedSkills = [...prev.skills];
      Object.entries(session.techSkills).forEach(([name, score]) => {
        const idx = updatedSkills.findIndex((s) => s.name.toLowerCase() === name.toLowerCase());
        const level = score >= 80 ? 'Expert' : score >= 65 ? 'Advanced' : score >= 50 ? 'Intermediate' : 'Beginner';
        if (idx >= 0) {
          updatedSkills[idx] = { ...updatedSkills[idx], score, level };
        } else {
          updatedSkills.push({
            id: `sk_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            name,
            level,
            score,
            verified: true,
            endorsementsCount: 1,
          });
        }
      });
      return {
        ...prev,
        industryReadinessScore: session.overallReadiness,
        aiSkillScore: session.overallReadiness,
        skills: updatedSkills,
      };
    });
    showToast('Assessment saved! Skill Gap & Roadmap updated with live benchmarks.', 'success');
    addAuditLog(`Completed skill assessment: Overall readiness ${session.overallReadiness}%`);
    void SupabaseDataService.saveAssessment(session, studentProfile.userId || studentProfile.id);
  };

  const updateRoadmapMilestoneStatus = (
    milestoneId: string,
    status: RoadmapPhaseMilestone['status'],
    progress: number
  ) => {
    setRoadmapMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, status, progress } : m))
    );
    showToast(`Roadmap progress updated: ${progress}% (${status})`, 'success');
    addAuditLog(`Updated roadmap phase ${milestoneId} to ${status} with ${progress}% progress`);
  };

  // Local storage auto-persistence
  useEffect(() => {
    try {
      const stateToPersist = {
        studentProfile,
        jobs,
        applications,
        assessmentSession,
        selectedCareerRole,
        roadmapMilestones,
        savedInternshipIds,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {}
  }, [
    studentProfile,
    jobs,
    applications,
    assessmentSession,
    selectedCareerRole,
    roadmapMilestones,
    savedInternshipIds,
  ]);

  const updateApplicationStatus = (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status,
          recruiterNotes: notes !== undefined ? notes : app.recruiterNotes,
          interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate,
        };
      })
    );

    const app = applications.find((a) => a.id === appId);
    if (app) {
      void SupabaseDataService.updateApplicationStatus(appId, status);
      showToast(`Application #${appId.slice(-4)} updated to "${status}"!`);
      addNotification({
        userId: 'user_student_1',
        title: `Application Status Update: ${status}`,
        message: `Your application status has been updated to "${status}". ${notes ? `Notes: ${notes}` : ''}`,
        type: 'interview',
      });
      addAuditLog(`Updated candidate application #${appId} status to ${status}`);
    }
  };

  const verifyStudentCertificate = (certId: string, facultyName: string) => {
    setStudentProfile((prev) => {
      const updatedCerts = prev.certifications.map((c) => {
        if (c.id !== certId) return c;
        return {
          ...c,
          verified: true,
          verifiedByFacultyName: facultyName,
          verificationDate: new Date().toISOString().slice(0, 10),
        };
      });
      return {
        ...prev,
        certifications: updatedCerts,
        industryReadinessScore: Math.min(99, prev.industryReadinessScore + 2),
      };
    });

    showToast('Certificate verified & endorsed with institutional seal!');
    addNotification({
      userId: 'user_student_1',
      title: 'Certificate Endorsed by Faculty',
      message: `${facultyName} has verified and stamped your certificate credential.`,
      type: 'verification',
    });
    addAuditLog(`Faculty ${facultyName} verified student certificate #${certId}`);
  };

  const endorseStudentSkill = (skillId: string, endorsement: string, score: number) => {
    setStudentProfile((prev) => {
      const updatedSkills = prev.skills.map((s) => {
        if (s.id !== skillId) return s;
        return {
          ...s,
          verifiedByFaculty: true,
          facultyEndorsement: endorsement,
          verifiedScore: score,
        };
      });
      return {
        ...prev,
        skills: updatedSkills,
        aiSkillScore: Math.min(99, prev.aiSkillScore + 3),
      };
    });
    showToast(`Skill endorsed with score ${score}/100!`);
    addAuditLog(`Endorsed student skill #${skillId} with official rating ${score}/100`);
  };

  const currentCompany: CompanyPartner = companies[0] || INITIAL_COMPANIES[0];

  const updateCompanyProfile = (companyId: string, updates: Partial<CompanyPartner>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, ...updates } : c))
    );
    showToast('Company profile details saved successfully!');
    addAuditLog(`Updated company profile information for #${companyId}`);
  };

  const requestCompanyVerification = (doc: { title: string; type: string; fileUrl: string }) => {
    setCompanies((prev) =>
      prev.map((c, i) => {
        if (i !== 0) return c;
        const newDoc = {
          id: `doc_${Date.now()}`,
          title: doc.title,
          type: doc.type,
          fileUrl: doc.fileUrl,
          uploadedAt: new Date().toISOString().slice(0, 10),
          status: 'Pending' as const,
          notes: 'Submitted for verification review',
        };
        return {
          ...c,
          verificationStatus: 'Under Review',
          verificationDocs: [newDoc, ...(c.verificationDocs || [])],
        };
      })
    );
    showToast('Verification document uploaded and submitted for review!');
    addAuditLog(`Submitted company verification compliance document: ${doc.title}`);
  };

  const verifyCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, verified: true, verificationStatus: 'Verified' } : c))
    );
    showToast('Company verified and issued enterprise partner badge!');
    addAuditLog(`Super Admin verified enterprise organization #${companyId}`);
  };

  const extendCompanyOffer = (offerData: Omit<CompanyOffer, 'id' | 'extendedAt'>) => {
    const newOffer: CompanyOffer = {
      ...offerData,
      id: `off_${Date.now()}`,
      extendedAt: new Date().toISOString().slice(0, 10),
    };
    setCompanyOffers((prev) => [newOffer, ...prev]);

    // Update matching application status
    setApplications((prev) =>
      prev.map((app) => {
        if (app.studentId === offerData.studentId && app.jobId === offerData.jobId) {
          return {
            ...app,
            status: 'Offer Extended',
            offerDetails: {
              role: offerData.jobTitle,
              package: offerData.ctcOrStipend,
              startDate: offerData.joiningDate,
            },
          };
        }
        return app;
      })
    );

    showToast(`Formal offer extended to ${offerData.studentName}!`);
    addNotification({
      userId: 'user_student_1',
      title: 'Congratulations! Official Job Offer Extended',
      message: `${offerData.companyName} has extended an offer for ${offerData.jobTitle} (${offerData.ctcOrStipend}).`,
      type: 'verification',
    });
    addAuditLog(`Extended official job offer to ${offerData.studentName} for ${offerData.jobTitle}`);
  };

  const updateOfferStatus = (offerId: string, status: CompanyOffer['status']) => {
    setCompanyOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status } : o))
    );
    showToast(`Offer status updated to "${status}"!`);
    addAuditLog(`Updated offer #${offerId} status to ${status}`);
  };

  const scheduleCompanyInterview = (interviewData: Omit<CompanyInterview, 'id'>) => {
    const newInt: CompanyInterview = {
      ...interviewData,
      id: `int_${Date.now()}`,
    };
    setCompanyInterviews((prev) => [newInt, ...prev]);

    // Sync application
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === interviewData.applicationId || (app.studentId === interviewData.studentId && app.jobId === interviewData.jobId)) {
          return {
            ...app,
            status: 'Interview Scheduled',
            interviewDate: `${interviewData.scheduledDate} ${interviewData.scheduledTime}`,
          };
        }
        return app;
      })
    );

    showToast(`Interview scheduled with ${interviewData.studentName} on ${interviewData.scheduledDate}!`);
    addNotification({
      userId: 'user_student_1',
      title: `Interview Scheduled: ${interviewData.jobTitle}`,
      message: `${interviewData.roundName} on ${interviewData.scheduledDate} at ${interviewData.scheduledTime}. Platform: ${interviewData.mode}`,
      type: 'interview',
    });
    addAuditLog(`Scheduled interview for candidate ${interviewData.studentName}`);
  };

  const updateCompanyInterview = (interviewId: string, updates: Partial<CompanyInterview>) => {
    setCompanyInterviews((prev) =>
      prev.map((i) => (i.id === interviewId ? { ...i, ...updates } : i))
    );
    showToast('Interview details & feedback notes updated!');
    addAuditLog(`Updated interview evaluation #${interviewId}`);
  };

  const addCompanyTeamMember = (member: Omit<CompanyTeamMember, 'id' | 'companyId' | 'addedAt'>) => {
    const newMember: CompanyTeamMember = {
      ...member,
      id: `tm_${Date.now()}`,
      companyId: currentCompany.id,
      addedAt: new Date().toISOString().slice(0, 10),
    };
    setCompanyTeam((prev) => [...prev, newMember]);
    showToast(`Added ${member.name} to recruitment team!`);
    addAuditLog(`Added team member ${member.name} (${member.role})`);
  };

  const removeCompanyTeamMember = (memberId: string) => {
    setCompanyTeam((prev) => prev.filter((t) => t.id !== memberId));
    showToast('Team member removed.');
    addAuditLog(`Removed recruitment team member #${memberId}`);
  };

  const inviteCandidateToJob = (candidateId: string, jobId: string, message: string) => {
    const candidate = candidatePool.find((c) => c.id === candidateId);
    const job = jobs.find((j) => j.id === jobId);
    showToast(`Invitation sent to ${candidate ? candidate.name : 'candidate'} for ${job ? job.title : 'opening'}!`);
    addNotification({
      userId: 'user_student_1',
      title: `Direct Recruiting Invitation from ${currentCompany.name}`,
      message: `${currentCompany.name} reviewed your profile and invited you to apply for ${job ? job.title : 'their opening'}: "${message.slice(0, 80)}..."`,
      type: 'application',
    });
    addAuditLog(`Dispatched direct candidate invitation to ${candidate ? candidate.name : candidateId}`);
  };

  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings((prev) => ({ ...prev, ...settings }));
    showToast('Company recruitment settings & automation preferences saved!');
    addAuditLog('Updated company automated recruitment workflow settings');
  };

  const updateCollegeInfo = (info: Partial<CollegeInfo>) => {
    setCollegeInfo((prev) => ({ ...prev, ...info }));
    showToast('College institutional data updated!');
    addAuditLog('Updated college institutional analytics and MOU metrics');
  };

  const requestMentorship = (facultyId: string, topic: string, date: string, time: string) => {
    const faculty = facultyMembers.find((f) => f.id === facultyId);
    const newSession: MentorshipSession = {
      id: `mentor_${Date.now()}`,
      facultyId,
      facultyName: faculty ? faculty.name : 'Faculty Mentor',
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      topic,
      status: 'Requested',
      scheduledDate: date,
      timeSlot: time,
    };
    setMentorships((prev) => [newSession, ...prev]);
    showToast('Mentorship slot requested with faculty!');
    addNotification({
      userId: 'user_faculty_1',
      title: 'New Mentorship Request',
      message: `${studentProfile.name} requested a 1-on-1 session on "${topic}".`,
      type: 'mentorship',
    });
    addAuditLog(`Requested mentorship session with ${newSession.facultyName}`);
  };

  const updateMentorshipStatus = (
    sessionId: string,
    status: 'Scheduled' | 'Completed' | 'Declined',
    meetingLink?: string
  ) => {
    setMentorships((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status,
          meetingLink: meetingLink || s.meetingLink || 'https://meet.edubridge.ai/room/' + sessionId,
        };
      })
    );
    showToast(`Mentorship session marked as ${status}!`);
    addAuditLog(`Updated mentorship session #${sessionId} status to ${status}`);
  };

  const registerForWorkshop = (workshopId: string) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id !== workshopId) return w;
        return { ...w, registeredCount: w.registeredCount + 1 };
      })
    );
    showToast('Successfully registered for workshop! Calendar invite added.');
    addAuditLog(`Registered student for workshop #${workshopId}`);
  };

  const createWorkshop = (workshopData: Omit<Workshop, 'id' | 'registeredCount'>) => {
    const newWs: Workshop = {
      ...workshopData,
      id: `ws_${Date.now()}`,
      registeredCount: 1,
    };
    setWorkshops((prev) => [newWs, ...prev]);
    showToast(`Workshop "${newWs.title}" created & announced!`);
    addNotification({
      userId: 'user_student_1',
      title: 'New Industry Masterclass Announced',
      message: `${newWs.title} by ${newWs.instructorName}.`,
      type: 'system',
    });
    addAuditLog(`Created workshop masterclass: ${newWs.title}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // ==========================================
  // STEP 6: INDUSTRY PORTAL HANDLERS
  // ==========================================
  const addOpportunity = (oppData: Omit<IndustryOpportunity, 'id' | 'postedDate' | 'applicationsCount'>) => {
    const newId = `opp_${Date.now()}`;
    const newOpp: IndustryOpportunity = {
      ...oppData,
      id: newId,
      postedDate: new Date().toISOString().slice(0, 10),
      applicationsCount: 0,
      status: oppData.status || 'Active',
    };
    setIndustryOpportunities((prev) => [newOpp, ...prev]);

    // Cross-portal sync: if Internship or Job, add to Student Jobs array
    if (newOpp.type === 'Internship' || newOpp.type === 'Job') {
      const correspondingJob: JobPosting = {
        id: newId,
        companyId: newOpp.companyId || 'comp_1',
        companyName: newOpp.companyName || 'TechNova Solutions',
        companyLogo: newOpp.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        title: newOpp.title,
        type: newOpp.type === 'Internship' ? 'Internship' : 'Full-time',
        workplaceType: newOpp.workMode,
        location: newOpp.location,
        stipendOrSalary: newOpp.stipendOrSalary || 'Competitive Market Compensation',
        experienceLevel: 'Entry-Level',
        departmentTarget: [newOpp.department || 'Computer Science & Engineering'],
        requiredSkills: newOpp.requiredSkills,
        preferredSkills: newOpp.preferredSkills || [],
        description: newOpp.description,
        responsibilities: newOpp.responsibilities || ['Collaborate with engineering teams on core product initiatives.'],
        qualifications: [newOpp.minQualification || 'Bachelor’s degree in related technical field'],
        benefits: ['Certificate of Completion', 'Industry Mentorship', 'Pre-Placement Offer Consideration'],
        deadline: newOpp.deadline,
        postedDate: 'Just now',
        applicantCount: 0,
        status: 'Active',
      };
      setJobs((prev) => [correspondingJob, ...prev]);
    }

    // Cross-portal sync: if Project, also add to Faculty Industry Projects
    if (newOpp.type === 'Project') {
      const facultyProj: FacultyIndustryProjectItem = {
        id: `fac_proj_${Date.now()}`,
        projectName: newOpp.title,
        industryPartner: newOpp.companyName,
        domain: newOpp.department || 'Applied Technology & Systems',
        students: [],
        facultyCoordinator: 'Dr. Evelyn Vance',
        status: 'Planning',
        progressPercentage: 0,
        description: newOpp.problemStatement || newOpp.description,
        deliverables: ['Problem Statement Definition', 'Architecture Design', 'Prototype Implementation'],
      };
      setFacultyIndustryProjects((prev) => [facultyProj, ...prev]);
    }

    showToast(`${newOpp.type} "${newOpp.title}" published successfully!`, 'success');
    addAuditLog(`Industry published ${newOpp.type.toLowerCase()}: ${newOpp.title}`);
    void SupabaseDataService.saveOpportunity(newOpp);
  };

  const updateOpportunity = (oppId: string, updates: Partial<IndustryOpportunity>) => {
    setIndustryOpportunities((prev) => {
      const mapped = prev.map((o) => (o.id === oppId ? { ...o, ...updates } : o));
      const target = mapped.find((o) => o.id === oppId);
      if (target) void SupabaseDataService.saveOpportunity(target);
      return mapped;
    });
    showToast('Opportunity updated successfully.');
    addAuditLog(`Updated opportunity #${oppId}`);
  };

  const closeOpportunity = (oppId: string) => {
    setIndustryOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, status: 'Closed' } : o))
    );
    setJobs((prev) =>
      prev.map((j) => (j.id === oppId ? { ...j, status: 'Closed' } : j))
    );
    showToast('Opportunity marked as Closed. New applications disabled.');
    addAuditLog(`Closed opportunity #${oppId}`);
  };

  const deleteOpportunity = (oppId: string) => {
    setIndustryOpportunities((prev) => prev.filter((o) => o.id !== oppId));
    setJobs((prev) => prev.filter((j) => j.id !== oppId));
    showToast('Opportunity removed.');
    addAuditLog(`Deleted opportunity #${oppId}`);
  };

  const shortlistCandidate = (candidateId: string, opportunityId: string, notes?: string) => {
    const opp = industryOpportunities.find((o) => o.id === opportunityId) || industryOpportunities[0];
    const cand = DEMO_CANDIDATES.find((c) => c.id === candidateId);
    if (!cand) return;

    const exists = shortlistedCandidates.some(
      (s) => s.studentId === candidateId && s.opportunityId === opportunityId
    );
    if (exists) {
      showToast(`${cand.name} is already shortlisted for this opportunity.`, 'info');
      return;
    }

    const newShortlist: ShortlistedCandidate = {
      id: `short_${Date.now()}`,
      studentId: cand.id,
      studentName: cand.name,
      studentAvatar: cand.avatar,
      studentEmail: cand.email,
      studentCollege: cand.college,
      studentDepartment: cand.department,
      studentGpa: cand.gpa,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      opportunityType: opp.type,
      matchPercentage: 92,
      shortlistedDate: new Date().toISOString().slice(0, 10),
      status: 'Shortlisted',
      notes: notes || 'Shortlisted for technical evaluation based on strong skill alignment.',
    };

    setShortlistedCandidates((prev) => [newShortlist, ...prev]);

    setApplications((prev) =>
      prev.map((a) =>
        a.studentId === candidateId && a.jobId === opportunityId
          ? { ...a, status: 'Screening' }
          : a
      )
    );

    showToast(`${cand.name} shortlisted for "${opp.title}"!`, 'success');
    addNotification({
      userId: cand.id,
      title: 'Application Shortlisted!',
      message: `Your profile was shortlisted by ${opp.companyName} for ${opp.title}.`,
      type: 'application',
    });
    addAuditLog(`Shortlisted candidate ${cand.name} for opportunity #${opportunityId}`);
  };

  const removeFromShortlist = (candidateIdOrShortlistId: string, opportunityId?: string) => {
    setShortlistedCandidates((prev) =>
      prev.filter((s) => {
        if (opportunityId) {
          return !(
            (s.id === candidateIdOrShortlistId || s.candidateId === candidateIdOrShortlistId || s.studentId === candidateIdOrShortlistId) &&
            s.opportunityId === opportunityId
          );
        }
        return (
          s.id !== candidateIdOrShortlistId &&
          s.candidateId !== candidateIdOrShortlistId &&
          s.studentId !== candidateIdOrShortlistId
        );
      })
    );
    showToast('Candidate removed from shortlist.');
  };

  const updateShortlistStatus = (
    candidateIdOrShortlistId: string,
    opportunityIdOrStatus: string | ShortlistedCandidate['status'],
    maybeStatus?: ShortlistedCandidate['status']
  ) => {
    const status = maybeStatus || (opportunityIdOrStatus as ShortlistedCandidate['status']);
    const opportunityId = maybeStatus ? (opportunityIdOrStatus as string) : undefined;

    setShortlistedCandidates((prev) =>
      prev.map((s) => {
        const matches = opportunityId
          ? (s.id === candidateIdOrShortlistId ||
              s.candidateId === candidateIdOrShortlistId ||
              s.studentId === candidateIdOrShortlistId) &&
            s.opportunityId === opportunityId
          : s.id === candidateIdOrShortlistId ||
            s.candidateId === candidateIdOrShortlistId ||
            s.studentId === candidateIdOrShortlistId;
        return matches ? { ...s, status } : s;
      })
    );
    showToast(`Status updated to ${status}.`);
  };

  const scheduleInterview = (
    candidateIdOrShortlistId: string,
    details: { date: string; time: string; type: 'Online' | 'In-person'; locationOrLink: string; notes?: string }
  ) => {
    setShortlistedCandidates((prev) =>
      prev.map((s) => {
        if (s.id === candidateIdOrShortlistId || s.studentId === candidateIdOrShortlistId) {
          return {
            ...s,
            status: 'Interview',
            interviewDetails: details,
          };
        }
        return s;
      })
    );

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === candidateIdOrShortlistId || a.studentId === candidateIdOrShortlistId) {
          return {
            ...a,
            status: 'Interview Scheduled',
            interviewDate: `${details.date} at ${details.time}`,
          };
        }
        return a;
      })
    );

    showToast(`Interview scheduled for ${details.date} at ${details.time}! Confirmation dispatched.`, 'success');
    addAuditLog(`Scheduled interview for candidate/application #${candidateIdOrShortlistId}`);
  };

  const addMentorshipProgram = (program: Omit<IndustryMentorshipProgram, 'id' | 'currentStudents'>) => {
    const newProg: IndustryMentorshipProgram = {
      ...program,
      id: `ment_prog_${Date.now()}`,
      currentStudents: 0,
      status: 'Active',
    };
    setIndustryMentorship((prev) => [newProg, ...prev]);
    showToast(`Mentorship program "${newProg.programName}" initiated!`, 'success');
  };

  const addIndustryWorkshop = (workshop: Omit<IndustryWorkshopItem, 'id' | 'registeredCount'>) => {
    const newWk: IndustryWorkshopItem = {
      ...workshop,
      id: `wk_ind_${Date.now()}`,
      registeredCount: 0,
    };
    setIndustryWorkshopsList((prev) => [newWk, ...prev]);
    showToast(`Industry workshop "${newWk.title}" created & announced!`, 'success');
    void SupabaseDataService.saveWorkshop(newWk);
  };

  const updateIndustryProfileData = (updates: Partial<IndustryProfileData>) => {
    setIndustryProfile((prev) => ({ ...prev, ...updates }));
    showToast('Industry profile updated successfully!');
  };

  // ==========================================
  // STEP 7: FACULTY PORTAL HANDLERS
  // ==========================================
  const recommendFacultyInternship = (internshipId: string) => {
    setFacultyInternships((prev) =>
      prev.map((item) =>
        item.id === internshipId
          ? {
              ...item,
              status: 'Recommended',
              recommendationsCount: item.recommendationsCount + 1,
            }
          : item
      )
    );
    showToast('Internship recommended to eligible department student cohorts!', 'success');
  };

  const addIndustrialTraining = (training: Omit<IndustrialTrainingItem, 'id' | 'progress'>) => {
    const newTr: IndustrialTrainingItem = {
      ...training,
      id: `ind_train_${Date.now()}`,
      progress: 0,
      status: 'Planning',
    };
    setIndustrialTraining((prev) => [newTr, ...prev]);
    showToast(`Industrial training "${newTr.trainingTitle}" scheduled!`, 'success');
  };

  const updateIndustrialTraining = (trainingId: string, updates: Partial<IndustrialTrainingItem>) => {
    setIndustrialTraining((prev) =>
      prev.map((t) => (t.id === trainingId ? { ...t, ...updates } : t))
    );
    showToast('Industrial training updated.');
  };

  const addFDPProgram = (fdp: Omit<FDPProgramItem, 'id'>) => {
    const newFdp: FDPProgramItem = {
      ...fdp,
      id: `fdp_${Date.now()}`,
    };
    setFdpPrograms((prev) => [newFdp, ...prev]);
    showToast(`FDP "${newFdp.programTitle}" created!`, 'success');
  };

  const registerForFDP = (fdpId: string) => {
    setFdpPrograms((prev) =>
      prev.map((f) => (f.id === fdpId ? { ...f, registrationStatus: 'Registered' } : f))
    );
    showToast('Registered for Faculty Development Program!', 'success');
  };

  const addFacultyConsultancy = (cons: Omit<FacultyConsultancyItem, 'id'>) => {
    const newCons: FacultyConsultancyItem = {
      ...cons,
      id: `cons_${Date.now()}`,
    };
    setFacultyConsultancy((prev) => [newCons, ...prev]);
    showToast(`Consultancy project "${newCons.projectTitle}" proposed!`, 'success');
  };

  const updateFacultyConsultancyStatus = (consId: string, status: FacultyConsultancyItem['status']) => {
    setFacultyConsultancy((prev) =>
      prev.map((c) => (c.id === consId ? { ...c, status } : c))
    );
    showToast(`Consultancy project status updated to ${status}.`);
  };

  const addResearchCollaboration = (collab: Omit<ResearchCollaborationItem, 'id'>) => {
    const newCollab: ResearchCollaborationItem = {
      ...collab,
      id: `res_collab_${Date.now()}`,
    };
    setResearchCollaborations((prev) => [newCollab, ...prev]);
    showToast(`Research collaboration "${newCollab.researchProject}" initiated!`, 'success');
  };

  const updateResearchCollaborationStatus = (collabId: string, status: ResearchCollaborationItem['status']) => {
    setResearchCollaborations((prev) =>
      prev.map((r) => (r.id === collabId ? { ...r, status } : r))
    );
    showToast(`Research collaboration status updated to ${status}.`);
  };

  const addFacultyWorkshop = (workshop: Omit<FacultyWorkshopItem, 'id' | 'enrolledStudentsCount'>) => {
    const newWk: FacultyWorkshopItem = {
      ...workshop,
      id: `fac_wk_${Date.now()}`,
      enrolledStudentsCount: 0,
      status: 'Upcoming',
    };
    setFacultyWorkshops((prev) => [newWk, ...prev]);
    showToast(`Faculty workshop "${newWk.workshopTitle}" scheduled!`, 'success');
  };

  const addGuestLecture = (gl: Omit<GuestLectureItem, 'id' | 'participantsCount'>) => {
    const newGl: GuestLectureItem = {
      ...gl,
      id: `gl_${Date.now()}`,
      participantsCount: 0,
      status: 'Scheduled',
    };
    setGuestLectures((prev) => [newGl, ...prev]);
    showToast(`Guest lecture "${newGl.lectureTitle}" confirmed!`, 'success');
  };

  const cancelGuestLecture = (lectureId: string) => {
    setGuestLectures((prev) =>
      prev.map((l) => (l.id === lectureId ? { ...l, status: 'Cancelled' } : l))
    );
    showToast('Guest lecture cancelled.');
  };

  const addFacultyIndustryProject = (proj: Omit<FacultyIndustryProjectItem, 'id' | 'progressPercentage'>) => {
    const newProj: FacultyIndustryProjectItem = {
      ...proj,
      id: `fac_proj_${Date.now()}`,
      progressPercentage: 0,
      status: 'Planning',
    };
    setFacultyIndustryProjects((prev) => [newProj, ...prev]);
    showToast(`Industry project "${newProj.projectName}" created!`, 'success');
  };

  const assignStudentToFacultyProject = (
    projectId: string,
    student: { id: string; name: string; avatar?: string; role: string }
  ) => {
    setFacultyIndustryProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const studentExists = p.students.some((s) => s.id === student.id);
        if (studentExists) return p;
        return {
          ...p,
          students: [...p.students, { ...student, progress: 0 }],
        };
      })
    );
    showToast(`Assigned ${student.name} to project!`, 'success');
  };

  const updateFacultyProjectProgress = (
    projectId: string,
    progress: number,
    status?: FacultyIndustryProjectItem['status']
  ) => {
    setFacultyIndustryProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          progressPercentage: progress,
          status: status || (progress >= 100 ? 'Completed' : progress > 0 ? 'Active' : p.status),
        };
      })
    );
    showToast(`Project progress updated to ${progress}%!`);
  };

  const addFacultyMentorshipFeedback = (
    mentorshipId: string,
    feedback: string,
    progress?: number,
    status?: FacultyMentorshipItem['status']
  ) => {
    setFacultyMentorship((prev) =>
      prev.map((m) => {
        if (m.id !== mentorshipId) return m;
        return {
          ...m,
          feedbackNotes: feedback,
          progress: progress !== undefined ? progress : m.progress,
          status: status || m.status,
          lastInteraction: 'Just now (Faculty Review)',
        };
      })
    );
    showToast('Mentorship feedback recorded.');
  };

  const updateAcademicProfileData = (updates: Partial<AcademicProfileData>) => {
    setAcademicProfile((prev) => ({ ...prev, ...updates }));
    showToast('Faculty profile updated successfully!');
  };

  // Step 8: Institution Handlers
  const updateInstitutionStudent = (id: string, updates: Partial<InstitutionStudentItem>) => {
    setInstitutionStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Student academic record updated', 'success');
  };

  const addInstitutionCollaboration = (collab: Omit<InstitutionCollaborationItem, 'id'>) => {
    const newCollab: InstitutionCollaborationItem = {
      ...collab,
      id: `collab_${Date.now()}`,
    };
    setInstitutionCollaborations((prev) => [newCollab, ...prev]);
    showToast(`New industry partnership registered with ${collab.industry}`, 'success');
    addAuditLog(`Created institutional collaboration: ${collab.collaborationType} with ${collab.industry}`);
  };

  const updateInstitutionCollaboration = (id: string, updates: Partial<InstitutionCollaborationItem>) => {
    setInstitutionCollaborations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Industry collaboration updated', 'success');
  };

  const deleteInstitutionCollaboration = (id: string) => {
    setInstitutionCollaborations((prev) => prev.filter((c) => c.id !== id));
    showToast('Collaboration record removed', 'info');
  };

  const addInstitutionPlacement = (placement: Omit<InstitutionPlacementItem, 'id'>) => {
    const newPlacement: InstitutionPlacementItem = {
      ...placement,
      id: `plc_${Date.now()}`,
    };
    setInstitutionPlacements((prev) => [newPlacement, ...prev]);
    setInstitutionStudents((prev) =>
      prev.map((s) =>
        s.id === placement.studentId
          ? {
              ...s,
              placementStatus: 'Placed',
              placementDetails: {
                company: placement.company,
                role: placement.role,
                package: placement.packageRange,
                date: placement.date,
              },
            }
          : s
      )
    );
    showToast(`Verified placement offer added for ${placement.studentName}!`, 'success');
    addAuditLog(`Logged campus placement: ${placement.studentName} at ${placement.company} (${placement.packageRange})`);
  };

  const updateInstitutionSettings = (updates: Partial<InstitutionSettingsData>) => {
    setInstitutionSettings((prev) => ({ ...prev, ...updates }));
    showToast('Institution settings updated & saved', 'success');
    addAuditLog('Updated college institutional configuration');
  };

  // Step 9: Admin Handlers
  const updateAdminUserStatus = (userId: string, status: AdminUserItem['status']) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    showToast(`User status updated to ${status}`, 'success');
    addAuditLog(`Admin changed user ${userId} status to ${status}`);
  };

  const updateAdminUserRole = (userId: string, role: UserRole) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    showToast(`User role updated to ${role}`, 'success');
    addAuditLog(`Admin reassigned role of user ${userId} to ${role}`);
  };

  const updateAdminUser = (userId: string, updates: Partial<AdminUserItem>) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
    showToast('User record updated successfully', 'success');
    addAuditLog(`Admin updated user profile ${userId}`);
  };

  const deleteAdminUser = (userId: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User removed from platform', 'info');
    addAuditLog(`Admin deleted user account ${userId}`);
  };

  const updateAdminOpportunity = (oppId: string, updates: Partial<AdminOpportunityItem>) => {
    setAdminOpportunities((prev) => prev.map((o) => (o.id === oppId ? { ...o, ...updates } : o)));
    showToast('Opportunity updated successfully', 'success');
    addAuditLog(`Admin updated opportunity ${oppId}`);
  };

  const updateAdminApplication = (appId: string, updates: Partial<AdminApplicationItem>) => {
    setAdminApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, ...updates } : a)));
    showToast('Application updated successfully', 'success');
    addAuditLog(`Admin updated application ${appId}`);
  };

  const updateAdminOpportunityStatus = (oppId: string, status: AdminOpportunityItem['status']) => {
    setAdminOpportunities((prev) => prev.map((o) => (o.id === oppId ? { ...o, status } : o)));
    showToast(`Opportunity marked as ${status}`, 'success');
    addAuditLog(`Admin moderated opportunity ${oppId} to ${status}`);
  };

  const updateAdminApplicationStatus = (appId: string, status: AdminApplicationItem['status']) => {
    setAdminApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    showToast(`Application status updated to ${status}`, 'success');
    addAuditLog(`Admin changed application ${appId} status to ${status}`);
  };

  const updatePlatformSettings = (updates: Partial<PlatformSettingsData>) => {
    setPlatformSettings((prev) => ({ ...prev, ...updates }));
    showToast('Platform operational settings updated', 'success');
    addAuditLog('Updated central platform configuration settings');
  };

  const resetPlatformDemoData = () => {
    setInstitutionStudents(INITIAL_INSTITUTION_STUDENTS);
    setInstitutionCollaborations(INITIAL_INSTITUTION_COLLABORATIONS);
    setInstitutionPlacements(INITIAL_INSTITUTION_PLACEMENTS);
    setInstitutionSettings(INITIAL_INSTITUTION_SETTINGS);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setAdminOpportunities(INITIAL_ADMIN_OPPORTUNITIES);
    setAdminApplications(INITIAL_ADMIN_APPLICATIONS);
    setPlatformSettings(INITIAL_PLATFORM_SETTINGS);

    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_INSTITUTION_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.COLLABORATIONS, JSON.stringify(INITIAL_INSTITUTION_COLLABORATIONS));
      localStorage.setItem(STORAGE_KEYS.PLACEMENTS, JSON.stringify(INITIAL_INSTITUTION_PLACEMENTS));
      localStorage.setItem(STORAGE_KEYS.INSTITUTION_SETTINGS, JSON.stringify(INITIAL_INSTITUTION_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_ADMIN_OPPORTUNITIES));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_ADMIN_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.ADMIN_SETTINGS, JSON.stringify(INITIAL_PLATFORM_SETTINGS));
    } catch {}

    showToast('All platform and institutional demo data reset to default state.', 'info');
    addAuditLog('Triggered system-wide demo data reset to factory initial state', 'Warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        isDarkMode,
        toggleDarkMode,
        themeMode,
        setThemeMode,
        studentProfile,
        updateStudentProfile,
        addSkillToStudent,
        deleteSkill,
        updateSkillLevel,
        recordSkillAssessment,
        addCertification,
        deleteCertification,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectFeatured,
        addEducation,
        updateEducation,
        deleteEducation,
        addExperience,
        updateExperience,
        deleteExperience,
        addAchievement,
        deleteAchievement,
        addStudentActivity,
        uploadResumeFile,
        updateCareerPreferences,
        updateStudentSettings,
        addLearningRoadmap,
        toggleMilestone,
        jobs,
        addJob,
        editJob,
        deleteJob,
        applyForJob,
        saveJob,
        applications,
        updateApplicationStatus,
        facultyMembers,
        verifyStudentCertificate,
        endorseStudentSkill,
        companies,
        currentCompany,
        updateCompanyProfile,
        requestCompanyVerification,
        verifyCompany,
        companyOffers,
        extendCompanyOffer,
        updateOfferStatus,
        companyInterviews,
        scheduleCompanyInterview,
        updateCompanyInterview,
        companyTeam,
        addCompanyTeamMember,
        removeCompanyTeamMember,
        candidatePool,
        inviteCandidateToJob,
        companySettings,
        updateCompanySettings,
        collegeInfo,
        updateCollegeInfo,
        mentorships,
        requestMentorship,
        updateMentorshipStatus,
        workshops,
        registerForWorkshop,
        createWorkshop,
        directConversations,
        sendDirectMessage,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        auditLogs,
        addAuditLog,
        toasts,
        showToast,
        removeToast,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        currentRole: currentUser.role,
        isLandingView: currentPath === '/' || currentPath === '',
        goToLanding: () => navigate('/'),
        currentPath,
        navigate,
        selectedInternshipId,
        setSelectedInternshipId,
        selectedJobId,
        setSelectedJobId,
        publishNewOpportunity,
        isMobileMenuOpen,
        setIsMobileMenuOpen,

        // Step 4 & 5
        assessmentSession,
        saveAssessmentSession,
        selectedCareerRole,
        setSelectedCareerRole,
        roadmapMilestones,
        updateRoadmapMilestoneStatus,
        savedInternshipIds,
        toggleSaveInternship,
        applyForJobWithDetails,

        // Step 6 Industry Portal
        industryOpportunities,
        addOpportunity,
        updateOpportunity,
        closeOpportunity,
        deleteOpportunity,
        shortlistedCandidates,
        shortlistCandidate,
        removeFromShortlist,
        removeShortlistedCandidate: removeFromShortlist,
        updateShortlistStatus,
        updateShortlistedStatus: updateShortlistStatus,
        scheduleInterview,
        industryMentorship,
        addMentorshipProgram,
        industryWorkshopsList,
        addIndustryWorkshop,
        industryProfile,
        updateIndustryProfileData,

        // Step 7 Faculty Portal
        facultyInternships,
        recommendFacultyInternship,
        industrialTraining,
        addIndustrialTraining,
        updateIndustrialTraining,
        fdpPrograms,
        addFDPProgram,
        registerForFDP,
        facultyConsultancy,
        addFacultyConsultancy,
        updateFacultyConsultancyStatus,
        researchCollaborations,
        addResearchCollaboration,
        updateResearchCollaborationStatus,
        facultyWorkshops,
        addFacultyWorkshop,
        guestLectures,
        addGuestLecture,
        cancelGuestLecture,
        facultyIndustryProjects,
        addFacultyIndustryProject,
        assignStudentToFacultyProject,
        updateFacultyProjectProgress,
        facultyMentorship,
        addFacultyMentorshipFeedback,
        academicProfile,
        updateAcademicProfileData,

        // Step 8 Institution Portal
        institutionStudents,
        updateInstitutionStudent,
        institutionCollaborations,
        addInstitutionCollaboration,
        updateInstitutionCollaboration,
        deleteInstitutionCollaboration,
        institutionPlacements,
        addInstitutionPlacement,
        institutionSettings,
        updateInstitutionSettings,

        // Step 9 Platform Administration
        adminUsers,
        updateAdminUserStatus,
        updateAdminUserRole,
        updateAdminUser,
        deleteAdminUser,
        adminOpportunities,
        updateAdminOpportunityStatus,
        updateAdminOpportunity,
        adminApplications,
        updateAdminApplicationStatus,
        updateAdminApplication,
        platformSettings,
        updatePlatformSettings,
        resetPlatformDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
