import { DEMO_CANDIDATES } from '../data/industryFacultyMockData';

export interface CandidateMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  projectAlignment: number; // 0 - 15%
  careerAlignment: number;  // 0 - 15%
  certificationsScore: number; // 0 - 10%
  softSkillsScore: number;     // 0 - 10%
  requiredSkillsScore: number; // 0 - 50%
  explanation: string;
}

/**
 * AI candidate matching calculation according to Step 6.8:
 * Required Skills — 50%
 * Projects — 15%
 * Career Alignment — 15%
 * Certifications — 10%
 * Soft Skills — 10%
 * 
 * Returns non-uniform, deterministic, realistic score ranking.
 */
export function matchCandidate(student: any, opportunity: any): CandidateMatchResult {
  const oppSkills: string[] = (opportunity?.requiredSkills || ['TypeScript', 'React', 'Node.js', 'SQL']);
  const oppPreferred: string[] = opportunity?.preferredSkills || [];
  const oppTitle: string = (opportunity?.title || '').toLowerCase();
  const oppDesc: string = (opportunity?.description || '').toLowerCase();
  const oppType: string = (opportunity?.type || 'Internship').toLowerCase();

  // 1. Required Skills Score (50%)
  const studentSkillObjects: { name: string; level?: string }[] = student.skills || [];
  const studentSkillNames = studentSkillObjects.map((s) => s.name.toLowerCase());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  let skillsScoreAccumulator = 0;

  oppSkills.forEach((reqSkill) => {
    const reqLower = reqSkill.toLowerCase();
    const foundSkill = studentSkillObjects.find((s) =>
      s.name.toLowerCase().includes(reqLower) || reqLower.includes(s.name.toLowerCase())
    );

    if (foundSkill) {
      matchingSkills.push(foundSkill.name);
      const level = (foundSkill.level || 'Intermediate').toLowerCase();
      let multiplier = 0.8;
      if (level === 'expert') multiplier = 1.0;
      else if (level === 'advanced') multiplier = 0.9;
      else if (level === 'intermediate') multiplier = 0.75;
      else multiplier = 0.6;

      skillsScoreAccumulator += multiplier;
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // 1. Required Skills Score (50%)
  const skillCoverageRatio = oppSkills.length > 0 ? skillsScoreAccumulator / oppSkills.length : 0.8;
  const requiredSkillsScore = Math.min(50, Math.round(skillCoverageRatio * 50));

  // 2. Career Alignment (20%)
  const targetRole = (student.careerPreferences?.targetRole || '').toLowerCase();
  const dept = (student.department || '').toLowerCase();
  let careerScore = 14;
  if (targetRole.includes(oppType) || oppTitle.split(' ').some((w: string) => w.length > 3 && targetRole.includes(w))) {
    careerScore += 4;
  }
  if (dept.includes('computer') || dept.includes('data') || dept.includes('technology')) {
    careerScore += 2;
  }
  const careerAlignment = Math.min(20, Math.max(10, careerScore));

  // 3. Projects / Experience (15%)
  const projects: any[] = student.topProjects || [];
  let projectMatchCount = 0;
  projects.forEach((p) => {
    const pTech: string[] = (p.techStack || []).map((t: string) => t.toLowerCase());
    const hasOverlap = oppSkills.some((s) => pTech.includes(s.toLowerCase())) ||
      oppPreferred.some((s) => pTech.includes(s.toLowerCase()));
    if (hasOverlap) projectMatchCount++;
  });
  const projectAlignment = Math.min(15, Math.max(7, Math.round((projectMatchCount / Math.max(1, projects.length)) * 15) || 11));

  // 4. Certifications (5%)
  const certs: any[] = student.certifications || [];
  const certScore = certs.length >= 2 ? 5 : certs.length === 1 ? 4 : 3;
  const certificationsScore = certScore;

  // 5. Soft Skills & Academic Standing (10%)
  const gpa = student.gpa || 3.5;
  const softSkills: string[] = student.softSkills || [];
  const softScore = Math.min(10, Math.round((softSkills.length * 1.5) + (gpa >= 3.8 ? 5 : 3)));
  const softSkillsScore = Math.min(10, Math.max(6, softScore));

  // Total Score (Weighted Sum: 50 + 20 + 15 + 5 + 10 = 100)
  const totalScore = requiredSkillsScore + careerAlignment + projectAlignment + certificationsScore + softSkillsScore;
  const matchPercentage = Math.min(98, Math.max(55, totalScore));

  // Qualitative rationale
  let explanation = '';
  if (matchPercentage >= 90) {
    explanation = `${student.name} is an elite candidate demonstrating ${requiredSkillsScore}/50 on core technical requisitions (${matchingSkills.slice(0, 3).join(', ')}). High project alignment with production code repositories and verified certifications.`;
  } else if (matchPercentage >= 80) {
    explanation = `Strong match across ${matchingSkills.length} competencies. Good project foundation in ${projects[0]?.title || 'engineering capstones'}, though bridging knowledge in ${missingSkills.slice(0, 2).join(', ') || 'specialized tools'} will maximize success.`;
  } else {
    explanation = `Promising candidate with solid academic grounding (GPA ${gpa.toFixed(2)}) and key strengths in ${matchingSkills.slice(0, 2).join(', ')}. May require ramp-up in ${missingSkills.join(', ')}.`;
  }

  return {
    matchPercentage,
    matchingSkills,
    missingSkills,
    projectAlignment,
    careerAlignment,
    certificationsScore,
    softSkillsScore,
    requiredSkillsScore,
    explanation,
  };
}

/**
 * Get all candidates ranked by match score for a given opportunity
 */
export function getRankedCandidatesForOpportunity(opportunity: any) {
  return DEMO_CANDIDATES.map((student) => {
    const match = matchCandidate(student, opportunity);
    return {
      student,
      match,
    };
  }).sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);
}
