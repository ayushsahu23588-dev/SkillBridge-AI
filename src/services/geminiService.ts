/**
 * Centralized Gemini AI Service for SkillBridge AI
 * Provides all high-level AI intelligence functions across Student, Faculty, Industry, Institution, and Admin portals.
 * Seamlessly manages:
 * - Direct Gemini API proxy requests through /api/ai/*
 * - Automatic deterministic fallback through aiFallbackService when in Demo AI Mode or on network failure
 * - Result caching through aiCacheService
 * - Preference toggles (AI assistance, personalization, chat history)
 */

import { StudentProfile, JobPosting, User } from '../types';
import { aiCacheService } from './aiCacheService';
import { aiContextService } from './aiContextService';
import {
  aiFallbackService,
  AiSkillAnalysisData,
  SkillGapExplanationData,
  CareerRecommendationExplanation,
  PersonalizedRoadmapItem,
  OpportunityMatchData,
  OpportunityPrepPlan,
  PortfolioReviewData,
  ResumeGuidanceData,
  InterviewQuestionItem,
  InterviewAnswerFeedback,
  FinalInterviewReadiness,
  NaturalLanguageSearchResult,
} from './aiFallbackService';
import { checkAiHealth } from '../config/ai';

async function executeAiRequest<T>(
  endpoint: string,
  payload: any,
  fallbackFn: () => T,
  cacheKey?: string,
  cacheTtlMinutes = 30
): Promise<T> {
  // 1. Check local cache
  if (cacheKey) {
    const cached = aiCacheService.getCache<T>(cacheKey);
    if (cached) return cached;
  }

  // 2. Check user preference
  const prefs = aiCacheService.getPreferences();
  if (prefs.aiMode === 'demo') {
    const fallbackResult = fallbackFn();
    if (cacheKey) aiCacheService.setCache(cacheKey, fallbackResult, cacheTtlMinutes);
    return fallbackResult;
  }

  // 3. Check health & Gemini connectivity
  const health = await checkAiHealth();
  if (!health.geminiConfigured || health.mode === 'demo') {
    const fallbackResult = fallbackFn();
    if (cacheKey) aiCacheService.setCache(cacheKey, fallbackResult, cacheTtlMinutes);
    return fallbackResult;
  }

  // 4. Attempt server-side Gemini request
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(`/api/ai${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.result || data.data || data.output)) {
        const output = data.result || data.data || data.output;
        if (cacheKey) aiCacheService.setCache(cacheKey, output, cacheTtlMinutes);
        return output;
      }
    }
  } catch (err) {
    console.warn(`[SkillBridge AI] Remote AI request to ${endpoint} failed, seamlessly falling back to deterministic intelligence:`, err);
  }

  // 5. Fallback on any error or empty response
  const fallbackResult = fallbackFn();
  if (cacheKey) aiCacheService.setCache(cacheKey, fallbackResult, cacheTtlMinutes);
  return fallbackResult;
}

export const geminiService = {
  // -------------------------------------------------------------
  // Student Intelligence
  // -------------------------------------------------------------

  /**
   * Generates comprehensive AI Skill Analysis for student assessment
   */
  async generateSkillAnalysis(
    profile: StudentProfile,
    techSkills?: Record<string, number>,
    careerInterests: string[] = ['Backend Developer', 'Software Developer']
  ): Promise<AiSkillAnalysisData> {
    const cacheKey = `skill_analysis_${profile.id}_${careerInterests.join('_')}`;
    const context = aiContextService.buildStudentContext(profile, undefined, careerInterests[0]);

    return executeAiRequest(
      '/skill-analysis',
      { context, techSkills, careerInterests },
      () => aiFallbackService.generateSkillAnalysis(profile, techSkills, careerInterests),
      cacheKey,
      60
    );
  },

  /**
   * Explains why a specific skill gap is critical to industry
   */
  async generateSkillGapExplanation(
    skillName: string,
    currentLevel: number,
    targetLevel: number,
    targetRole = 'Backend Developer'
  ): Promise<SkillGapExplanationData> {
    const cacheKey = `skill_gap_${skillName}_${currentLevel}_${targetLevel}_${targetRole}`;

    return executeAiRequest(
      '/skill-gap-explain',
      { skillName, currentLevel, targetLevel, targetRole },
      () => aiFallbackService.generateSkillGapExplanation(skillName, currentLevel, targetLevel, targetRole),
      cacheKey,
      120
    );
  },

  /**
   * Generates career recommendations with detailed explanations
   */
  async generateCareerRecommendations(
    studentSkills: { name: string; level: string; verifiedScore?: number }[] = []
  ): Promise<CareerRecommendationExplanation[]> {
    const cacheKey = `career_recs_${studentSkills.map((s) => `${s.name}-${s.verifiedScore || 0}`).join('_')}`;

    return executeAiRequest(
      '/career-recs',
      { studentSkills },
      () => aiFallbackService.generateCareerRecommendations(studentSkills),
      cacheKey,
      60
    );
  },

  /**
   * Generates personalized 5-month learning roadmap
   */
  async generateLearningRoadmap(
    careerGoal: string,
    currentSkills: { name: string; verifiedScore?: number }[] = [],
    skillGaps: { skill: string; gap: number }[] = []
  ): Promise<PersonalizedRoadmapItem[]> {
    const cacheKey = `roadmap_${careerGoal}_${currentSkills.length}_${skillGaps.length}`;

    return executeAiRequest(
      '/personalized-roadmap',
      { careerGoal, currentSkills, skillGaps },
      () => aiFallbackService.generatePersonalizedRoadmap(careerGoal, currentSkills, skillGaps),
      cacheKey,
      60
    );
  },

  /**
   * Matches internship or job opportunity with student profile
   */
  async matchOpportunityWithAI(
    opportunity: JobPosting,
    profile: StudentProfile
  ): Promise<OpportunityMatchData> {
    const cacheKey = `match_${opportunity.id}_${profile.id}`;

    return executeAiRequest(
      '/opportunity-match',
      { opportunityId: opportunity.id, profileId: profile.id, opportunity, profile },
      () => aiFallbackService.matchOpportunity(opportunity, profile),
      cacheKey,
      30
    );
  },

  /**
   * Generates interview and technical preparation plan for an opportunity
   */
  async generateOpportunityPreparation(
    opportunity: JobPosting,
    profile: StudentProfile
  ): Promise<OpportunityPrepPlan> {
    const cacheKey = `prep_plan_${opportunity.id}_${profile.id}`;

    return executeAiRequest(
      '/opportunity-prep',
      { opportunity, profile },
      () => aiFallbackService.generateOpportunityPreparation(opportunity, profile),
      cacheKey,
      60
    );
  },

  /**
   * Analyzes digital portfolio and generates actionable recommendations
   */
  async improvePortfolio(profile: StudentProfile): Promise<PortfolioReviewData> {
    const cacheKey = `portfolio_review_${profile.id}_${profile.projects?.length || 0}`;

    return executeAiRequest(
      '/portfolio-improve',
      { profile },
      () => aiFallbackService.improvePortfolio(profile),
      cacheKey,
      60
    );
  },

  /**
   * Generates ATS and professional wording guidance for student resumes
   */
  async generateResumeGuidance(
    profile: StudentProfile,
    targetOpportunity?: JobPosting
  ): Promise<ResumeGuidanceData> {
    const cacheKey = `resume_guidance_${profile.id}_${targetOpportunity?.id || 'general'}`;

    return executeAiRequest(
      '/resume-guidance',
      { profile, targetOpportunity },
      () => aiFallbackService.generateResumeGuidance(profile, targetOpportunity),
      cacheKey,
      60
    );
  },

  // -------------------------------------------------------------
  // AI Interview Prep Studio
  // -------------------------------------------------------------

  /**
   * Generates 10 structured interview questions by role, difficulty, and type
   */
  async generateInterviewQuestions(
    role = 'Software Developer',
    difficulty = 'Intermediate',
    interviewType = 'Mixed'
  ): Promise<InterviewQuestionItem[]> {
    const cacheKey = `interview_q_${role}_${difficulty}_${interviewType}`;

    return executeAiRequest(
      '/interview-questions',
      { role, difficulty, interviewType },
      () => aiFallbackService.generateInterviewQuestions(role, difficulty, interviewType),
      cacheKey,
      60
    );
  },

  /**
   * Evaluates student's answer for correctness, technical depth, and clarity
   */
  async generateInterviewFeedback(
    question: string,
    answer: string,
    idealKeyPoints: string[] = []
  ): Promise<InterviewAnswerFeedback> {
    // Answer evaluations are dynamic, do not cache statically
    return executeAiRequest(
      '/interview-feedback',
      { question, answer, idealKeyPoints },
      () => aiFallbackService.evaluateInterviewAnswer(question, answer, idealKeyPoints)
    );
  },

  /**
   * Computes final interview readiness score and top improvements
   */
  calculateFinalInterviewReadiness(
    role: string,
    difficulty: string,
    type: string,
    answersCount: number
  ): FinalInterviewReadiness {
    return aiFallbackService.calculateFinalInterviewReadiness(role, difficulty, type, answersCount);
  },

  // -------------------------------------------------------------
  // Industry Portal Intelligence
  // -------------------------------------------------------------

  /**
   * Matches candidate for recruiters with matching points and advisory concerns
   */
  async matchCandidateWithAI(candidate: any, job: JobPosting) {
    const cacheKey = `cand_match_${candidate.id || candidate.name}_${job.id}`;

    return executeAiRequest(
      '/candidate-match',
      { candidate, job },
      () => aiFallbackService.matchCandidateWithAI(candidate, job),
      cacheKey,
      30
    );
  },

  /**
   * Generates complete job description from role parameters
   */
  async generateJobDescriptionWithAI(params: { title: string; department?: string; basicRequirements?: string }) {
    return executeAiRequest(
      '/industry-desc-gen',
      { ...params, type: 'job' },
      () => aiFallbackService.generateJobDescription(params)
    );
  },

  /**
   * Generates complete internship description from role parameters
   */
  async generateInternshipDescriptionWithAI(params: { title: string; department?: string; basicRequirements?: string }) {
    return executeAiRequest(
      '/industry-desc-gen',
      { ...params, type: 'internship' },
      () => aiFallbackService.generateInternshipDescription(params)
    );
  },

  // -------------------------------------------------------------
  // Faculty Portal Intelligence
  // -------------------------------------------------------------

  async generateFacultyCollaborationSuggestions(facultyProfile?: any) {
    const cacheKey = `faculty_collab_${facultyProfile?.id || 'main'}`;

    return executeAiRequest(
      '/faculty-advisor',
      { facultyProfile },
      () => aiFallbackService.generateFacultyCollaborationSuggestions(facultyProfile),
      cacheKey,
      60
    );
  },

  // -------------------------------------------------------------
  // Institution Portal Intelligence
  // -------------------------------------------------------------

  async generateInstitutionInsights() {
    const cacheKey = 'institution_insights_general';

    return executeAiRequest(
      '/institution-insights',
      {},
      () => aiFallbackService.generateInstitutionInsights(),
      cacheKey,
      60
    );
  },

  async generateTrainingRecommendations() {
    const cacheKey = 'training_recommendations_general';

    return executeAiRequest(
      '/training-recs',
      {},
      () => aiFallbackService.generateTrainingRecommendations(),
      cacheKey,
      60
    );
  },

  async generateIndustryDemandInsights() {
    const cacheKey = 'industry_demand_insights_general';

    return executeAiRequest(
      '/demand-insights',
      {},
      () => aiFallbackService.generateIndustryDemandInsights(),
      cacheKey,
      60
    );
  },

  // -------------------------------------------------------------
  // Admin Portal Intelligence
  // -------------------------------------------------------------

  async generateAdminPlatformInsights() {
    const cacheKey = 'admin_platform_insights_general';

    return executeAiRequest(
      '/admin-insights',
      {},
      () => aiFallbackService.generateAdminPlatformInsights(),
      cacheKey,
      60
    );
  },

  // -------------------------------------------------------------
  // Universal Conversational Assistant
  // -------------------------------------------------------------

  async askSkillBridgeAI(
    query: string,
    role: string,
    history: { role: 'user' | 'assistant'; content: string }[] = [],
    context?: any
  ): Promise<string> {
    return executeAiRequest(
      '/chat-unified',
      { message: query, role, history, context },
      () => aiFallbackService.askSkillBridgeAI(query, role, history, context)
    );
  },

  // -------------------------------------------------------------
  // Natural Language Platform Search
  // -------------------------------------------------------------

  searchPlatformWithAI(query: string, jobs: JobPosting[], students: any[] = []) {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        matchedJobs: jobs.slice(0, 4),
        matchedStudents: students.slice(0, 4),
        interpretation: 'Showing featured platform opportunities and top candidate profiles.',
      };
    }

    const matchedJobs = jobs.filter((j) => {
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchCompany = j.companyName.toLowerCase().includes(q);
      const matchSkill = (j.requiredSkills || []).some((s) => s.toLowerCase().includes(q));
      const matchDesc = j.description.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchSkill || matchDesc;
    });

    const matchedStudents = students.filter((s) => {
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchDept = (s.department || '').toLowerCase().includes(q);
      const matchSkill = ((s.skills || []) as any[]).some((sk) =>
        (typeof sk === 'string' ? sk : sk.name || '').toLowerCase().includes(q)
      );
      return matchName || matchDept || matchSkill;
    });

    let interpretation = `Found ${matchedJobs.length} opportunity matches and ${matchedStudents.length} candidate profiles for "${query}".`;
    if (q.includes('backend') || q.includes('python')) {
      interpretation = `Filtered for backend engineering listings prioritizing Python and relational database competencies.`;
    } else if (q.includes('dsa') || q.includes('gap')) {
      interpretation = `Identified platform tracks and candidates with Data Structures & Algorithms learning priorities.`;
    }

    return {
      matchedJobs,
      matchedStudents,
      interpretation,
    };
  },

  async parseNaturalLanguageSearch(query: string): Promise<NaturalLanguageSearchResult> {
    const cacheKey = `search_nl_${query.toLowerCase().trim()}`;
    return executeAiRequest(
      '/search-nl',
      { query },
      () => aiFallbackService.parseNaturalLanguageSearch(query),
      cacheKey,
      60
    );
  },
};
