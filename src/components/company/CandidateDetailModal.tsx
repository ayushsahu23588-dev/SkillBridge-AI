import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ExternalLink,
  Award,
  Calendar,
  Gift,
  FileText,
  Mail,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Code2,
  MapPin,
  Clock,
  Send,
} from 'lucide-react';
import { Application, CandidateSearchProfile, JobPosting } from '../../types';
import { useApp } from '../../context/AppContext';

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: CandidateSearchProfile | null;
  application?: Application | null;
  onScheduleInterview?: (candidate: CandidateSearchProfile | Application) => void;
  onExtendOffer?: (candidate: CandidateSearchProfile | Application) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  isOpen,
  onClose,
  candidate,
  application,
  onScheduleInterview,
  onExtendOffer,
}) => {
  const { jobs, currentCompany, showToast } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [inviteMessage, setInviteMessage] = useState<string>(
    `Hi! We reviewed your verified projects on EduBridge and would love to invite you to interview for our engineering team.`
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'projects' | 'match_breakdown'>('overview');

  if (!isOpen || (!candidate && !application)) return null;

  // Normalize candidate data
  const name = candidate?.name || application?.studentName || 'Candidate';
  const email = candidate?.email || application?.studentEmail || '';
  const avatar = candidate?.avatar || application?.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const college = candidate?.college || application?.studentCollege || 'Apex National Institute of Technology';
  const department = candidate?.department || application?.studentDepartment || 'Computer Science & Engineering';
  const gpa = candidate?.gpa || application?.studentGpa || 3.88;
  const skills = candidate?.skills || application?.studentSkills || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'];
  const matchScore = application?.aiMatchScore || candidate?.readinessScore || 92;

  // Matching with company tech stack
  const companyTech = currentCompany?.techStack || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'];
  const matchingSkills = skills.filter((s) =>
    companyTech.some((ct) => ct.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ct.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {department} • {college} • GPA: <span className="font-semibold text-gray-900 dark:text-white">{gpa}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{matchScore}% AI Fit</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Candidate Profile
          </button>
          <button
            onClick={() => setActiveTab('match_breakdown')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'match_breakdown'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            AI ATS Match Analysis
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'projects'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Verified Projects & Certs
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Resume Preview
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Skills section */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                  Technical Competencies ({skills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => {
                    const isMatched = matchingSkills.includes(s);
                    return (
                      <span
                        key={idx}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          isMatched
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {isMatched && <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Work Preferences */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 font-medium">Target Role</span>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {candidate?.workPreferences?.targetRole || 'Full Stack / Cloud Infrastructure'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Work Mode</span>
                  <p className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {candidate?.workPreferences?.workMode || 'Hybrid / Remote'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Relocation</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Open to Relocate
                  </p>
                </div>
              </div>

              {/* Application Details if present */}
              {application && (
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      Application Stage: <span className="font-extrabold">{application.status}</span>
                    </span>
                    <span className="text-gray-500">Applied on {application.appliedDate}</span>
                  </div>
                  {application.recruiterNotes && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                      "{application.recruiterNotes}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'match_breakdown' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                    Calculated ATS Compatibility
                  </span>
                  <h3 className="text-2xl font-extrabold text-purple-900 dark:text-purple-100 mt-0.5">
                    {matchScore}% Match
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Evaluated against {currentCompany.name}'s tech stack and benchmark rubric.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center font-black text-purple-700 dark:text-purple-300 text-lg bg-white dark:bg-gray-900 shadow-inner">
                  {matchScore}%
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Skill Alignment ({matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchingSkills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 space-y-2">
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Faculty Endorsements
                  </span>
                  <p className="text-gray-600 dark:text-gray-300">
                    Candidate has 4 verified academic project endorsements from department professors with institutional cryptographic seal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Featured Portfolio Projects
              </h4>
              <div className="space-y-3">
                {(candidate?.topProjects || [
                  {
                    title: 'StreamPulse – Distributed Real-Time Telemetry Observability',
                    techStack: ['TypeScript', 'WebSockets', 'Redis Streams', 'Docker', 'PostgreSQL'],
                    githubUrl: 'https://github.com/aaravpatel-tech/streampulse',
                    liveUrl: 'https://streampulse.io',
                  },
                  {
                    title: 'NexusKV – Raft-Consensus Distributed Key-Value Store',
                    techStack: ['Go', 'gRPC', 'Distributed Systems', 'Docker'],
                    githubUrl: 'https://github.com/aaravpatel-tech/nexus-kv',
                  },
                ]).map((p, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-purple-500" />
                        {p.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            <span>Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.map((tech, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 font-mono text-xs space-y-4 leading-relaxed text-gray-700 dark:text-gray-300 shadow-inner">
              <div className="border-b border-gray-200 dark:border-gray-800 pb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{name}</h3>
                <p className="text-gray-500">{email} • {college} • GitHub: github.com/student</p>
              </div>
              <div>
                <h5 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                  EDUCATION
                </h5>
                <p>Bachelor of Technology in {department}</p>
                <p>{college} (2022 - 2026) | CGPA: {gpa} / 4.0</p>
              </div>
              <div>
                <h5 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                  TECHNICAL SKILLS
                </h5>
                <p>{skills.join(', ')}</p>
              </div>
              <div>
                <h5 className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                  CAMPUS HIGHLIGHTS & AWARDS
                </h5>
                <p>• 1st Place - Apex NIT Annual Cloud Innovation Sprint 2025</p>
                <p>• Department Student Academic Research Fellowship</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{email}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onScheduleInterview) {
                  onScheduleInterview((application || candidate)!);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onExtendOffer) {
                  onExtendOffer((application || candidate)!);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Extend Offer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
