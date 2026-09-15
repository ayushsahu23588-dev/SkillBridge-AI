import { CandidateMatchResult } from '../types';

export interface MatcherCandidate {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  college?: string;
  department?: string;
  skills: string[] | { name: string; level?: string }[];
  topProjects?: { title: string; techStack?: string[]; description?: string }[];
  projects?: { title: string; techStack?: string[]; description?: string }[];
  certifications?: { title: string; issuer?: string; verified?: boolean }[];
  careerPreferences?: { targetRole?: string; workMode?: string };
  workPreferences?: { targetRole?: string; workMode?: string };
  softSkills?: string[];
  gpa?: number;
}

export interface MatcherOpportunity {
  id: string;
  title: string;
  type?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  description?: string;
}

/**
 * AI Candidate Matching Engine
 * Implements exact weighted formula:
 * - Required Skills (50%)
 * - Projects (15%)
 * - Career Alignment (15%)
 * - Certifications (10%)
 * - Soft Skills (10%)
 */
export function matchCandidate(
  student: MatcherCandidate,
  opportunity: MatcherOpportunity
): CandidateMatchResult {
  // Normalize candidate skills
  const candidateSkills: string[] = (student.skills || []).map((s) =>
    typeof s === 'string' ? s.toLowerCase() : s.name.toLowerCase()
  );

  const reqSkills = (opportunity.requiredSkills || []).map((s) => s.trim());
  const prefSkills = (opportunity.preferredSkills || []).map((s) => s.trim());

  // 1. Required Skills Score (Weight: 50%)
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  reqSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    const isMatched = candidateSkills.some(
      (cs) => cs.includes(sLower) || sLower.includes(cs)
    );
    if (isMatched) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchRatio = reqSkills.length > 0 ? matchingSkills.length / reqSkills.length : 0.85;
  // Also bonus for preferred skills
  let prefBonus = 0;
  prefSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    if (candidateSkills.some((cs) => cs.includes(sLower) || sLower.includes(cs))) {
      prefBonus += 0.05;
    }
  });

  const skillScore = Math.min(100, Math.round((skillMatchRatio + prefBonus) * 100));

  // 2. Projects Alignment Score (Weight: 15%)
  const projectsList = student.topProjects || student.projects || [];
  let projectMatchCount = 0;
  projectsList.forEach((proj) => {
    const projTech = (proj.techStack || []).map((t) => t.toLowerCase()).join(' ');
    const projDesc = (proj.description || '').toLowerCase() + ' ' + (proj.title || '').toLowerCase();
    const hasMatch = reqSkills.some((req) => {
      const r = req.toLowerCase();
      return projTech.includes(r) || projDesc.includes(r);
    });
    if (hasMatch) projectMatchCount++;
  });
  const projectAlignment = Math.min(
    100,
    Math.round(projectsList.length > 0 ? (projectMatchCount / Math.min(3, projectsList.length)) * 100 : 60)
  );

  // 3. Career Alignment Score (Weight: 15%)
  const targetRole = (
    student.careerPreferences?.targetRole ||
    student.workPreferences?.targetRole ||
    ''
  ).toLowerCase();
  const oppTitle = (opportunity.title || '').toLowerCase();
  let careerAlignment = 75;
  if (targetRole && oppTitle) {
    if (
      oppTitle.includes(targetRole) ||
      targetRole.includes(oppTitle) ||
      (targetRole.includes('engineer') && oppTitle.includes('engineer')) ||
      (targetRole.includes('developer') && oppTitle.includes('developer')) ||
      (targetRole.includes('ai') && oppTitle.includes('ai')) ||
      (targetRole.includes('data') && oppTitle.includes('data'))
    ) {
      careerAlignment = 95;
    } else {
      careerAlignment = 70;
    }
  }

  // 4. Certifications Score (Weight: 10%)
  const certs = student.certifications || [];
  const certsScore = certs.length >= 2 ? 95 : certs.length === 1 ? 80 : 60;

  // 5. Soft Skills Score (Weight: 10%)
  const softSkillsScore = student.softSkills && student.softSkills.length > 0 ? 90 : 85;

  // Total Weighted Match Percentage
  const matchPercentage = Math.round(
    skillScore * 0.5 +
    projectAlignment * 0.15 +
    careerAlignment * 0.15 +
    certsScore * 0.1 +
    softSkillsScore * 0.1
  );

  // Formulate clear, intelligent explanation
  const matchDesc =
    matchingSkills.length > 0
      ? `Demonstrates proven competency in ${matchingSkills.slice(0, 3).join(', ')}`
      : 'Has foundational computer science exposure';
  
  const projDesc =
    projectAlignment >= 75
      ? `with strong portfolio alignment across ${projectsList.length} relevant projects`
      : 'with developing project work in aligned technologies';

  const explanation = `${student.name} shows ${matchPercentage}% alignment for "${opportunity.title}". ${matchDesc} ${projDesc}.${
    missingSkills.length > 0 ? ` Development opportunity in ${missingSkills.slice(0, 2).join(', ')}.` : ' Full match on core prerequisites.'
  }`;

  return {
    matchPercentage: Math.min(99, Math.max(50, matchPercentage)),
    matchingSkills,
    missingSkills,
    projectAlignment,
    careerAlignment,
    explanation,
  };
}
