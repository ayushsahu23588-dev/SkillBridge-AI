import { getSupabase } from '../lib/supabaseClient';
import {
  Job,
  JobPosting,
  Application,
  StudentProfile,
  IndustryOpportunity,
  IndustryMentorshipProgram,
  IndustryWorkshopItem,
  SkillAssessmentSession,
} from '../types';

/**
 * Supabase Data Service
 * Provides robust CRUD operations directly interfacing with Supabase when configured,
 * with graceful fallback to local state.
 */
export const SupabaseDataService = {
  isConfigured(): boolean {
    return Boolean(getSupabase());
  },

  /**
   * Fetch all opportunities/jobs
   */
  async getJobs(): Promise<Job[] | null> {
    const client = getSupabase();
    if (!client) return null;
    try {
      // First try jobs table, then fallback to opportunities
      const { data, error } = await client.from('opportunities').select('*');
      if (error) {
        const { data: jobData, error: jobError } = await client.from('jobs').select('*');
        if (jobError) {
          console.warn('Supabase getJobs error:', jobError.message);
          return null;
        }
        return jobData as Job[];
      }
      // Map opportunities to JobPosting format if needed
      return data.map((item: any) => ({
        id: item.id,
        companyId: item.company_id || item.companyId || 'comp_1',
        companyName: item.company_name || item.companyName || 'Partner Organization',
        companyLogo: item.company_logo || item.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
        title: item.title,
        type: item.type === 'Job' ? 'Full-time' : item.type === 'Project' ? 'Freelance' : 'Internship',
        workplaceType: item.work_mode || item.workplaceType || 'Remote',
        location: item.location || 'Remote',
        stipendOrSalary: item.stipend_or_salary || item.stipendOrSalary || 'Competitive Market Compensation',
        experienceLevel: item.experience_level || 'Entry-Level',
        departmentTarget: item.department_target || [item.department || 'All Departments'],
        requiredSkills: item.required_skills || item.requiredSkills || [],
        preferredSkills: item.preferred_skills || item.preferredSkills || [],
        description: item.description || '',
        responsibilities: item.responsibilities || [],
        qualifications: item.qualifications || [],
        benefits: item.benefits || ['Certificate of Completion', 'Mentorship Support'],
        deadline: item.deadline || 'Ongoing',
        postedDate: item.posted_date || 'Recently',
        applicantCount: item.applicant_count || 0,
        status: item.status || 'Active',
      })) as Job[];
    } catch (err) {
      console.warn('Supabase getJobs network error:', err);
      return null;
    }
  },

  /**
   * Insert or update a job / opportunity
   */
  async saveJob(job: Partial<Job>): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: job.id,
        company_id: job.companyId,
        company_name: job.companyName,
        company_logo: job.companyLogo,
        title: job.title,
        type: job.type === 'Full-time' ? 'Job' : 'Internship',
        department: job.departmentTarget?.[0] || 'Engineering',
        location: job.location,
        work_mode: job.workplaceType || 'Remote',
        stipend_or_salary: job.stipendOrSalary,
        deadline: job.deadline,
        status: job.status || 'Active',
        description: job.description,
        responsibilities: job.responsibilities || [],
        required_skills: job.requiredSkills || [],
        preferred_skills: job.preferredSkills || [],
        qualifications: job.qualifications || [],
        applicant_count: job.applicantCount || 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await client.from('opportunities').upsert(dbRow);
      if (error) {
        // Fallback to jobs table if opportunities does not exist
        const { error: fallbackError } = await client.from('jobs').upsert(job);
        if (fallbackError) {
          console.warn('Supabase saveJob error:', fallbackError.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveJob network error:', err);
      return false;
    }
  },

  /**
   * Insert or update an Industry Opportunity
   */
  async saveOpportunity(opp: Partial<IndustryOpportunity>): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: opp.id,
        company_id: opp.companyId,
        company_name: opp.companyName,
        company_logo: opp.companyLogo,
        title: opp.title,
        type: opp.type || 'Internship',
        department: opp.department,
        location: opp.location,
        work_mode: opp.workMode || 'Remote',
        stipend_or_salary: opp.stipendOrSalary,
        deadline: opp.deadline,
        status: opp.status || 'Active',
        description: opp.description,
        responsibilities: opp.responsibilities || [],
        required_skills: opp.requiredSkills || [],
        preferred_skills: opp.preferredSkills || [],
        applicant_count: opp.applicationsCount || 0,
        updated_at: new Date().toISOString(),
      };

      const { error } = await client.from('opportunities').upsert(dbRow);
      if (error) {
        console.warn('Supabase saveOpportunity error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOpportunity network error:', err);
      return false;
    }
  },

  /**
   * Fetch all applications for a student or company
   */
  async getApplications(studentId?: string, companyId?: string): Promise<Application[] | null> {
    const client = getSupabase();
    if (!client) return null;
    try {
      let query = client.from('applications').select('*');
      if (studentId) query = query.eq('student_id', studentId);
      if (companyId) query = query.eq('company_id', companyId);
      const { data, error } = await query;
      if (error) {
        // Try camelCase fallback
        let fallbackQuery = client.from('applications').select('*');
        if (studentId) fallbackQuery = fallbackQuery.eq('studentId', studentId);
        if (companyId) fallbackQuery = fallbackQuery.eq('companyId', companyId);
        const { data: fallbackData, error: fbError } = await fallbackQuery;
        if (fbError) {
          console.warn('Supabase getApplications error:', fbError.message);
          return null;
        }
        return fallbackData as Application[];
      }
      return data.map((item: any) => ({
        id: item.id,
        jobId: item.opportunity_id || item.jobId || '',
        jobTitle: item.job_title || item.jobTitle || 'Opportunity',
        companyId: item.company_id || item.companyId || 'comp_1',
        companyName: item.company_name || item.companyName || 'Company',
        studentId: item.student_id || item.studentId || '',
        studentName: item.student_name || item.studentName || 'Student Candidate',
        studentEmail: item.student_email || item.studentEmail || '',
        studentAvatar: item.student_avatar || item.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        studentCollege: item.student_college || item.studentCollege || 'National Institute of Technology',
        studentDepartment: item.student_department || item.studentDepartment || 'Computer Science & Engineering',
        studentGpa: Number(item.student_gpa || item.studentGpa || 8.8),
        studentSkills: item.student_skills || item.studentSkills || ['TypeScript', 'React', 'Node.js'],
        status: (item.status as any) || 'Applied',
        aiMatchScore: item.match_score ?? item.aiMatchScore ?? 85,
        recruiterNotes: item.notes || item.recruiterNotes || '',
        interviewDate: item.interview_date || item.interviewDate,
        appliedDate: item.applied_at || item.appliedDate || new Date().toISOString(),
      })) as Application[];
    } catch (err) {
      console.warn('Supabase getApplications network error:', err);
      return null;
    }
  },

  /**
   * Submit an application
   */
  async createApplication(app: Partial<Application>): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: app.id,
        opportunity_id: app.jobId,
        job_title: app.jobTitle,
        company_id: (app as any).companyId || 'comp_1',
        company_name: app.companyName,
        student_id: app.studentId,
        student_name: app.studentName,
        student_email: app.studentEmail,
        status: app.status || 'Applied',
        match_score: app.aiMatchScore || 85,
        notes: (app as any).notes || app.recruiterNotes || '',
        applied_at: app.appliedDate || new Date().toISOString(),
      };

      const { error } = await client.from('applications').insert(dbRow);
      if (error) {
        // Try direct camelCase fallback
        const { error: fbError } = await client.from('applications').insert(app);
        if (fbError) {
          console.warn('Supabase createApplication error:', fbError.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Supabase createApplication network error:', err);
      return false;
    }
  },

  /**
   * Update application status (shortlist, interview, offer, etc.)
   */
  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const { error } = await client
        .from('applications')
        .update({
          status,
          notes: notes !== undefined ? notes : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (error) {
        console.warn('Supabase updateApplicationStatus error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase updateApplicationStatus network error:', err);
      return false;
    }
  },

  /**
   * Sync student profile to Supabase
   */
  async syncStudentProfile(profile: StudentProfile): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: profile.id,
        user_id: profile.userId,
        name: profile.name,
        email: profile.email,
        department: profile.department,
        college: profile.college,
        degree: profile.degree,
        batch: profile.batch,
        cgpa: profile.cgpa || profile.gpa,
        headline: profile.headline,
        bio: profile.bio,
        phone: profile.phone,
        location: profile.location,
        industry_readiness_score: profile.industryReadinessScore || 0,
        ai_skill_score: profile.aiSkillScore || 0,
        skills: profile.skills || [],
        educations: profile.educations || [],
        experiences: profile.experiences || [],
        achievements: profile.achievements || [],
        certifications: profile.certifications || [],
        projects: profile.projects || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await client.from('student_profiles').upsert(dbRow);
      if (error) {
        console.warn('Supabase syncStudentProfile error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase syncStudentProfile network error:', err);
      return false;
    }
  },

  /**
   * Record Assessment Completion
   */
  async saveAssessment(session: SkillAssessmentSession, userId: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: `eval_${Date.now()}`,
        user_id: userId,
        skill_name: 'Core Technical & Industry Readiness',
        score: session.overallReadiness,
        badge: session.overallReadiness >= 85 ? 'Gold Master' : session.overallReadiness >= 70 ? 'Silver Practitioner' : 'Verified Associate',
        passed: session.overallReadiness >= 65,
        date: session.submittedAt || new Date().toISOString(),
      };
      const { error } = await client.from('assessments').upsert(dbRow);
      if (error) {
        console.warn('Supabase saveAssessment error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveAssessment network error:', err);
      return false;
    }
  },

  /**
   * Save Industry Mentorship Program
   */
  async saveMentorshipProgram(program: IndustryMentorshipProgram): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: program.id,
        program_title: program.programName,
        mentor_name: program.mentorName,
        mentor_role: program.mentorRole,
        mentor_avatar: program.mentorAvatar,
        domain: program.expertise,
        description: program.description,
        skills_covered: program.skillsCovered || [],
        duration: program.duration,
        max_mentees: program.maxStudents,
        enrolled_count: program.currentStudents || 0,
        status: program.status,
      };
      const { error } = await client.from('mentorship_programs').upsert(dbRow);
      if (error) {
        console.warn('Supabase saveMentorshipProgram error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveMentorshipProgram network error:', err);
      return false;
    }
  },

  /**
   * Save Workshop
   */
  async saveWorkshop(workshop: IndustryWorkshopItem): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    try {
      const dbRow = {
        id: workshop.id,
        title: workshop.title,
        trainer: workshop.speaker,
        trainer_role: workshop.speakerRole,
        domain: workshop.topic,
        description: workshop.description,
        date: workshop.date,
        time: workshop.time,
        duration: workshop.duration,
        mode: workshop.mode,
        skills_covered: workshop.skillsCovered || [],
        max_participants: workshop.registrationLimit,
        registered_count: workshop.registeredCount || 0,
        status: workshop.isPast ? 'Completed' : 'Upcoming',
      };
      const { error } = await client.from('workshops').upsert(dbRow);
      if (error) {
        console.warn('Supabase saveWorkshop error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveWorkshop network error:', err);
      return false;
    }
  },
};

