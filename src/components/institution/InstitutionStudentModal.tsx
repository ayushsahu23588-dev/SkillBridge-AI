import React, { useState } from 'react';
import { InstitutionStudentItem } from '../../types';
import {
  X,
  Mail,
  GraduationCap,
  Award,
  Briefcase,
  TrendingUp,
  Target,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Github,
  ExternalLink,
  Star,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

interface InstitutionStudentModalProps {
  student: InstitutionStudentItem | null;
  onClose: () => void;
  onUpdateStudent?: (id: string, updates: Partial<InstitutionStudentItem>) => void;
}

export const InstitutionStudentModal: React.FC<InstitutionStudentModalProps> = ({
  student,
  onClose,
  onUpdateStudent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'roadmap' | 'projects' | 'applications'
  >('overview');

  if (!student) return null;

  const rollNumber = student.rollNumber || student.id;
  const semester = student.semester || '6';
  const cgpaValue = student.cgpa !== undefined ? student.cgpa : (student.gpa || 8.4);
  const overallSkillScore = student.overallSkillScore !== undefined ? student.overallSkillScore : (student.skillReadiness || 85);
  const readinessLevel = student.readinessLevel || 'Industry Ready';
  const roleName = typeof student.careerGoal === 'object' ? (student.careerGoal?.role || 'Full Stack Engineer') : (student.careerGoal || 'Full Stack Engineer');
  const roleFit = typeof student.careerGoal === 'object' ? (student.careerGoal?.readinessPercent || student.skillReadiness || 85) : (student.skillReadiness || 85);
  const targetCompanyType = typeof student.careerGoal === 'object' ? (student.careerGoal?.targetCompanyType || 'Tier-1 Tech Product') : (student.targetCompanyType || 'Tier-1 Tech Product');

  const assessmentHistory = Array.isArray(student.skillAssessmentHistory) && student.skillAssessmentHistory.length > 0
    ? student.skillAssessmentHistory
    : [
        { date: student.assessmentResult?.lastTaken || '2025-02-15', score: student.assessmentResult?.overallScore || 84, role: roleName },
      ];

  const topSkillsList = (student.topSkills || []).map((s: any) =>
    typeof s === 'string' ? { skill: s, score: overallSkillScore } : s
  );

  const skillGapsList = (student.skillGaps || []).map((gap: any) => ({
    ...gap,
    priority: gap.priority || 'High',
    current: gap.current !== undefined ? gap.current : (gap.studentScore || 65),
    required: gap.required !== undefined ? gap.required : (gap.industryDemand || 85),
    gap: gap.gap !== undefined ? gap.gap : 20,
  }));

  const roadmapPhases: any[] = Array.isArray(student.roadmapProgress)
    ? student.roadmapProgress
    : [
        { phaseNumber: 1, title: 'Core Computer Science & Architecture Foundations', status: 'Completed', month: 'Month 1', skills: ['Data Structures', 'System Design'] },
        { phaseNumber: 2, title: 'Applied Full-Stack & API Engineering', status: 'In Progress', month: 'Month 2', skills: ['React', 'Node.js', 'PostgreSQL'] },
        { phaseNumber: 3, title: 'Cloud Infrastructure & DevOps CI/CD', status: 'Upcoming', month: 'Month 3', skills: ['Docker', 'AWS', 'Kubernetes'] },
        { phaseNumber: 4, title: 'Enterprise Capstone & Mock Technical Interviews', status: 'Upcoming', month: 'Month 4', skills: ['System Architecture', 'Live Coding'] },
      ];

  const projectList = (student.projects || []).map((p: any) => ({
    ...p,
    techStack: p.techStack || p.tech || ['TypeScript', 'React'],
    stars: p.stars || 14,
  }));

  const certList = (student.certifications || []).map((c: any) => ({
    ...c,
    title: c.title || c.name || 'Verified Certificate',
    issueDate: c.issueDate || '2024',
  }));

  const internshipList = (student.internships || []).map((i: any) => ({
    ...i,
    duration: i.duration || i.period || '3 Months',
    status: i.status || 'Completed',
    performanceRating: i.performanceRating || 4.8,
  }));

  const applicationList = (student.applications || []).map((a: any) => ({
    ...a,
    opportunityTitle: a.opportunityTitle || a.role || 'Engineering Opportunity',
  }));

  return (
    <div
      id="student-profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="student-profile-modal-content"
        className="relative w-full max-w-4xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-500/20">
                  {rollNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    student.placementStatus === 'Placed'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/20'
                      : student.placementStatus === 'Interviewing'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-500/20'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/20'
                  }`}
                >
                  {student.placementStatus === 'Placed'
                    ? `Placed • ${student.placementDetails?.company || 'Industry Partner'}`
                    : student.placementStatus}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {student.department} • Year {student.year} (Sem {semester})
                </span>
                <span>•</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  CGPA: {cgpaValue.toFixed(2)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
              </p>
            </div>
          </div>

          <button
            id="close-student-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-gray-100 dark:border-white/5 text-xs font-bold overflow-x-auto">
          {[
            { id: 'overview', label: 'Student Overview', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'skills', label: 'Skills & Gaps', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'roadmap', label: 'Career Roadmap', icon: <Target className="w-3.5 h-3.5" /> },
            { id: 'projects', label: 'Projects & Certs', icon: <FileCheck className="w-3.5 h-3.5" /> },
            { id: 'applications', label: 'Internships & Offers', icon: <Briefcase className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[11px] text-gray-500 block">Overall Skill Score</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
                    {overallSkillScore}%
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {readinessLevel} Readiness
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[11px] text-gray-500 block">Target Career Role</span>
                  <div className="text-base font-bold text-gray-900 dark:text-white mt-1 truncate">
                    {roleName}
                  </div>
                  <span className="text-[10px] text-purple-600 font-medium">
                    {roleFit}% Fit
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[11px] text-gray-500 block">Internship Status</span>
                  <div className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {internshipList.length > 0 ? internshipList[0].status : 'Seeking'}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {internshipList.length} Record(s)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
                  <span className="text-[11px] text-gray-500 block">Placement Status</span>
                  <div className="text-base font-bold text-gray-900 dark:text-white mt-1 truncate">
                    {student.placementStatus}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {student.placementDetails ? student.placementDetails.package : 'Ongoing Drives'}
                  </span>
                </div>
              </div>

              {/* Career Goal Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    <span>Target Career Pathway</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {roleName}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    Target Companies: {targetCompanyType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">
                      Pathway Match
                    </span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                      {roleFit}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment History */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Verified Diagnostic Assessments History
                </h3>
                <div className="space-y-2">
                  {assessmentHistory.map((hist: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            Assessment Session ({hist.date})
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            Standardised Academia-Industry Assessment Suite
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right font-bold">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Technical</span>
                          <span className="text-blue-600">{hist.technicalScore || hist.score || 82}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Soft Skills</span>
                          <span className="text-purple-600">{hist.softSkillScore || 80}%</span>
                        </div>
                        <div className="pl-3 border-l border-gray-200 dark:border-white/10">
                          <span className="text-[10px] text-gray-400 block">Overall</span>
                          <span className="text-emerald-600">{hist.overallScore || hist.score || 85}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Top Verified Skills */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Verified Technical & Applied Competencies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topSkillsList.map((s: any, idx: number) => (
                    <div
                      key={s.skill || idx}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {s.skill}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${s.score || 80}%` }}
                          />
                        </div>
                        <span className="font-bold text-blue-600 min-w-[32px] text-right">
                          {s.score || 80}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps Breakdown */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Identified Industry Skill Gaps & Recommended Interventions</span>
                </h3>
                <div className="space-y-2">
                  {skillGapsList.map((gap: any) => (
                    <div
                      key={gap.skill}
                      className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {gap.skill}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              gap.priority === 'High'
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {gap.priority} Priority Gap
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Current Proficiency: {gap.current}% • Industry Threshold: {gap.required}%
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-rose-600">
                          -{gap.gap}% Delta
                        </span>
                        <span className="text-[10px] text-gray-400 block">Bridge in Roadmap</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Personalized Learning & Industry Readiness Roadmap
              </h3>
              <div className="space-y-3">
                {roadmapPhases.map((phase: any, pIdx: number) => (
                  <div
                    key={phase.phaseNumber || pIdx}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          phase.status === 'Completed'
                            ? 'bg-emerald-500 text-white'
                            : phase.status === 'In Progress'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                        }`}
                      >
                        {phase.phaseNumber || (pIdx + 1)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{phase.title}</h4>
                        <span
                          className={`text-[10px] font-semibold uppercase ${
                            phase.status === 'Completed'
                              ? 'text-emerald-600'
                              : phase.status === 'In Progress'
                              ? 'text-blue-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {phase.status}
                        </span>
                      </div>
                    </div>

                    <div className="w-36 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            phase.status === 'Completed' ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${phase.progress !== undefined ? phase.progress : (phase.status === 'Completed' ? 100 : phase.status === 'In Progress' ? 50 : 0)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 min-w-[32px] text-right">
                        {phase.progress !== undefined ? phase.progress : (phase.status === 'Completed' ? 100 : phase.status === 'In Progress' ? 50 : 0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Production Capstones & GitHub Repositories ({projectList.length})
                </h3>
                <div className="space-y-3">
                  {projectList.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {p.stars}
                          </span>
                          {p.githubUrl && (
                            <a
                              href={p.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:text-blue-600 text-gray-600 dark:text-gray-300"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {p.liveDemoUrl && (
                            <a
                              href={p.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:text-blue-600 text-gray-600 dark:text-gray-300"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  Verified Industry Certifications ({certList.length})
                </h3>
                <div className="space-y-2">
                  {certList.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-gray-800 dark:text-gray-200">
                            {c.title}
                          </span>
                          <span className="text-[11px] text-gray-500 block">
                            Issued by {c.issuer} • {c.issueDate}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              {/* Placements Details If Placed */}
              {student.placementDetails && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Official Verified Campus Placement</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {student.placementDetails.role}
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Company: {student.placementDetails.company} • Date of Offer:{' '}
                        {student.placementDetails.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-600">
                        {student.placementDetails.package}
                      </span>
                      <span className="text-[10px] text-gray-400 block">Annual Compensation</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Internships */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Industry Internships ({internshipList.length})
                </h3>
                <div className="space-y-2">
                  {internshipList.map((int: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {int.role} • {int.company}
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Duration: {int.duration} • Stipend: {int.stipend}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {int.status}
                        </span>
                        {int.performanceRating && (
                          <span className="text-[10px] text-amber-500 block font-semibold mt-1">
                            Rating: {int.performanceRating}/5
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications Pipeline */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Active Opportunity Applications ({applicationList.length})
                </h3>
                <div className="space-y-2">
                  {applicationList.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {app.opportunityTitle}
                        </span>
                        <span className="text-[11px] text-gray-500 block">
                          {app.company} • Applied on {app.appliedDate}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'Selected'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : app.status === 'Interview'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Official Institution Record • SkillBridge AI Enterprise Sync
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
