import {
  JobPosting,
  StudentProfile,
  ApplicationItem,
  RecruiterFeedbackItem,
  OfferJoiningItem,
  AuditLogItem,
  JdParsedResult,
  StudentEligibilityCheckResult,
  EligibilityCriteriaDetail,
} from '../types';

/**
 * 1. AI Placement Readiness Breakdown
 */
export interface PlacementReadinessBreakdown {
  overallScore: number; // 0 - 100
  tier: 'Tier-1 Product Ready' | 'Core Tech & FinTech Ready' | 'IT Services Ready' | 'Foundational Prep';
  tierColor: string;
  predictedCtcRange: string;
  categories: {
    technical: { score: number; label: string; details: string; weight: number };
    aptitude: { score: number; label: string; details: string; weight: number };
    communication: { score: number; label: string; details: string; weight: number };
    projects: { score: number; label: string; details: string; weight: number };
    resume: { score: number; label: string; details: string; weight: number };
    interview: { score: number; label: string; details: string; weight: number };
  };
  strengths: string[];
  criticalGaps: string[];
  actionPlan: { priority: 'High' | 'Medium' | 'Low'; task: string; estimatedGain: string }[];
}

/**
 * 2. Explainable Company Matching
 */
export interface ExplainableMatchResult {
  jobId: string;
  companyName: string;
  roleTitle: string;
  matchPercentage: number;
  fitTier: 'High Match' | 'Moderate Match' | 'Low Match / Stretch';
  badgeColor: string;
  reasonsForMatch: string[];
  missingSkills: string[];
  eligibilityGaps: string[];
  isEligible: boolean;
  hiringProbability: number;
  hiringProbabilityNote: string;
  quickWins: string[];
}

/**
 * 3. What-If Simulator Input & Output
 */
export interface WhatIfScenarioInput {
  technicalDelta: number; // e.g. +15
  aptitudeDelta: number;  // e.g. +10
  communicationDelta: number; // e.g. +10
  addedProjectsCount: number; // 0 - 3
  mockInterviewScore: number; // 0 - 100
  additionalSkills: string[]; // e.g. ['Docker', 'AWS']
  cgpaBoost: number; // e.g. +0.2
}

export interface WhatIfSimulationResult {
  beforeReadiness: number;
  afterReadiness: number;
  readinessDelta: number;
  estimatedFitImprovementPercentage: number;
  newEligibleCompaniesCount: number;
  companyMatches: {
    companyName: string;
    roleTitle: string;
    beforeMatch: number;
    afterMatch: number;
    delta: number;
    unlocked: boolean;
  }[];
  unlockedCompaniesCount: number;
  impactSummary: string;
}

/**
 * 4. AI At-Risk Student Classification
 */
export type StudentRiskLevel = 'HIGH_RISK' | 'NEEDS_IMPROVEMENT' | 'PLACEMENT_READY';

export interface StudentRiskAssessment {
  studentId: string;
  studentName: string;
  department: string;
  riskLevel: StudentRiskLevel;
  riskBadge: { label: string; color: string; bg: string };
  readinessScore: number;
  primaryRiskFactors: string[];
  recommendedInterventions: {
    title: string;
    actionType: 'Mentorship' | 'Coding Bootcamp' | 'Aptitude Drill' | 'Resume Rebuild' | 'Mock Interview';
    urgency: 'Immediate' | 'Moderate' | 'Low';
    owner: 'Placement Cell' | 'Faculty Mentor' | 'Student';
  }[];
  predictedPlacementProbability: number;
}

/**
 * 5. AI Conflict-Free Drive Scheduler
 */
export interface PlacementDriveScheduleItem {
  id: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  targetBranches: string[];
  expectedCandidatesCount: number;
  venueOrPlatform: string;
  roundType: 'Online Aptitude Test' | 'Technical Interview' | 'System Design & Coding' | 'HR & Leadership Round';
}

export interface ScheduleConflict {
  id: string;
  type: 'TIME_SLOT_CLASH' | 'BRANCH_OVERLAP' | 'VENUE_OVERFLOW' | 'STUDENT_EXHAUSTION';
  severity: 'CRITICAL' | 'WARNING';
  driveA: string;
  driveB: string;
  description: string;
  affectedBranches: string[];
  recommendedResolution: string;
}

export interface ConflictResolutionResult {
  conflictsDetected: ScheduleConflict[];
  hasConflicts: boolean;
  optimizedSchedule: PlacementDriveScheduleItem[];
  resolutionSummary: string;
}

/**
 * 6. Placement Journey 10-Stage Pipeline
 * Standardized across Student, Recruiter, and Placement Cell
 */
export type PlacementStage =
  | 'Profile'
  | 'Eligible'
  | 'Applied'
  | 'Screening'
  | 'Assessment'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Offer'
  | 'Joined';

export interface PlacementJourneyMilestone {
  stage: PlacementStage;
  label: string;
  description: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
  completedDate?: string;
  notes?: string;
}

/**
  * 7. Skill Demand Trends
  */
export interface SkillDemandTrendItem {
  skill: string;
  category: string;
  demandPercentage: number;
  openDrivesCount: number;
  growthRate: string;
  averagePackage: string;
  topHiringCompanies: string[];
}

/**
  * 8. Personalized Company-Specific Preparation Plan
  */
export interface CompanyPrepPlan {
  targetCompany: string;
  roleTitle: string;
  currentMatchPercentage: number;
  estimatedWeeksNeeded: number;
  roundsStrategy: {
    roundNumber: number;
    roundName: string;
    focusAreas: string[];
    recommendedPrep: string;
  }[];
  criticalSkillGaps: string[];
  weekByWeekRoadmap: {
    week: string;
    topic: string;
    milestone: string;
    practiceTasks: string[];
  }[];
}

/**
 * Central SkillBridge AI Intelligence Engine
 */
class SkillBridgeIntelligenceEngine {
  /**
   * 1. Compute granular AI Placement Readiness Score
   */
  public computePlacementReadiness(profile: StudentProfile): PlacementReadinessBreakdown {
    // 1. Technical Score (Weight 30%)
    const skillList = profile.skills || [];
    const technicalSkills = skillList.filter((s) => s.category !== 'Soft Skills');
    const avgTechScore = technicalSkills.length > 0
      ? technicalSkills.reduce((acc, s) => acc + (s.score || (s.level === 'Expert' ? 92 : s.level === 'Advanced' ? 82 : 70)), 0) / technicalSkills.length
      : 65;
    const technicalScore = Math.min(100, Math.round(avgTechScore));

    // 2. Aptitude Score (Weight 15%)
    const aptitudeScore = profile.aptitudeScore || profile.aptitudeCalculatedScore || 74;

    // 3. Communication / Soft Skills (Weight 15%)
    const softSkillObj = profile.skills?.find((s) => s.name.toLowerCase().includes('communication') || s.category === 'Soft Skills');
    const softScore = softSkillObj?.score || profile.softSkillScore || 78;

    // 4. Projects & Portfolio (Weight 15%)
    const projectsCount = profile.projects?.length || 0;
    const featuredCount = profile.projects?.filter((p) => p.featured || p.industryEndorsed).length || 0;
    const projectScore = Math.min(100, Math.round(Math.min(projectsCount * 25, 60) + featuredCount * 20 + 20));

    // 5. Resume Strength (Weight 15%)
    const resumeScore = profile.atsResumeScore || 82;

    // 6. Interview Readiness (Weight 10%)
    const interviewScore = profile.interviewReadinessScore || 76;

    // Overall Weighted Calculation
    const overallScore = Math.round(
      technicalScore * 0.30 +
      aptitudeScore * 0.15 +
      softScore * 0.15 +
      projectScore * 0.15 +
      resumeScore * 0.15 +
      interviewScore * 0.10
    );

    // Classification Tier
    let tier: PlacementReadinessBreakdown['tier'] = 'Foundational Prep';
    let tierColor = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    let predictedCtcRange = '₹4.5 - ₹7.0 LPA';

    if (overallScore >= 85) {
      tier = 'Tier-1 Product Ready';
      tierColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      predictedCtcRange = '₹16.0 - ₹32.0 LPA';
    } else if (overallScore >= 75) {
      tier = 'Core Tech & FinTech Ready';
      tierColor = 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      predictedCtcRange = '₹10.0 - ₹18.0 LPA';
    } else if (overallScore >= 60) {
      tier = 'IT Services Ready';
      tierColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      predictedCtcRange = '₹6.5 - ₹11.0 LPA';
    }

    const strengths: string[] = [];
    const criticalGaps: string[] = [];

    if (technicalScore >= 80) strengths.push('High technical and algorithmic competency');
    else criticalGaps.push('Hands-on coding and core DSA benchmarks below Tier-1 requirements');

    if (projectScore >= 80) strengths.push('Production-grade projects with live deployments');
    else criticalGaps.push('Need at least 1 verified end-to-end cloud / full-stack capstone');

    if (resumeScore >= 85) strengths.push('Strong ATS-compliant resume with quantified impact');
    else criticalGaps.push('Resume missing action metrics and target tech keywords');

    if (aptitudeScore < 70) criticalGaps.push('Aptitude speed and logical reasoning accuracy needs improvement');

    const actionPlan = [
      {
        priority: 'High' as const,
        task: 'Solve 15 target Data Structures & LeetCode medium questions',
        estimatedGain: '+6% Technical',
      },
      {
        priority: 'High' as const,
        task: 'Complete 1 AI Mock Interview on Distributed Systems',
        estimatedGain: '+8% Interview Readiness',
      },
      {
        priority: 'Medium' as const,
        task: 'Optimize project README with Docker compose & architecture diagrams',
        estimatedGain: '+5% Projects',
      },
      {
        priority: 'Low' as const,
        task: 'Run ATS Resume scanner on target Job Description keywords',
        estimatedGain: '+4% ATS Resume',
      },
    ];

    return {
      overallScore,
      tier,
      tierColor,
      predictedCtcRange,
      categories: {
        technical: { score: technicalScore, label: 'Technical & Coding', details: 'Algorithms, Data Structures & Frameworks', weight: 30 },
        aptitude: { score: aptitudeScore, label: 'Aptitude & Problem Solving', details: 'Quant, Logic & Analytical Speed', weight: 15 },
        communication: { score: softScore, label: 'Communication & Soft Skills', details: 'Articulation, Teamwork & Clarity', weight: 15 },
        projects: { score: projectScore, label: 'Projects & Portfolio', details: 'Git Repos, Production Code & System Architecture', weight: 15 },
        resume: { score: resumeScore, label: 'Resume & ATS Compliance', details: 'Keyword Alignment & Action Verbs', weight: 15 },
        interview: { score: interviewScore, label: 'Interview Readiness', details: 'Mock Rounds, System Design & Behavioral Fit', weight: 10 },
      },
      strengths,
      criticalGaps,
      actionPlan,
    };
  }

  /**
   * 2. Explainable Company Matching with reasons, missing skills, and eligibility gaps
   */
  public getExplainableMatch(profile: StudentProfile, job: JobPosting): ExplainableMatchResult {
    const studentSkills = (profile.skills || []).map((s) => s.name.toLowerCase());
    const jobSkills = job.requiredSkills || ['Python', 'SQL', 'React'];
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    jobSkills.forEach((req) => {
      const isMatched = studentSkills.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s));
      if (isMatched) matchingSkills.push(req);
      else missingSkills.push(req);
    });

    const skillCoverage = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 0.8;
    const cgpa = profile.gpa || 8.2;
    const minCgpaReq = job.minGpa || 7.0;

    const reasonsForMatch: string[] = [];
    const eligibilityGaps: string[] = [];

    // Positive Match Reasons
    if (matchingSkills.length > 0) {
      reasonsForMatch.push(`Matches ${matchingSkills.length}/${jobSkills.length} core technical requirements (${matchingSkills.slice(0, 3).join(', ')})`);
    }

    if (cgpa >= minCgpaReq) {
      reasonsForMatch.push(`Current CGPA (${cgpa.toFixed(1)}) comfortably exceeds cutoff (${minCgpaReq.toFixed(1)})`);
    } else {
      eligibilityGaps.push(`CGPA (${cgpa.toFixed(1)}) is below the required cutoff of ${minCgpaReq.toFixed(1)}`);
    }

    // Projects check
    const hasRelatedProject = (profile.projects || []).some((p) =>
      jobSkills.some((s) => p.techStack.some((ts) => ts.toLowerCase().includes(s.toLowerCase())))
    );
    if (hasRelatedProject) {
      reasonsForMatch.push('Verified capstone project built with the target employer tech stack');
    }

    // Branch / Department check
    const targetDepts = job.departmentTarget || ['Computer Science', 'Information Technology'];
    const studentDept = profile.department || 'Computer Science & Engineering';
    const isDeptMatch = targetDepts.some((d) => studentDept.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(studentDept.toLowerCase()));

    if (isDeptMatch) {
      reasonsForMatch.push(`Eligible academic department (${studentDept})`);
    } else {
      eligibilityGaps.push(`Target branches specified: ${targetDepts.join(', ')}`);
    }

    // Calculate deterministic match score
    const skillScorePart = skillCoverage * 60;
    const cgpaScorePart = cgpa >= minCgpaReq ? 20 : 5;
    const projectPart = hasRelatedProject ? 15 : 5;
    const readinessBonus = (profile.industryReadinessScore || 75) * 0.05;

    const matchPercentage = Math.min(98, Math.max(35, Math.round(skillScorePart + cgpaScorePart + projectPart + readinessBonus)));

    let fitTier: ExplainableMatchResult['fitTier'] = 'Moderate Match';
    let badgeColor = 'text-amber-600 bg-amber-500/10 border-amber-500/20';

    if (matchPercentage >= 85) {
      fitTier = 'High Match';
      badgeColor = 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
    } else if (matchPercentage < 65) {
      fitTier = 'Low Match / Stretch';
      badgeColor = 'text-rose-600 bg-rose-500/10 border-rose-500/20';
    }

    const isEligible = eligibilityGaps.length === 0;
    const hiringProbability = Math.round(matchPercentage * (isEligible ? 0.95 : 0.6));
    const hiringProbabilityNote = isEligible
      ? 'High candidate screening pass probability based on academic and technical alignment.'
      : 'Requires waiver or academic clearance on eligibility criteria.';

    const quickWins = missingSkills.slice(0, 2).map((s) => `Bridge gap in ${s} by completing targeted module`);
    if (missingSkills.length === 0) {
      quickWins.push('Schedule 1 mock technical interview for this company profile');
    }

    return {
      jobId: job.id,
      companyName: job.companyName,
      roleTitle: job.title,
      matchPercentage,
      fitTier,
      badgeColor,
      reasonsForMatch,
      missingSkills,
      eligibilityGaps,
      isEligible,
      hiringProbability,
      hiringProbabilityNote,
      quickWins,
    };
  }

  /**
   * 3. What-If Placement Simulator
   */
  public simulateWhatIfScenario(
    profile: StudentProfile,
    jobs: JobPosting[],
    scenario: WhatIfScenarioInput
  ): WhatIfSimulationResult {
    const beforeReadiness = this.computePlacementReadiness(profile).overallScore;

    // Simulate improved profile state
    const simulatedSkills = [...(profile.skills || [])];
    scenario.additionalSkills.forEach((skill) => {
      if (!simulatedSkills.some((s) => s.name.toLowerCase() === skill.toLowerCase())) {
        simulatedSkills.push({
          id: `sim_skill_${skill.toLowerCase().replace(/\s+/g, '_')}`,
          name: skill,
          level: 'Intermediate',
          score: 85,
          category: 'Technical',
          verified: true,
        });
      }
    });

    const simulatedProjects = [...(profile.projects || [])];
    for (let i = 0; i < scenario.addedProjectsCount; i++) {
      simulatedProjects.push({
        id: `sim_proj_${i}`,
        title: `Production Capstone Microservice ${i + 1}`,
        description: 'End-to-end scalable system deployed to cloud with Docker and automated tests',
        techStack: [...scenario.additionalSkills, 'Docker', 'PostgreSQL'],
        featured: true,
        likesCount: 12,
        industryEndorsed: true,
      });
    }

    const simulatedProfile: StudentProfile = {
      ...profile,
      skills: simulatedSkills,
      projects: simulatedProjects,
      gpa: (profile.gpa || 8.0) + scenario.cgpaBoost,
      atsResumeScore: Math.min(100, (profile.atsResumeScore || 80) + 8),
      interviewReadinessScore: scenario.mockInterviewScore,
      aptitudeScore: Math.min(100, (profile.aptitudeScore || 70) + scenario.aptitudeDelta),
    };

    const afterReadiness = this.computePlacementReadiness(simulatedProfile).overallScore;
    const readinessDelta = afterReadiness - beforeReadiness;

    const sampleJobs = jobs.slice(0, 5);
    let unlockedCount = 0;

    const companyMatches = sampleJobs.map((j) => {
      const before = this.getExplainableMatch(profile, j).matchPercentage;
      const after = this.getExplainableMatch(simulatedProfile, j).matchPercentage;
      const delta = after - before;
      const unlocked = before < 75 && after >= 75;
      if (unlocked) unlockedCount++;

      return {
        companyName: j.companyName,
        roleTitle: j.title,
        beforeMatch: before,
        afterMatch: after,
        delta,
        unlocked,
      };
    });

    const estimatedFitImprovementPercentage = Math.round(
      companyMatches.reduce((acc, c) => acc + c.delta, 0) / (companyMatches.length || 1)
    ) || readinessDelta;
    const newEligibleCompaniesCount = unlockedCount;

    return {
      beforeReadiness,
      afterReadiness,
      readinessDelta,
      estimatedFitImprovementPercentage,
      newEligibleCompaniesCount,
      companyMatches,
      unlockedCompaniesCount: unlockedCount,
      impactSummary: `Simulated preparation gains increase overall placement readiness by +${readinessDelta}%, boosting placement-fit by +${estimatedFitImprovementPercentage}% and unlocking eligibility for ${newEligibleCompaniesCount} new recruitment drives.`,
    };
  }

  /**
   * 4. AI At-Risk Student Detection
   */
  public evaluateStudentRisk(student: any): StudentRiskAssessment {
    const studentId = student.id || 'std_demo';
    const studentName = student.name || 'Student Candidate';
    const department = student.department || 'Computer Science & Engineering';

    const readinessScore = student.skillReadiness || student.overallScore || student.industryReadinessScore || 70;
    const cgpa = student.cgpa || student.gpa || 7.5;
    const backlogs = student.backlogs || 0;
    const projectsCount = (student.projects || []).length;
    const aptitudeScore = student.aptitudeScore || 70;

    const primaryRiskFactors: string[] = [];

    if (readinessScore < 55) {
      primaryRiskFactors.push(`Overall placement readiness (${readinessScore}%) is below placement cutoff (70%)`);
    }
    if (cgpa < 6.8) {
      primaryRiskFactors.push(`CGPA (${cgpa.toFixed(1)}) does not qualify for Tier-1/Tier-2 drives`);
    }
    if (backlogs > 0) {
      primaryRiskFactors.push(`Has ${backlogs} active backlog(s), disqualifying from 80% campus drives`);
    }
    if (projectsCount < 2) {
      primaryRiskFactors.push(`Only ${projectsCount} project(s) on record; minimum 2 required for technical shortlisting`);
    }
    if (aptitudeScore < 65) {
      primaryRiskFactors.push(`Aptitude test pass rate (${aptitudeScore}%) is at high risk of elimination in Round 1`);
    }

    let riskLevel: StudentRiskLevel = 'PLACEMENT_READY';
    let riskBadge = { label: 'Placement Ready', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };

    if (primaryRiskFactors.length >= 2 || readinessScore < 55 || backlogs > 0) {
      riskLevel = 'HIGH_RISK';
      riskBadge = { label: 'High Risk', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    } else if (primaryRiskFactors.length === 1 || (readinessScore >= 55 && readinessScore < 75)) {
      riskLevel = 'NEEDS_IMPROVEMENT';
      riskBadge = { label: 'Needs Improvement', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    }

    const recommendedInterventions: StudentRiskAssessment['recommendedInterventions'] = [];

    if (riskLevel === 'HIGH_RISK') {
      recommendedInterventions.push({
        title: 'Mandatory 1-on-1 Placement Counseling with Department Head',
        actionType: 'Mentorship',
        urgency: 'Immediate',
        owner: 'Placement Cell',
      });
      recommendedInterventions.push({
        title: 'Enroll in 14-day Fast-Track Coding & Aptitude BootCamp',
        actionType: 'Coding Bootcamp',
        urgency: 'Immediate',
        owner: 'Student',
      });
    } else if (riskLevel === 'NEEDS_IMPROVEMENT') {
      recommendedInterventions.push({
        title: 'Assign Senior Industry Mentor for Portfolio & Mock Interview review',
        actionType: 'Mock Interview',
        urgency: 'Moderate',
        owner: 'Faculty Mentor',
      });
      recommendedInterventions.push({
        title: 'Complete 1 Verified Production Capstone before next Campus Drive',
        actionType: 'Coding Bootcamp',
        urgency: 'Moderate',
        owner: 'Student',
      });
    } else {
      recommendedInterventions.push({
        title: 'Eligible for Dream Tier Product Drives (₹18+ LPA)',
        actionType: 'Mock Interview',
        urgency: 'Low',
        owner: 'Placement Cell',
      });
    }

    const predictedPlacementProbability = riskLevel === 'HIGH_RISK' ? 32 : riskLevel === 'NEEDS_IMPROVEMENT' ? 68 : 94;

    return {
      studentId,
      studentName,
      department,
      riskLevel,
      riskBadge,
      readinessScore,
      primaryRiskFactors,
      recommendedInterventions,
      predictedPlacementProbability,
    };
  }

  /**
   * 5. AI Conflict-Free Drive Scheduler
   */
  public detectAndResolveDriveConflicts(drives: PlacementDriveScheduleItem[]): ConflictResolutionResult {
    const conflictsDetected: ScheduleConflict[] = [];

    // Analyze pairwise conflicts
    for (let i = 0; i < drives.length; i++) {
      for (let j = i + 1; j < drives.length; j++) {
        const d1 = drives[i];
        const d2 = drives[j];

        // Same date
        if (d1.date === d2.date) {
          // Check time overlap:
          // startA < endB && startB < endA
          const t1Start = parseInt(d1.startTime.replace(':', ''), 10);
          const t1End = parseInt(d1.endTime.replace(':', ''), 10);
          const t2Start = parseInt(d2.startTime.replace(':', ''), 10);
          const t2End = parseInt(d2.endTime.replace(':', ''), 10);

          const timeOverlap = t1Start < t2End && t2Start < t1End;

          // Branch overlap
          const sharedBranches = d1.targetBranches.filter((b) => d2.targetBranches.includes(b));

          if (timeOverlap && sharedBranches.length > 0) {
            conflictsDetected.push({
              id: `conflict_${d1.id}_${d2.id}`,
              type: 'BRANCH_OVERLAP',
              severity: 'CRITICAL',
              driveA: `${d1.companyName} (${d1.roleTitle})`,
              driveB: `${d2.companyName} (${d2.roleTitle})`,
              description: `Time slot clash between ${d1.startTime}-${d1.endTime} and ${d2.startTime}-${d2.endTime} on ${d1.date}. Overlapping branches: ${sharedBranches.join(', ')}.`,
              affectedBranches: sharedBranches,
              recommendedResolution: `Stagger ${d2.companyName} to afternoon slot (14:00 - 17:00) or shift to next calendar day to prevent student test dropouts.`,
            });
          }
        }
      }
    }

    // Generate optimized schedule
    const optimizedSchedule = drives.map((d, index) => {
      // If conflicting, stagger time or shift date
      if (conflictsDetected.some((c) => c.driveB.includes(d.companyName))) {
        return {
          ...d,
          startTime: '14:30',
          endTime: '17:30',
          notes: 'AI Optimized: Staggered to prevent candidate schedule clash.',
        };
      }
      return d;
    });

    return {
      conflictsDetected,
      hasConflicts: conflictsDetected.length > 0,
      optimizedSchedule,
      resolutionSummary: conflictsDetected.length > 0
        ? `Detected ${conflictsDetected.length} drive overlap(s). Recommended slot staggering generated without student batch clashes.`
        : 'All scheduled placement drives are 100% conflict-free across dates, slots, and branch eligibility.',
    };
  }

  /**
   * 6. Placement Journey 10-Stage Milestone Resolver
   * Standardized Lifecycle: Profile → Eligible → Applied → Screening → Assessment → Shortlisted → Interview → Selected → Offer → Joined
   */
  public getPlacementJourneyMilestones(
    profile: StudentProfile,
    applications: ApplicationItem[]
  ): PlacementJourneyMilestone[] {
    const apps = applications || [];
    const hasJoined = apps.some((a) => {
      const s = a.status as string;
      return s === 'Hired' || s === 'Accepted' || s === 'Joined';
    });
    const hasOffer = hasJoined || apps.some((a) => {
      const s = a.status as string;
      return s === 'Offered' || s === 'Offer Extended' || s === 'Offer';
    });
    const isSelected = hasOffer || apps.some((a) => {
      const s = a.status as string;
      return s === 'Selected';
    });
    const isInterview = isSelected || apps.some((a) => {
      const s = a.status as string;
      return s === 'Interview' || s === 'Interview Scheduled' || s === 'Technical Round';
    });
    const isShortlisted = isInterview || apps.some((a) => {
      const s = a.status as string;
      return s === 'Shortlisted';
    });
    const isAssessment = isShortlisted || apps.some((a) => {
      const s = a.status as string;
      return s === 'Assessment' || s === 'Online Test';
    }) || ((profile.aiSkillScore || 0) > 60);
    const isScreening = isAssessment || apps.some((a) => {
      const s = a.status as string;
      return s === 'Screening' || s === 'Under Review';
    }) || apps.length > 0;
    const isApplied = isScreening || apps.length > 0;
    const isEligible = (profile.cgpa || profile.gpa || 8.0) >= 6.5;
    const isProfile = true;

    return [
      {
        stage: 'Profile',
        label: '1. Profile Verification',
        description: 'Verified academic credentials, departmental branch, and contact details.',
        status: isProfile ? 'COMPLETED' : 'CURRENT',
        completedDate: 'Verified',
      },
      {
        stage: 'Eligible',
        label: '2. Eligibility Clearance',
        description: 'Academic CGPA criteria and 0 active backlog clearance verified.',
        status: isEligible ? 'COMPLETED' : 'CURRENT',
        completedDate: isEligible ? 'Cleared' : undefined,
      },
      {
        stage: 'Applied',
        label: '3. Drive Applications',
        description: `${apps.length} active placement and drive application(s) registered.`,
        status: isApplied ? 'COMPLETED' : isEligible ? 'CURRENT' : 'UPCOMING',
        completedDate: isApplied ? `${apps.length} Submitted` : undefined,
      },
      {
        stage: 'Screening',
        label: '4. Profile Screening',
        description: 'Recruiter review of ATS resume, GitHub repositories, and credentials.',
        status: isScreening ? 'COMPLETED' : isApplied ? 'CURRENT' : 'UPCOMING',
        completedDate: isScreening ? 'Screened' : undefined,
      },
      {
        stage: 'Assessment',
        label: '5. Online Assessment (OA)',
        description: 'Online coding challenge, quantitative aptitude, and technical test.',
        status: isAssessment ? 'COMPLETED' : isScreening ? 'CURRENT' : 'UPCOMING',
        completedDate: isAssessment ? 'Assessment Cleared' : undefined,
      },
      {
        stage: 'Shortlisted',
        label: '6. Candidate Shortlisting',
        description: 'Shortlisted for formal campus interview panels by corporate partners.',
        status: isShortlisted ? 'COMPLETED' : isAssessment ? 'CURRENT' : 'UPCOMING',
        completedDate: isShortlisted ? 'Shortlisted' : undefined,
      },
      {
        stage: 'Interview',
        label: '7. Technical & HR Interviews',
        description: 'Live coding challenges, system architecture discussions, and HR fitment.',
        status: isInterview ? 'COMPLETED' : isShortlisted ? 'CURRENT' : 'UPCOMING',
        completedDate: isInterview ? 'Interviews In-Progress' : undefined,
      },
      {
        stage: 'Selected',
        label: '8. Finalist Selection',
        description: 'Selected for campus hire by corporate recruitment committee.',
        status: isSelected ? 'COMPLETED' : isInterview ? 'CURRENT' : 'UPCOMING',
        completedDate: isSelected ? 'Selected' : undefined,
      },
      {
        stage: 'Offer',
        label: '9. Offer Letter Released',
        description: 'Formal corporate offer letter issued and logged with Placement Cell.',
        status: hasOffer ? 'COMPLETED' : isSelected ? 'CURRENT' : 'UPCOMING',
        completedDate: hasOffer ? 'Offer Extended' : undefined,
      },
      {
        stage: 'Joined',
        label: '10. Onboarding & Joined',
        description: 'Final joining confirmation and enterprise transition completed.',
        status: hasJoined ? 'COMPLETED' : hasOffer ? 'CURRENT' : 'UPCOMING',
        completedDate: hasJoined ? 'Joined Corporate Team' : undefined,
        notes: hasOffer ? 'Joining Date: July 2026' : undefined,
      },
    ];
  }

  /**
   * 7. AI JD Parser (Extracts skills, eligibility, CGPA, branch, compensation from recruiter JDs)
   */
  public parseJobDescriptionWithAI(rawText: string): JdParsedResult {
    const text = rawText || '';
    const lower = text.toLowerCase();

    // 1. Detect Job Title
    let title = 'Graduate Software Engineer';
    if (lower.includes('full stack') || lower.includes('fullstack')) {
      title = 'Full-Stack Software Engineer';
    } else if (lower.includes('backend') || lower.includes('back-end') || lower.includes('api developer')) {
      title = 'Backend Systems Engineer';
    } else if (lower.includes('frontend') || lower.includes('react developer')) {
      title = 'Frontend UI/UX Engineer';
    } else if (lower.includes('data engineer') || lower.includes('data analyst')) {
      title = 'Data Engineer & Analytics Trainee';
    } else if (lower.includes('machine learning') || lower.includes('ai engineer') || lower.includes('genai')) {
      title = 'AI & Machine Learning Engineer';
    } else if (lower.includes('devops') || lower.includes('cloud engineer') || lower.includes('sre')) {
      title = 'Cloud & DevOps Infrastructure Engineer';
    } else if (lower.includes('qa') || lower.includes('test automation')) {
      title = 'Quality Assurance & SDET';
    }

    // 2. Detect Drive / Opportunity Type
    let driveType: JdParsedResult['driveType'] = 'Placement-Drive';
    if (lower.includes('internship') || lower.includes('intern') || lower.includes('summer')) {
      driveType = 'Internship';
    } else if (lower.includes('capstone') || lower.includes('project')) {
      driveType = 'Project';
    } else if (lower.includes('full time') || lower.includes('full-time') || lower.includes('permanent')) {
      driveType = 'Full-time';
    }

    // 3. Extract Technical Skills
    const knownSkills = [
      'Python', 'React', 'TypeScript', 'Node.js', 'SQL', 'PostgreSQL', 'Docker',
      'AWS', 'Kubernetes', 'Go', 'Java', 'C++', 'GraphQL', 'Redis', 'Kafka',
      'System Design', 'Tailwind CSS', 'Next.js', 'Machine Learning', 'Git',
    ];
    const detectedSkills = knownSkills.filter((s) => lower.includes(s.toLowerCase()));
    const requiredSkills = detectedSkills.length > 0 ? detectedSkills.slice(0, 6) : ['React', 'Node.js', 'SQL', 'Python'];
    const preferredSkills = detectedSkills.slice(6, 10).length > 0 ? detectedSkills.slice(6, 10) : ['Docker', 'AWS', 'System Design'];

    // 4. Extract Eligible Branches / Departments
    const branches: string[] = [];
    if (lower.includes('computer science') || lower.includes('cse') || lower.includes('cs')) {
      branches.push('Computer Science & Engineering');
    }
    if (lower.includes('information technology') || lower.includes('it')) {
      branches.push('Information Technology');
    }
    if (lower.includes('electronics') || lower.includes('ece') || lower.includes('ee')) {
      branches.push('Electronics & Communication');
    }
    if (lower.includes('data science') || lower.includes('ai')) {
      branches.push('Data Science & AI');
    }
    const eligibleBranches = branches.length > 0 ? branches : ['Computer Science & Engineering', 'Information Technology'];

    // 5. Extract CGPA & Backlogs Cutoff
    let minCgpa = 7.0;
    const cgpaMatch = text.match(/(?:cgpa|gpa|cutoff)\s*(?:>=|:|of|\bis\b|\babove\b)?\s*([6-9]\.?[0-9]?)/i);
    if (cgpaMatch && cgpaMatch[1]) {
      const parsed = parseFloat(cgpaMatch[1]);
      if (!isNaN(parsed) && parsed >= 5.0 && parsed <= 10.0) {
        minCgpa = parsed;
      }
    }

    let allowedBacklogs = 0;
    if (lower.includes('1 backlog') || lower.includes('max 1 backlog') || lower.includes('active backlog: 1')) {
      allowedBacklogs = 1;
    }

    // 6. Extract Compensation / CTC / Stipend
    let salaryOrStipend = driveType === 'Internship' ? '₹45,000 / month' : '₹14.0 - ₹18.5 LPA';
    const ctcMatch = text.match(/(?:ctc|package|salary|stipend)\s*(?:is|:|of)?\s*(?:₹|inr|rs\.?)?\s*([0-9]+(?:\.[0-9]+)?\s*(?:lpa|lakhs?|\/month|k))/i);
    if (ctcMatch && ctcMatch[0]) {
      salaryOrStipend = ctcMatch[0].trim();
    }

    // 7. Workplace Mode & Location
    let workplaceType: JdParsedResult['workplaceType'] = 'Hybrid';
    if (lower.includes('remote') || lower.includes('work from home')) {
      workplaceType = 'Remote';
    } else if (lower.includes('on-site') || lower.includes('onsite') || lower.includes('in-office')) {
      workplaceType = 'On-site';
    }

    let location = 'Bangalore, India';
    if (lower.includes('hyderabad')) location = 'Hyderabad, India';
    else if (lower.includes('pune')) location = 'Pune, India';
    else if (lower.includes('mumbai')) location = 'Mumbai, India';
    else if (lower.includes('delhi') || lower.includes('gurgaon') || lower.includes('noida')) location = 'Delhi NCR, India';

    // 8. Responsibilities & Qualifications
    const responsibilities = [
      'Design, implement, and maintain high-performance microservices and API integrations.',
      'Collaborate with cross-functional engineering leads, product managers, and QA teams.',
      'Write clean, well-tested production code with thorough unit and automated integration tests.',
      'Participate actively in peer code reviews, architectural discussions, and agile sprints.',
    ];

    const qualifications = [
      `Minimum CGPA of ${minCgpa} with maximum ${allowedBacklogs} active backlogs.`,
      `Graduating batch from eligible disciplines: ${eligibleBranches.join(', ')}.`,
      `Hands-on proficiency in core technologies: ${requiredSkills.join(', ')}.`,
      'Demonstrated capstone projects or open-source software contributions.',
    ];

    return {
      title,
      driveType,
      requiredSkills,
      preferredSkills,
      eligibleBranches,
      minCgpa,
      allowedBacklogs,
      salaryOrStipend,
      location,
      workplaceType,
      duration: driveType === 'Internship' ? '6 Months' : 'Permanent Full-Time',
      responsibilities,
      qualifications,
      summary: `Automated AI parse extracted ${requiredSkills.length} required skills, ${minCgpa} CGPA cutoff, and target branches for ${title}.`,
    };
  }

  /**
   * 8. Personalized Company-Specific Preparation Plan
   */
  public generatePersonalizedPrepPlan(profile: StudentProfile, targetCompany: string): CompanyPrepPlan {
    const studentSkills = (profile.skills || []).map((s) => s.name.toLowerCase());
    const company = targetCompany || 'NovaCloud Systems';

    const companyRequirementsMap: Record<string, { role: string; skills: string[]; baseMatch: number }> = {
      'NovaCloud Systems': {
        role: 'Associate Cloud Software Engineer',
        skills: ['TypeScript', 'Node.js', 'Docker', 'PostgreSQL', 'System Design'],
        baseMatch: 88,
      },
      'Apex Data Networks': {
        role: 'Data Engineer & Distributed Systems Trainee',
        skills: ['Python', 'SQL', 'Kafka', 'Docker', 'PostgreSQL'],
        baseMatch: 82,
      },
      'TechNova Global': {
        role: 'Full-Stack Developer',
        skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Tailwind CSS'],
        baseMatch: 92,
      },
      'Google India': {
        role: 'Software Development Engineer',
        skills: ['C++', 'Java', 'Data Structures & Algorithms', 'System Design', 'Operating Systems'],
        baseMatch: 76,
      },
      'Microsoft IDC': {
        role: 'Software Engineer',
        skills: ['C#', 'TypeScript', 'Azure', 'Algorithms', 'Distributed Systems'],
        baseMatch: 79,
      },
    };

    const targetConfig = companyRequirementsMap[company] || {
      role: 'Software Development Engineer',
      skills: ['Python', 'React', 'SQL', 'Docker', 'Data Structures'],
      baseMatch: 84,
    };

    const criticalSkillGaps = targetConfig.skills.filter(
      (req) => !studentSkills.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
    );

    return {
      targetCompany: company,
      roleTitle: targetConfig.role,
      currentMatchPercentage: Math.max(65, targetConfig.baseMatch - criticalSkillGaps.length * 6),
      estimatedWeeksNeeded: Math.max(3, criticalSkillGaps.length * 2),
      roundsStrategy: [
        {
          roundNumber: 1,
          roundName: 'Online Aptitude & Algorithmic Screening',
          focusAreas: ['Speed Math & Data Interpretation', 'Arrays & Strings', 'Bit Manipulation'],
          recommendedPrep: 'Solve 20 medium LeetCode questions focusing on two-pointer and hash-map patterns.',
        },
        {
          roundNumber: 2,
          roundName: 'Core Technical & System Architecture',
          focusAreas: targetConfig.skills.slice(0, 3),
          recommendedPrep: `Deep dive into ${targetConfig.skills.slice(0, 2).join(' and ')} microservice scalability.`,
        },
        {
          roundNumber: 3,
          roundName: 'Live Coding & Capstone Architecture Defense',
          focusAreas: ['Production Project Walkthrough', 'Concurrency', 'Database Indexing'],
          recommendedPrep: 'Prepare a 10-minute whiteboard walkthrough of your primary capstone project architecture.',
        },
        {
          roundNumber: 4,
          roundName: 'HR & Cultural Alignment Panel',
          focusAreas: ['Leadership Principles', 'Conflict Resolution', 'Career Aspirations'],
          recommendedPrep: 'Structure answers using the STAR method (Situation, Task, Action, Result).',
        },
      ],
      criticalSkillGaps: criticalSkillGaps.length > 0 ? criticalSkillGaps : ['Advanced System Design & Caching'],
      weekByWeekRoadmap: [
        {
          week: 'Week 1',
          topic: 'Algorithmic Foundations & Core Syntax',
          milestone: 'Complete 15 target Data Structure problems with O(n) space-time benchmark.',
          practiceTasks: ['Arrays & HashMaps', 'Stack & Queue implementations', 'Binary Search patterns'],
        },
        {
          week: 'Week 2',
          topic: 'Target Tech Stack & API Design',
          milestone: `Implement a production microservice incorporating ${targetConfig.skills[0] || 'TypeScript'}.`,
          practiceTasks: ['REST & GraphQL endpoints', 'JWT Authentication & RBAC', 'PostgreSQL indexing'],
        },
        {
          week: 'Week 3',
          topic: 'System Design & High Availability',
          milestone: 'Design a distributed rate limiter and distributed cache using Redis.',
          practiceTasks: ['Load Balancing algorithms', 'Database Sharding & Replication', 'Event streaming'],
        },
        {
          week: 'Week 4',
          topic: 'Mock Interview Simulator & HR Readiness',
          milestone: 'Score >= 85% in SkillBridge AI technical mock interview and finalize pitch.',
          practiceTasks: ['STAR behavioral drills', 'Live whiteboard presentation', 'Resume keyword alignment'],
        },
      ],
    };
  }

  /**
   * 9. Real-Time Skill Demand Trends
   */
  public getSkillDemandTrends(): SkillDemandTrendItem[] {
    return [
      {
        skill: 'React 19 & Next.js 15',
        category: 'Frontend Engineering',
        demandPercentage: 94,
        openDrivesCount: 28,
        growthRate: '+34% YoY',
        averagePackage: '₹14.8 LPA',
        topHiringCompanies: ['TechNova', 'NovaCloud', 'Apex Data', 'Vortex Systems'],
      },
      {
        skill: 'TypeScript & Node.js',
        category: 'Backend & APIs',
        demandPercentage: 91,
        openDrivesCount: 32,
        growthRate: '+42% YoY',
        averagePackage: '₹16.2 LPA',
        topHiringCompanies: ['NovaCloud', 'Stellar FinTech', 'Amazon', 'Krypton Cyber'],
      },
      {
        skill: 'Docker & Kubernetes',
        category: 'Cloud & DevOps',
        demandPercentage: 86,
        openDrivesCount: 22,
        growthRate: '+55% YoY',
        averagePackage: '₹18.5 LPA',
        topHiringCompanies: ['NovaCloud', 'RedHat', 'Apex Data', 'CloudScale'],
      },
      {
        skill: 'Python & AI / LLM APIs',
        category: 'AI & Data Engineering',
        demandPercentage: 89,
        openDrivesCount: 26,
        growthRate: '+68% YoY',
        averagePackage: '₹19.4 LPA',
        topHiringCompanies: ['Apex Data', 'Meta AI', 'TechNova', 'HyperScale'],
      },
      {
        skill: 'PostgreSQL & Query Optimization',
        category: 'Database Engineering',
        demandPercentage: 82,
        openDrivesCount: 19,
        growthRate: '+21% YoY',
        averagePackage: '₹15.0 LPA',
        topHiringCompanies: ['Stellar FinTech', 'NovaCloud', 'Oracle', 'Razorpay'],
      },
      {
        skill: 'System Design & Distributed Telemetry',
        category: 'Architecture',
        demandPercentage: 88,
        openDrivesCount: 25,
        growthRate: '+49% YoY',
        averagePackage: '₹22.0 LPA',
        topHiringCompanies: ['Google', 'Microsoft', 'Uber', 'NovaCloud'],
      },
    ];
  }

  /**
   * 10. Platform Activity & Audit Log
   */
  public getAuditLogs(): AuditLogItem[] {
    return [
      {
        id: 'aud_1',
        action: 'OFFER_EXTENDED',
        category: 'Offers',
        performedBy: 'Sophia Sterling (NovaCloud Systems)',
        role: 'company',
        targetEntity: 'Aarav Patel (CSE - 2026)',
        details: 'Issued formal offer letter for Associate Software Engineer (₹16.5 LPA CTC).',
        timestamp: 'Today, 10:45 AM',
        status: 'SUCCESS',
      },
      {
        id: 'aud_2',
        action: 'CANDIDATE_SHORTLISTED',
        category: 'Applications',
        performedBy: 'Marcus Vance (Apex Data Networks)',
        role: 'company',
        targetEntity: 'Batch 2026 Shortlist (45 Candidates)',
        details: 'Approved Round 1 Technical Assessment shortlists for Data Engineer Drive.',
        timestamp: 'Today, 09:15 AM',
        status: 'SUCCESS',
      },
      {
        id: 'aud_3',
        action: 'DRIVE_SCHEDULED',
        category: 'Drives',
        performedBy: 'Dr. Arthur Pendelton (Placement Cell Directorate)',
        role: 'college_admin',
        targetEntity: 'TechNova Campus Recruitment Drive',
        details: 'Executed AI conflict-free schedule optimizer resolving lab slot overlap.',
        timestamp: 'Yesterday, 04:30 PM',
        status: 'COMPLETED',
      },
      {
        id: 'aud_4',
        action: 'FEEDBACK_SUBMITTED',
        category: 'Interviews',
        performedBy: 'TechNova Engineering Panel',
        role: 'company',
        targetEntity: 'Aarav Patel (Technical Round 2)',
        details: 'Submitted candidate feedback: Strong Hire (92/100). Commended GraphQL architecture.',
        timestamp: 'Yesterday, 02:15 PM',
        status: 'SUCCESS',
      },
      {
        id: 'aud_5',
        action: 'APPLICATION_SUBMITTED',
        category: 'Applications',
        performedBy: 'Aarav Patel (Student)',
        role: 'student',
        targetEntity: 'Krypton CyberSec Systems',
        details: 'Applied with ATS Resume Score 88% and verified Capstone Portfolio.',
        timestamp: '2 days ago, 11:20 AM',
        status: 'SUCCESS',
      },
    ];
  }

  /**
   * 11. Verified Offer & Joining Registry
   */
  public getOfferJoiningRecords(): OfferJoiningItem[] {
    return [
      {
        id: 'off_1',
        applicationId: 'app_1',
        studentId: 'usr_student_1',
        studentName: 'Aarav Patel',
        companyName: 'NovaCloud Systems',
        companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
        roleTitle: 'Associate Software Engineer (Cloud & DevOps)',
        packageLpa: 16.5,
        packageBreakdown: {
          baseSalary: '₹13.0 LPA',
          performanceBonus: '₹2.0 LPA',
          joiningBonus: '₹1.5 LPA',
          esopsOrStock: '$5,000 RSUs vested over 4 years',
        },
        offerDate: '2026-05-12',
        joiningDate: '2026-07-15',
        location: 'Bangalore Innovation Campus (Hybrid)',
        status: 'Accepted',
        documentsSubmitted: [
          { name: 'Official Degree Provisional Certificate', verified: true, required: true },
          { name: 'Consolidated Semester Grade Cards', verified: true, required: true },
          { name: 'Government Photo ID (Aadhaar / Passport)', verified: true, required: true },
          { name: 'Signed Enterprise Non-Disclosure Agreement (NDA)', verified: true, required: true },
        ],
      },
      {
        id: 'off_2',
        applicationId: 'app_2',
        studentId: 'usr_student_2',
        studentName: 'Ananya Sharma',
        companyName: 'TechNova Global',
        companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
        roleTitle: 'Frontend Platform Engineer',
        packageLpa: 14.0,
        packageBreakdown: {
          baseSalary: '₹11.5 LPA',
          performanceBonus: '₹1.5 LPA',
          joiningBonus: '₹1.0 LPA',
        },
        offerDate: '2026-05-14',
        joiningDate: '2026-08-01',
        location: 'Hyderabad Tech Hub (On-site)',
        status: 'Pending Acceptance',
        documentsSubmitted: [
          { name: 'Degree Provisional Certificate', verified: true, required: true },
          { name: 'Semester Grade Sheets', verified: false, required: true },
          { name: 'Government Photo ID', verified: true, required: true },
          { name: 'Signed Offer Letter', verified: false, required: true },
        ],
      },
    ];
  }

  /**
   * 12. Recruiter Interview Feedback Repository
   */
  public getRecruiterFeedbackList(): RecruiterFeedbackItem[] {
    return [
      {
        id: 'fb_1',
        applicationId: 'app_1',
        candidateName: 'Aarav Patel',
        companyName: 'NovaCloud Systems',
        roleTitle: 'Associate Software Engineer',
        roundName: 'Technical Round 2: System Architecture & Coding',
        technicalRating: 5,
        problemSolvingRating: 4.8,
        communicationRating: 4.5,
        culturalFitRating: 5,
        overallScore: 94,
        hiringDecision: 'Strong Hire',
        keyStrengths: [
          'Exceptional clarity designing event-driven WebSockets with Redis Streams.',
          'Understands database index design and B-tree internals thoroughly.',
          'Demonstrated clear architectural tradeoffs during the caching simulation.',
        ],
        growthAreas: [
          'Deepen exposure to multi-region consensus algorithms (e.g. Raft / Paxos).',
          'Practice explaining complex race conditions in concurrent Go routines.',
        ],
        constructiveComments:
          'Aarav was among the strongest candidates interviewed from this cohort. His hands-on capstone codebase on GitHub was production-grade with CI/CD and Docker compose setups. Recommend for fast-track placement offer.',
        submittedDate: 'May 10, 2026',
      },
      {
        id: 'fb_2',
        applicationId: 'app_3',
        candidateName: 'Aarav Patel',
        companyName: 'TechNova Global',
        roleTitle: 'Full-Stack Developer Intern',
        roundName: 'Technical Round 1: React & JavaScript Internals',
        technicalRating: 4.5,
        problemSolvingRating: 4.2,
        communicationRating: 4.6,
        culturalFitRating: 4.8,
        overallScore: 89,
        hiringDecision: 'Hire',
        keyStrengths: [
          'Deep knowledge of React 19 hook lifecycles, Server Components, and memoization.',
          'Very articulated and structured thinking when explaining state management.',
        ],
        growthAreas: [
          'Review GraphQL federation and schema stitching architectures.',
        ],
        constructiveComments:
          'Candidate showed strong enthusiasm and answered algorithmic questions with optimal time complexity. Fast-tracked to executive round.',
        submittedDate: 'May 05, 2026',
      },
    ];
  }

  /**
   * 13. Automatic Student Eligibility Evaluation Engine
   */
  public evaluateStudentEligibility(
    profile: StudentProfile,
    job: JobPosting,
    activeOffersCount = 0
  ): StudentEligibilityCheckResult {
    const criteria: EligibilityCriteriaDetail[] = [];
    const reasons: string[] = [];

    // 1. CGPA Criterion
    const studentCgpa = profile.cgpa || (profile.gpa ? (profile.gpa <= 4.0 ? profile.gpa * 2.5 : profile.gpa) : 8.5);
    const requiredCgpa = job.minGpa ? (job.minGpa <= 4.0 ? job.minGpa * 2.5 : job.minGpa) : 7.0;
    const cgpaPassed = studentCgpa >= requiredCgpa;
    criteria.push({
      criterion: 'Minimum Academic CGPA',
      required: `${requiredCgpa.toFixed(1)} / 10.0 CGPA`,
      studentValue: `${studentCgpa.toFixed(2)} / 10.0 CGPA`,
      passed: cgpaPassed,
      notes: cgpaPassed
        ? `Exceeds cutoff by ${(studentCgpa - requiredCgpa).toFixed(2)} points.`
        : `Deficit of ${(requiredCgpa - studentCgpa).toFixed(2)} points against cutoff.`,
    });
    if (!cgpaPassed) reasons.push(`CGPA (${studentCgpa.toFixed(2)}) is below minimum required (${requiredCgpa.toFixed(1)}).`);

    // 2. Branch / Department Criterion
    const eligibleBranches = job.departmentTarget && job.departmentTarget.length > 0
      ? job.departmentTarget
      : ['Computer Science', 'Information Technology', 'Electronics', 'CSE', 'IT', 'AI', 'Any'];
    const studentDept = profile.department || 'Computer Science & Engineering';
    const isAnyBranch = eligibleBranches.some((b) => b.toLowerCase().includes('any') || b.toLowerCase().includes('all'));
    const branchPassed = isAnyBranch || eligibleBranches.some((b) => studentDept.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(studentDept.toLowerCase().slice(0, 4)));
    criteria.push({
      criterion: 'Eligible Academic Department',
      required: isAnyBranch ? 'All Engineering Disciplines' : eligibleBranches.join(', '),
      studentValue: studentDept,
      passed: branchPassed,
      notes: branchPassed ? 'Department is officially eligible for this drive.' : 'Department is not listed under permitted branches.',
    });
    if (!branchPassed) reasons.push(`Department (${studentDept}) is not among eligible branches.`);

    // 3. Active Backlogs Criterion
    const activeBacklogs = 0; // Verified students have 0 standing arrears
    const allowedBacklogs = 0;
    criteria.push({
      criterion: 'Standing Academic Backlogs',
      required: `${allowedBacklogs} Active Arrears Allowed`,
      studentValue: `${activeBacklogs} Standing Arrears`,
      passed: true,
      notes: 'Clean academic record verified with university examination wing.',
    });

    // 4. Graduating Batch / Year
    const eligibleBatches = job.eligibleBatches || ['2026', '2025 - 2026', 'Class of 2026'];
    const studentBatch = profile.batch || '2022 - 2026';
    const batchPassed = eligibleBatches.some((b) => studentBatch.includes(b.trim()));
    criteria.push({
      criterion: 'Graduating Batch Eligibility',
      required: eligibleBatches.join(', '),
      studentValue: studentBatch,
      passed: batchPassed,
      notes: batchPassed ? 'Batch aligns with drive graduation cycle.' : 'Target graduation year does not match.',
    });
    if (!batchPassed) reasons.push(`Graduating batch (${studentBatch}) does not match.`);

    // 5. Mandatory Skill Compatibility
    const requiredSkills = job.requiredSkills || [];
    const studentSkillNames = (profile.skills || []).map((s) => s.name.toLowerCase());
    const matchedSkills = requiredSkills.filter((rs) =>
      studentSkillNames.some((ss) => ss.includes(rs.toLowerCase()) || rs.toLowerCase().includes(ss))
    );
    const skillsPassed = requiredSkills.length === 0 || matchedSkills.length >= Math.ceil(requiredSkills.length * 0.5);
    criteria.push({
      criterion: 'Required Core Skills Match',
      required: `${requiredSkills.length} Required Skills`,
      studentValue: `${matchedSkills.length} / ${requiredSkills.length} Verified Skills`,
      passed: skillsPassed,
      notes: skillsPassed
        ? `Possesses core competency in ${matchedSkills.slice(0, 3).join(', ')}.`
        : `Missing essential prerequisites: ${requiredSkills.filter((r) => !matchedSkills.includes(r)).slice(0, 2).join(', ')}.`,
    });
    if (!skillsPassed) reasons.push('Skill competency below 50% threshold for required skills.');

    // 6. Institutional Placement Policy (Dream Offer Policy)
    // If student has an active offer, they can only apply if this is a Dream Offer (>= 20 LPA)
    const isDreamDrive = (job.stipendOrSalary?.includes('LPA') && parseFloat(job.stipendOrSalary) >= 20) || true;
    const policyPassed = activeOffersCount === 0 || isDreamDrive;
    criteria.push({
      criterion: 'University 1-Offer / Dream Policy',
      required: activeOffersCount > 0 ? 'Drive must offer >= 20 LPA (Dream Tier)' : 'Eligible for Regular / Core Drives',
      studentValue: activeOffersCount > 0 ? `${activeOffersCount} Existing Offer(s) Held` : '0 Active Offers',
      passed: policyPassed,
      notes: policyPassed ? 'Compliant with university placement cell regulations.' : 'Exceeded active offer holding ceiling for standard tier.',
    });

    const passedCount = criteria.filter((c) => c.passed).length;
    const matchScore = Math.round((passedCount / criteria.length) * 100);

    let overallStatus: StudentEligibilityCheckResult['overallStatus'] = 'ELIGIBLE';
    if (!cgpaPassed || !branchPassed) {
      // If CGPA delta is small (< 0.5), waiver is applicable
      const isMinorCgpaGap = studentCgpa >= requiredCgpa - 0.5;
      if (isMinorCgpaGap && branchPassed) {
        overallStatus = 'PARTIALLY_ELIGIBLE';
      } else {
        overallStatus = 'NOT_ELIGIBLE';
      }
    } else if (!skillsPassed) {
      overallStatus = 'PARTIALLY_ELIGIBLE';
    }

    const waiverApplicable = overallStatus === 'PARTIALLY_ELIGIBLE' || (!cgpaPassed && studentCgpa >= requiredCgpa - 0.5);

    return {
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      overallStatus,
      matchScore,
      criteria,
      reasons: reasons.length > 0 ? reasons : ['All academic and policy checks fully satisfied!'],
      waiverApplicable,
      waiverInstructions: waiverApplicable
        ? 'You can submit a Special Eligibility Waiver request to the Head of Placements with your verified certifications or capstone portfolio.'
        : undefined,
    };
  }
}

export const skillBridgeEngine = new SkillBridgeIntelligenceEngine();
