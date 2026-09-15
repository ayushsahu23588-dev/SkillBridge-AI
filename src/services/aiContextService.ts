/**
 * AI Context Service
 * Creates structured, privacy-preserving context payloads for Gemini prompts across roles.
 * Strictly avoids transmitting unnecessary sensitive information.
 */

import { StudentProfile, JobPosting, User } from '../types';

export interface StudentAiContext {
  role: 'student';
  name: string;
  department: string;
  batch: string;
  gpa: number;
  skills: { name: string; level: string; score?: number }[];
  skillGaps?: { skill: string; current: number; target: number; gap: number }[];
  careerInterests?: string[];
  projects: { title: string; techStack: string[] }[];
  certifications: { title: string; verified: boolean }[];
  appliedJobCount: number;
  readinessScore: number;
}

export interface IndustryAiContext {
  role: 'company';
  companyName: string;
  industryDomain?: string;
  activeOpportunitiesCount?: number;
  opportunityContext?: {
    id: string;
    title: string;
    type: string;
    requiredSkills: string[];
    preferredSkills?: string[];
    location: string;
  };
}

export interface FacultyAiContext {
  role: 'faculty';
  name: string;
  department: string;
  designation?: string;
  expertiseAreas: string[];
  activeCollaborationsCount: number;
  menteesCount: number;
}

export interface InstitutionAiContext {
  role: 'college_admin';
  institutionName: string;
  totalStudents: number;
  departments: string[];
  topSkillGaps: string[];
  topDemandedSkills: string[];
  placementRatePercentage: number;
}

export interface AdminAiContext {
  role: 'super_admin';
  totalUsers: number;
  totalOpportunities: number;
  totalApplications: number;
  topSkillsInDemand: string[];
}

export const aiContextService = {
  buildStudentContext(
    profile: StudentProfile,
    additionalGaps?: { skill: string; current: number; target: number; gap: number }[],
    targetRole?: string
  ): StudentAiContext {
    return {
      role: 'student',
      name: profile.name,
      department: profile.department,
      batch: profile.batch,
      gpa: profile.gpa,
      skills: (profile.skills || []).map((s) => ({
        name: s.name,
        level: s.level,
        score: s.verifiedScore,
      })),
      skillGaps: additionalGaps,
      careerInterests: profile.careerPreferences?.targetRole
        ? [profile.careerPreferences.targetRole, ...(targetRole ? [targetRole] : [])]
        : targetRole ? [targetRole] : ['Backend Developer', 'Software Developer'],
      projects: (profile.projects || []).map((p) => ({
        title: p.title,
        techStack: p.techStack,
      })),
      certifications: (profile.certifications || []).map((c) => ({
        title: c.title,
        verified: c.verified,
      })),
      appliedJobCount: profile.appliedJobIds?.length || 0,
      readinessScore: profile.industryReadinessScore || 75,
    };
  },

  buildIndustryContext(
    currentUser: User,
    job?: JobPosting | null
  ): IndustryAiContext {
    return {
      role: 'company',
      companyName: currentUser.organization || 'Tech Enterprise Partner',
      industryDomain: currentUser.department || 'Information Technology',
      opportunityContext: job
        ? {
            id: job.id,
            title: job.title,
            type: job.type,
            requiredSkills: job.requiredSkills || [],
            location: job.location,
          }
        : undefined,
    };
  },

  buildFacultyContext(
    currentUser: User,
    expertise: string[] = ['Distributed Systems', 'Cloud Computing', 'Data Engineering']
  ): FacultyAiContext {
    return {
      role: 'faculty',
      name: currentUser.name,
      department: currentUser.department || 'Computer Science & Engineering',
      designation: 'Associate Professor & Mentor',
      expertiseAreas: expertise,
      activeCollaborationsCount: 4,
      menteesCount: 24,
    };
  },

  buildInstitutionContext(
    stats?: { totalStudents?: number; placementRate?: number; topGaps?: string[]; topDemand?: string[] }
  ): InstitutionAiContext {
    return {
      role: 'college_admin',
      institutionName: 'Apex National Institute of Technology',
      totalStudents: stats?.totalStudents || 1450,
      departments: ['CSE', 'IT', 'ECE', 'Data Science', 'AI & Robotics'],
      topSkillGaps: stats?.topGaps || ['Data Structures & Algorithms', 'REST APIs', 'Cloud (AWS/GCP)', 'Docker'],
      topDemandedSkills: stats?.topDemand || ['Python', 'SQL', 'React', 'Node.js', 'System Design'],
      placementRatePercentage: stats?.placementRate || 86,
    };
  },

  buildAdminContext(
    metrics?: { totalUsers?: number; totalOpportunities?: number; totalApplications?: number }
  ): AdminAiContext {
    return {
      role: 'super_admin',
      totalUsers: metrics?.totalUsers || 2480,
      totalOpportunities: metrics?.totalOpportunities || 142,
      totalApplications: metrics?.totalApplications || 890,
      topSkillsInDemand: ['Python', 'SQL', 'TypeScript', 'Docker', 'AWS', 'DSA'],
    };
  },
};
