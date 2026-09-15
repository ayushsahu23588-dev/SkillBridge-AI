import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  Send,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Calendar,
  Gift,
  ExternalLink,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { CandidateSearchProfile } from '../../types';
import { CandidateDetailModal } from './CandidateDetailModal';

export const AiTalentSearch: React.FC = () => {
  const {
    candidatePool,
    jobs,
    currentCompany,
    inviteCandidateToJob,
    scheduleCompanyInterview,
    extendCompanyOffer,
    showToast,
  } = useApp();

  const [query, setQuery] = useState('');
  const [minGpa, setMinGpa] = useState<number>(3.0);
  const [minScore, setMinScore] = useState<number>(75);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Candidate detail modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSearchProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [targetCandidate, setTargetCandidate] = useState<CandidateSearchProfile | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [inviteMsg, setInviteMsg] = useState(
    `Hello! We evaluated your verified projects on EduBridge and believe your skill set is an exceptional match for our engineering team at ${currentCompany.name}. We'd love to fast-track you to our technical interview round.`
  );

  const companyTech = currentCompany?.techStack || ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'];

  const filteredCandidates = candidatePool.filter((c) => {
    const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
      c.headline.toLowerCase().includes(query.toLowerCase()) ||
      c.college.toLowerCase().includes(query.toLowerCase());

    const matchesGpa = c.gpa >= minGpa;
    const matchesScore = c.readinessScore >= minScore;
    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      c.workPreferences.targetRole.toLowerCase().includes(selectedRoleFilter.toLowerCase()) ||
      c.headline.toLowerCase().includes(selectedRoleFilter.toLowerCase());

    return matchesQuery && matchesGpa && matchesScore && matchesRole;
  });

  const handleOpenInvite = (candidate: CandidateSearchProfile) => {
    setTargetCandidate(candidate);
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCandidate) return;
    inviteCandidateToJob(targetCandidate.id, selectedJobId, inviteMsg);
    setIsInviteModalOpen(false);
    setTargetCandidate(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Pre-Vetted Campus Talent Pool
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            AI Multi-Campus Candidate Discovery
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Search pre-verified student portfolios across accredited institutions. Filter by faculty-endorsed competencies, GPA thresholds, and ATS alignment.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center self-start md:self-auto">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
            Verified Candidates
          </span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {filteredCandidates.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills, name, college..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          >
            <option value="ALL">All Specializations</option>
            <option value="Full Stack">Full Stack / Web</option>
            <option value="Cloud">Cloud & DevOps / Systems</option>
            <option value="AI">AI / Machine Learning</option>
            <option value="Security">Cybersecurity</option>
          </select>
        </div>

        <div>
          <select
            value={minGpa}
            onChange={(e) => setMinGpa(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          >
            <option value={3.0}>Min GPA: 3.0</option>
            <option value={3.5}>Min GPA: 3.5</option>
            <option value={3.8}>Min GPA: 3.8 (Top Honors)</option>
          </select>
        </div>

        <div>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          >
            <option value={75}>Min Readiness: ≥ 75%</option>
            <option value={85}>Min Readiness: ≥ 85%</option>
            <option value={90}>Min Readiness: ≥ 90% (Elite)</option>
          </select>
        </div>
      </div>

      {/* Candidate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => {
          // Calculate overlap with company stack
          const matchedSkills = candidate.skills.filter((s) =>
            companyTech.some((ct) => ct.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ct.toLowerCase()))
          );

          return (
            <div
              key={candidate.id}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-purple-500/60 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        {candidate.name}
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                        {candidate.headline}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      {candidate.readinessScore}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <p className="flex items-center gap-1.5 truncate">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {candidate.department} • GPA: <span className="font-semibold text-gray-900 dark:text-white">{candidate.gpa}</span>
                  </p>
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {candidate.college}
                  </p>
                </div>

                {/* Tech Alignment Pills */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill, si) => {
                      const isMatched = matchedSkills.includes(skill);
                      return (
                        <span
                          key={si}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            isMatched
                              ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {candidate.skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-400">
                        +{candidate.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setIsDetailOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Portfolio</span>
                </button>

                <button
                  onClick={() => handleOpenInvite(candidate)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Direct Invite</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Inspector Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
          onScheduleInterview={() => {
            setIsDetailOpen(false);
            showToast(`Opening interview schedule for ${selectedCandidate.name}`);
          }}
          onExtendOffer={() => {
            setIsDetailOpen(false);
            showToast(`Opening offer letter composer for ${selectedCandidate.name}`);
          }}
        />
      )}

      {/* Direct VIP Job Invitation Modal */}
      {isInviteModalOpen && targetCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-500" />
                  Direct Recruiter Invitation
                </h3>
                <p className="text-xs text-gray-500">
                  Candidate: <span className="font-bold text-gray-900 dark:text-white">{targetCandidate.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Select Opportunity
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Personalized Recruiter Note
                </label>
                <textarea
                  rows={4}
                  value={inviteMsg}
                  onChange={(e) => setInviteMsg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  Dispatch Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
