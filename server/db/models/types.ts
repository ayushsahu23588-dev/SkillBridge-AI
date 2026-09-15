export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'college_admin' | 'company' | 'super_admin';
  avatar: string;
  organization?: string;
  department?: string;
  verified: boolean;
  createdAt: string;
}

export interface IStudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  degree: string;
  batch: string;
  gpa: number;
  headline: string;
  bio: string;
  phone: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  industryReadinessScore: number;
  aiSkillScore: number;
  atsResumeScore: number;
  skills: Array<{
    id: string;
    name: string;
    category: string;
    level: string;
    verifiedScore?: number;
    verifiedByFaculty?: boolean;
    facultyEndorsement?: string;
  }>;
  certifications: Array<{
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    verified: boolean;
    verifiedByFacultyName?: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    likesCount: number;
  }>;
  experiences: Array<{
    id: string;
    role: string;
    company: string;
    type: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  appliedJobIds: string[];
  savedJobIds: string[];
}

export interface IJobPosting {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'Internship' | 'Full-time' | 'Co-op' | 'Apprenticeship';
  workplaceType: 'Remote' | 'On-site' | 'Hybrid';
  location: string;
  stipendOrSalary: string;
  experienceLevel: string;
  departmentTarget: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minGpa?: number;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  deadline: string;
  postedDate: string;
  applicantCount: number;
  status: 'Active' | 'Closing Soon' | 'Closed';
}

export interface IApplication {
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
  status: 'Applied' | 'Screening' | 'Technical Round' | 'Interview Scheduled' | 'Offer Extended' | 'Hired' | 'Rejected';
  aiMatchScore: number;
  aiMatchSummary?: string;
  recruiterNotes?: string;
  interviewDate?: string;
  offerDetails?: {
    role: string;
    package: string;
    startDate: string;
  };
}
