export type UserRole = 'student' | 'faculty' | 'college_admin' | 'company' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  organization?: string;
  department?: string;
  verified: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  degree: string;
  batch: string; // e.g. "2022 - 2026"
  gpa: number;
  cgpa?: number;
  targetRole?: string;
  headline: string;
  bio: string;
  phone: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  
  // AI Metrics
  industryReadinessScore: number; // 0-100
  aiSkillScore: number; // 0-100
  atsResumeScore: number; // 0-100
  
  skills: StudentSkill[];
  certifications: Certification[];
  projects: Project[];
  experiences: Experience[];
  educations?: Education[];
  achievements?: Achievement[];
  appliedJobIds: string[];
  savedJobIds: string[];
  activeRoadmaps: LearningRoadmap[];
  activityTimeline?: StudentActivity[];
  
  // Resume Document Details
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  resumeText?: string;
  
  careerPreferences?: {
    targetRole: string;
    preferredLocations: string[];
    expectedStipend: string;
    workMode: 'Remote' | 'On-site' | 'Hybrid';
    openToRelocation: boolean;
  };
  
  settings?: {
    publicPortfolio?: boolean;
    emailNotifications?: boolean;
    jobAlerts?: boolean;
    mentorshipReminders?: boolean;
    interviewReminders?: boolean;
    shareProfileWithRecruiters?: boolean;
    themePreference?: 'system' | 'dark' | 'light';
  };
}

export interface StudentSkill {
  id: string;
  name: string;
  category?: 'Frontend' | 'Backend' | 'AI / Data' | 'DevOps & Cloud' | 'Database' | 'Soft Skills' | string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verifiedScore?: number; // 0-100 from test
  score?: number;
  verified?: boolean;
  verifiedByFaculty?: boolean;
  facultyEndorsement?: string;
  endorsementsCount?: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
  verifiedByFacultyName?: string;
  verificationDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  likesCount: number;
  industryEndorsed?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  type: 'Internship' | 'Full-time' | 'Research' | 'Contract';
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  verifiedByCompany?: boolean;
}

export interface JobPosting {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'Internship' | 'Full-time' | 'Co-op' | 'Apprenticeship' | 'Contract' | 'Part-time';
  workplaceType?: 'Remote' | 'On-site' | 'Hybrid';
  location: string;
  stipendOrSalary?: string;
  salaryOrStipend?: string;
  department?: string;
  experienceLevel?: 'Entry-Level' | 'Junior' | 'Mid' | 'Any';
  departmentTarget?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  minGpa?: number;
  description: string;
  requirements?: string[];
  eligibleBatches?: string[];
  targetColleges?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  deadline: string;
  postedDate: string;
  applicantCount: number;
  status?: 'Active' | 'Closing Soon' | 'Closed';
}

export type ApplicationStatus = 'Applied' | 'Screening' | 'Technical Round' | 'Interview Scheduled' | 'Offer Extended' | 'Hired' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  studentCollege: string;
  studentDepartment: string;
  studentGpa: number;
  studentSkills: string[];
  appliedDate: string;
  status: ApplicationStatus;
  aiMatchScore: number;
  aiMatchSummary?: string;
  recruiterNotes?: string;
  interviewDate?: string;
  coverLetter?: string;
  resumeUrl?: string;
  jobTitle?: string;
  companyName?: string;
  offerDetails?: {
    role: string;
    package: string;
    startDate: string;
  };
}

export interface FacultyMember {
  id: string;
  userId: string;
  name: string;
  title?: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  designation: string;
  specialization?: string;
  specializations: string[];
  expertise?: string[];
  activeMenteesCount: number;
  pendingVerificationsCount: number;
  officeHours: string;
  rating: number;
}

export interface MentorshipSession {
  id: string;
  facultyId: string;
  facultyName: string;
  studentId: string;
  studentName: string;
  topic: string;
  status: 'Requested' | 'Scheduled' | 'Completed' | 'Declined';
  scheduledDate: string;
  timeSlot: string;
  date?: string;
  time?: string;
  meetingLink?: string;
  notes?: string;
}

export interface Workshop {
  id: string;
  title: string;
  organizer: string; // Faculty / Company
  instructorName: string;
  instructorOrg?: string;
  company?: string;
  topics?: string[];
  capacity?: number;
  industryPartner?: string;
  category: 'AI & Data' | 'Cloud Architecture' | 'Full Stack' | 'Interview Mastery' | 'Research Methodologies';
  date: string;
  time: string;
  duration: string;
  mode: 'Online' | 'In-Person';
  registeredCount: number;
  maxSeats: number;
  description: string;
}

export interface CollegeInfo {
  id: string;
  name: string;
  code: string;
  location: string;
  establishedYear: number;
  nirfRank?: number;
  totalStudents: number;
  placementRate: number; // e.g. 91.4%
  averagePackageLPA: number; // in LPA or USD
  highestPackageLPA: number;
  activeMOUs: number;
  departments: {
    name: string;
    studentCount: number;
    placementRate: number;
    avgSalary: number;
    topSkillGaps: string[];
  }[];
}

export interface CompanyPartner {
  id: string;
  name: string;
  logo: string;
  industry: string;
  headquarters: string;
  size: string;
  verified: boolean;
  tier: 'Tier 1 Global' | 'Enterprise' | 'Fast-Growing Unicorn' | 'High-Tech Startup';
  activeOpenings: number;
  totalHiresFromNetwork: number;
  mouSignedWithColleges: string[];
  description: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  foundedYear?: number;
  techStack?: string[];
  culturePerks?: string[];
  verificationStatus?: 'Verified' | 'Pending' | 'Action Required' | 'Under Review';
  verificationDocs?: {
    id: string;
    title: string;
    type: string;
    fileUrl: string;
    uploadedAt: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    notes?: string;
  }[];
  mouDetails?: {
    id: string;
    collegeName: string;
    signedDate: string;
    validUntil: string;
    hiringQuota: number;
    partnershipLead: string;
  }[];
  aboutCulture?: string;
}

export interface CompanyOffer {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  jobId: string;
  jobTitle: string;
  type?: 'Internship' | 'Full-time' | 'Co-op' | string;
  offerType?: string;
  ctcOrStipend: string;
  baseSalary?: string;
  joiningBonus?: string;
  location: string;
  joiningDate: string;
  validUntil?: string;
  expiryDate?: string;
  offerLetterUrl?: string;
  status: 'Draft' | 'Extended' | 'Accepted' | 'Declined' | 'Expired' | 'Withdrawn';
  perks?: string[];
  contractNotes?: string;
  extendedAt: string;
}

export interface CompanyInterview {
  id: string;
  applicationId?: string;
  companyId: string;
  companyName?: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  roundName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes?: number;
  mode: 'Google Meet' | 'Zoom' | 'On-Campus' | 'In-Person' | 'MS Teams';
  meetingLink: string;
  interviewers?: string[];
  interviewerName?: string;
  interviewerEmail?: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  feedbackNotes?: string;
  notes?: string;
  score?: number;
}

export interface CompanyTeamMember {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'Primary Recruiter' | 'Technical Interviewer' | 'Hiring Manager' | 'Admin';
  avatar: string;
  department: string;
  status: 'Active' | 'Invited';
  addedAt: string;
}

export interface CandidateSearchProfile {
  id: string;
  name: string;
  headline?: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  batch: string;
  gpa: number;
  skills: string[];
  topProjects: { title: string; techStack: string[]; githubUrl?: string; liveUrl?: string }[];
  certifications: { title: string; issuer: string; verified: boolean }[];
  readinessScore: number;
  workPreferences: { targetRole: string; workMode: string; openToRelocation: boolean };
  endorsementsCount: number;
  resumeText?: string;
}

export interface CompanySettings {
  autoScreenWithAI: boolean;
  autoScreenResumes?: boolean;
  minMatchScoreCutoff?: number;
  minGpaCutoff?: number;
  defaultInterviewPlatform?: string;
  emailAlertsOnNewApplicant?: boolean;
  emailAlertsOnOfferStatus?: boolean;
  dailyDigestEmail?: boolean;
  notificationEmail?: string;
  minGpaAutoReject: number;
  emailOnNewApplication: boolean;
  smsOnInterviewConfirm: boolean;
  weeklyAnalyticsDigest: boolean;
  defaultMeetingPlatform: 'Google Meet' | 'Zoom' | 'On-Campus' | string;
  defaultInterviewDurationMin: number;
  rejectionEmailTemplate: string;
  interviewEmailTemplate: string;
  offerEmailTemplate: string;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  role: string;
  totalWeeks: number;
  progressPercentage: number;
  milestones: {
    phase: string;
    weekRange: string;
    theme: string;
    completed: boolean;
    objectives: string[];
    keyTopics: string[];
    handsOnProject: string;
    recommendedResources: { name: string; type: 'Doc' | 'Video' | 'Lab'; url: string }[];
  }[];
  capstoneProject: {
    title: string;
    deliverables: string[];
    industryRelevance: string;
  };
}

export interface InterviewSessionState {
  id: string;
  role: string;
  difficulty: string;
  currentQuestionIndex: number;
  questions: {
    id: string;
    category: string;
    question: string;
    idealAnswerSummary: string;
    userAnswer?: string;
    evaluation?: {
      score: number;
      feedback: string;
      strengths: string[];
      areasForImprovement: string[];
      modelAnswerSnippet?: string;
    };
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'verification' | 'mentorship' | 'ai_recommendation' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Innovation Award' | 'Industry Recognition' | 'Publication' | 'Honor' | 'Open Source';
  issuer: string;
  date: string;
  description: string;
  link?: string;
  badgeIcon?: string;
}

export interface StudentActivity {
  id: string;
  type: 'resume_parsed' | 'assessment_completed' | 'job_applied' | 'project_published' | 'cert_verified' | 'interview_scheduled' | 'roadmap_progress' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  metricChange?: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachmentUrl?: string;
}

export interface SkillQuizQuestion {
  id: string;
  skillName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillAssessmentResult {
  skillName: string;
  score: number; // 0-100
  totalQuestions: number;
  correctCount: number;
  passed: boolean;
  badgeAwarded?: string;
  date: string;
}

export type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'reset_password' | 'verify_email';

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization?: string;
  department?: string;
  degree?: string;
  batch?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface GoogleAuthPayload {
  email: string;
  name: string;
  avatar?: string;
  role?: UserRole;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy?: string;
  actor?: string;
  role?: string;
  userRole?: string;
  targetEntity?: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Security Alert' | 'Info';
  details?: string;
  ipAddress?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  verificationOtp?: string;
  demoOtp?: string;
}

// Reusable Data Structures
export type Student = StudentProfile;
export type Faculty = FacultyMember;
export type Industry = CompanyPartner;
export type Institution = CollegeInfo;
export type Skill = StudentSkill;
export type Assessment = SkillAssessmentResult;

export interface SkillGap {
  skill: string;
  category?: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  status?: 'Strong' | 'Good' | 'Needs Improvement' | 'High Priority' | 'Improve';
  whyItMatters?: string;
  recommendedAction?: string;
  roadmapPhase?: number;
}

export interface SkillCategoryBreakdown {
  category: string;
  score: number;
  benchmark: number;
  status: 'Exceeds Benchmark' | 'On Track' | 'Attention Needed';
}

export interface SkillAssessmentSession {
  techSkills: Record<string, number>;
  softSkills: Record<string, number>;
  interests: string[];
  aptitudeScore: number;
  submittedAt: string;
  overallReadiness: number;
  technicalScore: number;
  softSkillScore: number;
  aptitudeCalculatedScore: number;
  toolsScore: number;
  topStrengths: { skill: string; score: number; category: string }[];
  skillGaps: SkillGap[];
  priorityGaps: SkillGap[];
  recommendedCareers: CareerRecommendation[];
  aiExplanation: string;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  targetRoleKey: string;
  matchPercentage: number;
  requiredSkills: string[];
  strongestMatchingSkills: string[];
  missingSkills: string[];
  marketDemand: 'High' | 'Very High' | 'Moderate';
  avgSalaryRange: string;
  whyRecommended: string;
}

export interface RoadmapPhaseMilestone {
  id: string;
  phaseNumber: number;
  phaseName: string;
  month: string;
  title: string;
  description: string;
  focusTopics: string[];
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Locked';
  progress: number;
  estimatedDuration: string;
  skillsGained: string[];
  actionLabel: string;
  actionTarget?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  platform?: string;
  url?: string;
}

export interface Internship {
  id: string;
  company: string;
  companyLogo?: string;
  role: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  duration: string;
  stipend: string;
  aiMatchScore: number;
  requiredSkills: string[];
  description?: string;
  responsibilities?: string[];
  eligibility?: string;
  aboutCompany?: string;
  deadline?: string;
}

export type Job = JobPosting;

export interface Portfolio {
  profile: StudentProfile;
  summary: string;
  skills: StudentSkill[];
  projects: Project[];
  certifications: Certification[];
  internships: Experience[];
  achievements: Achievement[];
}

export interface IndustryRequirement {
  id: string;
  title: string;
  type: 'Internship' | 'Job' | 'Project';
  description: string;
  requiredSkills: string[];
  minimumQualification: string;
  location: string;
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  duration: string;
  stipendOrSalary: string;
  eligibility: string;
  applicationDeadline: string;
  publishedAt: string;
  companyName: string;
}

// ==========================================
// STEP 6: INDUSTRY PORTAL SPECIFIC TYPES
// ==========================================

export type IndustryOpportunityType = 'Internship' | 'Job' | 'Project';
export type OpportunityStatus = 'Active' | 'Closed' | 'Draft';

export interface IndustryOpportunity {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  type: IndustryOpportunityType;
  department?: string;
  description: string;
  responsibilities?: string[];
  problemStatement?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  duration?: string;
  teamSize?: string;
  stipendOrSalary?: string;
  eligibility?: string;
  minQualification?: string;
  experience?: string;
  expectedOutcome?: string;
  deadline: string;
  postedDate: string;
  status: OpportunityStatus;
  applicationsCount: number;
}

export interface CandidateMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  projectAlignment: number; // 0-100
  careerAlignment: number; // 0-100
  explanation: string;
}

export interface ShortlistedCandidate {
  id: string;
  studentId: string;
  candidateId?: string;
  studentName: string;
  candidateName?: string;
  studentAvatar: string;
  studentEmail: string;
  studentCollege: string;
  studentDepartment: string;
  studentGpa: number;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: IndustryOpportunityType;
  matchPercentage: number;
  matchScore?: number;
  shortlistedDate: string;
  status: 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  notes?: string;
  interviewDetails?: {
    date: string;
    time: string;
    type: 'Online' | 'In-person';
    locationOrLink: string;
    notes?: string;
  };
}

export interface IndustryMentorshipProgram {
  id: string;
  programName: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar?: string;
  expertise: string;
  description: string;
  duration: string;
  maxStudents: number;
  currentStudents: number;
  skillsCovered: string[];
  participants?: {
    id: string;
    name: string;
    avatar?: string;
    college: string;
    progress: number;
  }[];
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface IndustryWorkshopItem {
  id: string;
  title: string;
  topic: string;
  speaker: string;
  speakerRole: string;
  description: string;
  date: string;
  time?: string;
  duration: string;
  mode: 'Online' | 'In-person' | 'Hybrid';
  skillsCovered: string[];
  registrationLimit: number;
  registeredCount: number;
  isPast?: boolean;
}

export interface IndustryProfileData {
  companyName: string;
  industry: string;
  website: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  areasOfExpertise: string[];
  collaborationInterests: string[];
  logo?: string;
}

// ==========================================
// STEP 7: FACULTY PORTAL SPECIFIC TYPES
// ==========================================

export interface FacultyInternshipItem {
  id: string;
  organization: string;
  organizationLogo?: string;
  internshipArea: string;
  duration: string;
  eligibility: string;
  skills: string[];
  applicationDeadline: string;
  status: 'Open' | 'Recommended' | 'Closed';
  recommendationsCount: number;
  appliedCount: number;
  description?: string;
}

export interface IndustrialTrainingItem {
  id: string;
  trainingTitle: string;
  industryPartner: string;
  industryLogo?: string;
  description: string;
  skillsCovered: string[];
  startDate: string;
  endDate: string;
  numberOfStudents: number;
  facultyCoordinator: string;
  status: 'Planning' | 'Ongoing' | 'Completed';
  progress: number; // 0-100
  participants?: {
    id: string;
    name: string;
    department: string;
    attendance: number;
  }[];
}

export interface FDPProgramItem {
  id: string;
  programTitle: string;
  organization: string;
  topic: string;
  date: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  registrationStatus: 'Open' | 'Registered' | 'Completed' | 'Waitlisted';
  certificatesProvided: boolean;
  coordinator?: string;
  eligibility?: string;
}

export interface FacultyConsultancyItem {
  id: string;
  projectTitle: string;
  industryOrganization: string;
  domain: string;
  description: string;
  requiredExpertise: string[];
  duration: string;
  status: 'Proposed' | 'Active' | 'Completed';
  facultyLead: string;
  budget?: string;
  milestonesCount?: number;
}

export interface ResearchCollaborationItem {
  id: string;
  researchProject: string;
  industryPartner: string;
  researchDomain: string;
  facultyMembers: string[];
  status: 'Proposed' | 'In Discussion' | 'Active' | 'Completed';
  startDate: string;
  expectedCompletion: string;
  grantAmount?: string;
  publicationsPlanned?: number;
}

export interface FacultyWorkshopItem {
  id: string;
  workshopTitle: string;
  topic: string;
  industryExpert: string;
  organization: string;
  date: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  skillsCovered: string[];
  targetStudentsCount: number;
  enrolledStudentsCount: number;
  status: 'Upcoming' | 'Completed';
}

export interface GuestLectureItem {
  id: string;
  lectureTitle: string;
  speaker: string;
  organization: string;
  speakerTitle?: string;
  topic: string;
  date: string;
  time?: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  description: string;
  participantsCount: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface FacultyIndustryProjectItem {
  id: string;
  projectName: string;
  industryPartner: string;
  domain: string;
  students: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    progress: number;
  }[];
  facultyCoordinator: string;
  status: 'Planning' | 'Active' | 'Completed';
  progressPercentage: number;
  description?: string;
  deliverables?: string[];
}

export interface FacultyMentorshipItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  project: string;
  skillArea: string;
  progress: number; // 0-100
  lastInteraction: string;
  status: 'Active' | 'Review Needed' | 'Completed';
  feedbackNotes?: string;
}

export interface AcademicProfileData {
  name: string;
  department: string;
  institution: string;
  designation: string;
  areasOfExpertise: string[];
  researchInterests: string[];
  skills: string[];
  certifications: string[];
  industryExperience: string;
  contactEmail: string;
  contactPhone: string;
  avatar?: string;
}

// ==========================================
// STEP 8: INSTITUTION PORTAL TYPES
// ==========================================

export interface InstitutionStudentItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  rollNumber?: string;
  department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil' | string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | string;
  semester?: string;
  gpa: number;
  cgpa?: number;
  topSkills: any[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  skillReadiness: number; // 0-100
  overallSkillScore?: number;
  readinessLevel?: string;
  targetCompanyType?: string;
  readinessPercent?: number | string;
  internshipStatus: 'Seeking' | 'Applied' | 'In Internship' | 'Completed' | string;
  placementStatus: 'Eligible' | 'In Process' | 'Placed' | 'Higher Studies' | 'Interviewing' | string;
  careerGoal: any;
  roadmapProgress: any;
  assessmentResult: {
    lastTaken: string;
    overallScore: number;
    skillsAssessed: { name: string; score: number; benchmark: number }[];
  };
  skillAssessmentHistory?: { date: string; score: number; role?: string }[];
  skillGaps: {
    skill: string;
    studentScore?: number;
    industryDemand?: number;
    gap: number;
    priority?: string;
    current?: number;
    required?: number;
    whyItMatters?: string;
  }[];
  projects: {
    id: string;
    title: string;
    tech?: string[];
    techStack?: string[];
    githubUrl?: string;
    liveDemoUrl?: string;
    stars?: number;
  }[];
  certifications: {
    id: string;
    name?: string;
    title?: string;
    issuer: string;
    issueDate?: string;
    verified: boolean;
  }[];
  internships: {
    company: string;
    role: string;
    period?: string;
    duration?: string;
    stipend: string;
    status?: string;
    performanceRating?: string | number;
  }[];
  applications: {
    id: string;
    role?: string;
    opportunityTitle?: string;
    company: string;
    status: string;
    appliedDate: string;
  }[];
  portfolioUrl?: string;
  placementDetails?: {
    company: string;
    role: string;
    package: string;
    date: string;
  };
}

export interface InstitutionCollaborationItem {
  id: string;
  industry: string;
  industryLogo?: string;
  department?: string;
  leadFaculty?: string;
  collaborationType:
    | 'Internship Partnership'
    | 'Internship Program'
    | 'Research Collaboration'
    | 'Industrial Training'
    | 'Consultancy'
    | 'Workshop'
    | 'Guest Lecture'
    | 'Live Project'
    | 'Mentorship'
    | string;
  facultyCoordinator?: string;
  startDate: string;
  endDate: string;
  studentsInvolved?: number;
  studentsBenefited?: number;
  status: 'Proposed' | 'Active' | 'Completed' | 'Closed' | string;
  description: string;
  mouSigned: boolean;
  mouDocUrl?: string;
  mouDocumentUrl?: string;
}

export interface InstitutionPlacementItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  rollNumber?: string;
  company: string;
  companyLogo?: string;
  role: string;
  department: string;
  graduationYear?: number;
  status: 'Eligible' | 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Placed' | string;
  date: string;
  packageRange: string;
  salaryNumberLpa?: number;
  offerLetterUrl?: string;
}

export interface InstitutionSettingsData {
  name: string;
  logo: string;
  location: string;
  website: string;
  about: string;
  contactEmail: string;
  phone: string;
  establishedYear: string;
  accreditationTier?: string;
  aisheCode?: string;
  affiliation?: string;
  tpoContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  departments: { name: string; active: boolean; studentCount: number; hod: string }[];
  academicYears: { term: string; isCurrent: boolean; batchName: string }[];
  notifications: {
    emailPlacementAlerts: boolean;
    dailyAccreditationDigest: boolean;
    gapThresholdWarnings: boolean;
    mouRenewalAlerts: boolean;
  };
  portalPreferences: {
    minimumPlacementCgpa: number;
    autoVerifyCertificates: boolean;
    publicRecruiterShowcase: boolean;
  };
  placementPolicy?: {
    minSkillScore?: number;
    minGpa?: number;
    maxActiveOffers?: number;
    allowDreamOffers?: boolean;
    minCgpaForTier1?: number;
  };
}

// ==========================================
// STEP 9: PLATFORM ADMINISTRATION TYPES
// ==========================================

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'company' | 'college_admin' | 'super_admin';
  organization: string;
  department?: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joinedDate: string;
  avatar: string;
  lastLogin?: string;
  lastActive?: string;
  verified?: boolean;
}

export interface AdminOpportunityItem {
  id: string;
  title: string;
  provider: string;
  providerType: 'Enterprise' | 'Institution' | 'Startup' | 'Research Lab';
  type: 'Internship' | 'Job' | 'Project' | 'Training' | 'Mentorship' | 'Workshop' | 'Guest Lecture';
  createdDate: string;
  postedDate?: string;
  applicationsCount: number;
  status: 'Active' | 'Pending Review' | 'Approved' | 'Closed' | 'Rejected' | 'Pending' | string;
  location?: string;
  stipendOrPackage?: string;
}

export interface AdminApplicationItem {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentCollege: string;
  opportunityTitle: string;
  opportunityType: 'Internship' | 'Job' | 'Project' | 'Training' | 'Mentorship';
  provider: string;
  company?: string;
  aiMatch: number; // 0-100%
  matchScore?: number;
  appliedDate: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  notes?: string;
}

export interface PlatformSettingsData {
  platformName: string;
  systemVersion: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  autoVerificationAI: boolean;
  maxUploadSizeMb: number;
  primaryContactEmail: string;
  defaultTimezone: string;
  securityAuditEnabled: boolean;
  aiMatchingSensitivity?: 'Balanced' | 'Strict' | 'Permissive' | string;
  defaultAssessmentCycle?: 'Semester' | 'Quarterly' | 'Annual' | string;
  autoModerateOpportunities?: boolean;
}




