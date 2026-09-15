import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  matchCandidate,
  CandidateMatchResult,
} from '../../services/candidateMatchingService';
import { DEMO_CANDIDATES } from '../../data/industryFacultyMockData';
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Mail,
  UserCheck,
  Eye,
  Building,
  GraduationCap,
  ArrowRight,
  Filter,
  Check,
  Briefcase,
  Layers,
  ChevronDown,
  Award,
  ExternalLink,
  Calendar,
  X,
  Video,
  FileText,
  Clock,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export const AiCandidateMatchingPage: React.FC = () => {
  const {
    industryOpportunities,
    shortlistedCandidates,
    shortlistCandidate,
    removeShortlistedCandidate,
    scheduleInterview,
    showToast,
    navigate,
    currentPath,
  } = useApp();

  // Selected Opportunity for Matching
  const [selectedOppId, setSelectedOppId] = useState<string>(
    industryOpportunities[0]?.id || 'opp_1'
  );

  const selectedOpp = useMemo(
    () => industryOpportunities.find((o) => o.id === selectedOppId) || industryOpportunities[0],
    [industryOpportunities, selectedOppId]
  );

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);

  // Selected candidate for detailed profile view/modal
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Contact Modal
  const [contactingCandidate, setContactingCandidate] = useState<any | null>(null);
  const [contactSubject, setContactSubject] = useState('Campus Opportunity Invitation: TechNova Solutions');
  const [contactMessage, setContactMessage] = useState(
    'Hi, your profile and verified projects strongly align with our upcoming campus cohort. We would like to invite you for an initial interview.'
  );

  // Interview modal
  const [interviewCandidate, setInterviewCandidate] = useState<any | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-09-18');
  const [interviewTime, setInterviewTime] = useState('11:00');
  const [interviewType, setInterviewType] = useState<'Online' | 'In-person'>('Online');
  const [interviewMeeting, setInterviewMeeting] = useState('https://meet.google.com/technova-campus-interview');

  // Compute matches and rank candidates using exact 50/15/15/10/10 formula
  const rankedCandidates = useMemo(() => {
    if (!selectedOpp) return [];

    return DEMO_CANDIDATES.map((student) => {
      const match = matchCandidate(student, selectedOpp);
      const isShortlisted = shortlistedCandidates.some(
        (s) => s.candidateId === student.id && s.opportunityId === selectedOpp.id
      );

      return {
        student,
        match,
        isShortlisted,
      };
    })
      .filter((item) => {
        const matchesQuery =
          item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.student.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.match.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesQuery && item.match.matchPercentage >= minMatchScore;
      })
      .sort((a, b) => b.match.matchPercentage - a.match.matchPercentage);
  }, [selectedOpp, shortlistedCandidates, searchQuery, minMatchScore]);

  // If URL has candidate ID like /industry/candidates/cand_1
  React.useEffect(() => {
    const parts = currentPath.split('/');
    if (parts.length >= 4 && parts[2] === 'candidates' && parts[3]) {
      setSelectedCandidateId(parts[3]);
    }
  }, [currentPath]);

  const activeDetail = useMemo(() => {
    if (!selectedCandidateId) return null;
    const item = rankedCandidates.find((c) => c.student.id === selectedCandidateId);
    if (item) return item;
    const fallbackStudent = DEMO_CANDIDATES.find((c) => c.id === selectedCandidateId);
    if (fallbackStudent && selectedOpp) {
      return {
        student: fallbackStudent,
        match: matchCandidate(fallbackStudent, selectedOpp),
        isShortlisted: shortlistedCandidates.some((s) => s.candidateId === fallbackStudent.id),
      };
    }
    return null;
  }, [selectedCandidateId, rankedCandidates, selectedOpp, shortlistedCandidates]);

  const handleToggleShortlist = (student: any) => {
    if (!selectedOpp) return;
    const isShortlisted = shortlistedCandidates.some(
      (s) => s.candidateId === student.id && s.opportunityId === selectedOpp.id
    );

    if (isShortlisted) {
      removeShortlistedCandidate(student.id, selectedOpp.id);
      showToast(`${student.name} removed from shortlisted candidates.`, 'info');
    } else {
      shortlistCandidate(
        student.id,
        selectedOpp.id,
        `Matched with ${selectedOpp.title} based on ${matchCandidate(student, selectedOpp).matchPercentage}% AI score`
      );
      showToast(`⭐ ${student.name} added to shortlisted candidates!`, 'success');
    }
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingCandidate) return;
    showToast(`Invitation sent to ${contactingCandidate.name} (${contactingCandidate.email})!`, 'success');
    setContactingCandidate(null);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewCandidate || !selectedOpp) return;

    scheduleInterview(interviewCandidate.id, {
      date: interviewDate,
      time: `${interviewTime} IST`,
      type: interviewType,
      locationOrLink: interviewMeeting,
      notes: `Interview for ${selectedOpp.title}`,
    });

    showToast(
      `Interview confirmed with ${interviewCandidate.name} for ${interviewDate} at ${interviewTime} IST!`,
      'success'
    );
    setInterviewCandidate(null);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F73C]/20 border border-[#D4F73C]/40 text-black dark:text-[#D4F73C] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-[#D4F73C]" />
            <span>AI Multi-Vector Candidate Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Find Candidates
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Evaluate engineering students using our 5-dimension matching algorithm: Required Skills (50%), Projects (15%), Career Alignment (15%), Certifications (10%), Soft Skills (10%).
          </p>
        </div>

        <button
          onClick={() => navigate('/industry/shortlisted')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserCheck className="w-4 h-4" />
          <span>View Shortlisted Pool ({shortlistedCandidates.length})</span>
        </button>
      </div>

      {/* Target Opportunity Selector */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
          Select Target Opportunity to Match Candidates
        </label>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-1/2">
            <Briefcase className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {industryOpportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  [{opp.type}] {opp.title} ({opp.location})
                </option>
              ))}
            </select>
          </div>

          {selectedOpp && (
            <div className="flex-1 text-xs bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 p-2.5 rounded-2xl flex flex-wrap items-center gap-x-4 gap-y-1 text-purple-900 dark:text-purple-300">
              <span>
                <strong>Required:</strong> {selectedOpp.requiredSkills.join(', ')}
              </span>
              <span>•</span>
              <span>
                <strong>Mode:</strong> {selectedOpp.workMode}
              </span>
              <span>•</span>
              <span>
                <strong>Stipend:</strong> {selectedOpp.stipendOrSalary}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Search and Score Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate, college, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#14151B] text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-gray-500 font-bold whitespace-nowrap">Filter Match:</span>
          {[0, 80, 85, 90].map((threshold) => (
            <button
              key={threshold}
              onClick={() => setMinMatchScore(threshold)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                minMatchScore === threshold
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {threshold === 0 ? 'All Matches' : `${threshold}%+ Match`}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>Best Matching Candidates</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs">
              {rankedCandidates.length} Ranked
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankedCandidates.map(({ student, match, isShortlisted }) => (
            <div
              key={student.id}
              className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-5 sm:p-6 shadow-xs hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between gap-4"
            >
              {/* Header: Avatar, Name, Match Badge */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500 font-normal">
                          Demo Profile
                        </span>
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {student.department} • {student.college}
                      </p>
                      <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mt-0.5 flex items-center gap-2">
                        <span>GPA: {student.gpa.toFixed(2)}</span>
                        <span>•</span>
                        <span>Batch: {student.batch}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Match Score Badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-[#D4F73C] text-gray-950 font-black text-xs shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{match.matchPercentage}% Match</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1">
                      {match.requiredSkillsScore}/50 on Core Skills
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-emerald-500 to-[#D4F73C] rounded-full"
                    style={{ width: `${match.matchPercentage}%` }}
                  />
                </div>

                {/* Matching Skills */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Matching Skills ({match.matchingSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.matchingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-500/20"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {match.matchingSkills.length === 0 && (
                      <span className="text-[11px] text-gray-400 italic">No exact skill match</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                {match.missingSkills.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">
                      Missing Requirements ({match.missingSkills.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {match.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold border border-amber-500/20"
                        >
                          ! {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects & Certifications snippet */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Top Project:</strong>{' '}
                    {student.topProjects[0]?.title || 'Capstone Research Project'}
                  </div>
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Target Role:</strong>{' '}
                    {student.careerPreferences.targetRole} •{' '}
                    <span className="text-emerald-600 font-semibold">{student.availability}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Profile, Shortlist, Contact */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                <button
                  onClick={() => setSelectedCandidateId(student.id)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Profile</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setContactingCandidate(student)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>

                  <button
                    onClick={() => handleToggleShortlist(student)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isShortlisted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Profile Detailed View Modal (6.9) */}
      {activeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={activeDetail.student.avatar}
                  alt={activeDetail.student.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {activeDetail.student.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-[#D4F73C] text-gray-950 font-black text-xs">
                      {activeDetail.match.matchPercentage}% AI Match
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {activeDetail.student.department} • {activeDetail.student.college}
                  </p>
                  <p className="text-xs font-semibold text-purple-600 mt-0.5">
                    Career Goal: {activeDetail.student.careerPreferences.targetRole}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateId(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why This Candidate Matches Breakdown (Step 6.8 & 6.9) */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Why This Candidate Matches: {selectedOpp?.title}</span>
              </div>
              <p className="text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
                {activeDetail.match.explanation}
              </p>

              {/* 5-Dimension Visual Score Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-purple-200/40 dark:border-purple-800/30 text-center">
                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <div className="text-[10px] text-gray-500 font-bold">Skills (50%)</div>
                  <div className="text-xs font-extrabold text-purple-700 dark:text-purple-300 mt-0.5">
                    {activeDetail.match.requiredSkillsScore}/50
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <div className="text-[10px] text-gray-500 font-bold">Projects (15%)</div>
                  <div className="text-xs font-extrabold text-blue-700 dark:text-blue-300 mt-0.5">
                    {activeDetail.match.projectAlignment}/15
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <div className="text-[10px] text-gray-500 font-bold">Career (15%)</div>
                  <div className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {activeDetail.match.careerAlignment}/15
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <div className="text-[10px] text-gray-500 font-bold">Certs (10%)</div>
                  <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {activeDetail.match.certificationsScore}/10
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <div className="text-[10px] text-gray-500 font-bold">Soft Skills (10%)</div>
                  <div className="text-xs font-extrabold text-amber-700 dark:text-amber-300 mt-0.5">
                    {activeDetail.match.softSkillsScore}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Proficiency Levels */}
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Technical Skills & Verified Proficiency
              </div>
              <div className="flex flex-wrap gap-2">
                {activeDetail.student.skills.map((sk: any, i: number) => (
                  <div
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs flex items-center gap-1.5"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{sk.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      {sk.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Projects */}
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                Verified Projects ({activeDetail.student.topProjects.length})
              </div>
              <div className="space-y-2.5">
                {activeDetail.student.topProjects.map((proj: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs"
                  >
                    <div className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                      <span>{proj.title}</span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {(proj.techStack || []).join(' • ')}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-1">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Internships */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Certifications
                </div>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  {activeDetail.student.certifications.map((c: any, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{c.title}</span>
                      <span className="text-gray-400 text-[10px]">({c.issuer})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Previous Internships & Highlights
                </div>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  {activeDetail.student.internships.map((int: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{int}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setSelectedCandidateId(null)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCandidateId(null);
                    setInterviewCandidate(activeDetail.student);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Schedule Interview</span>
                </button>

                <button
                  onClick={() => handleToggleShortlist(activeDetail.student)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${
                    activeDetail.isShortlisted
                      ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {activeDetail.isShortlisted ? 'Remove from Shortlist' : 'Shortlist Candidate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Student Modal */}
      {contactingCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Contact {contactingCandidate.name}
              </h3>
              <button
                onClick={() => setContactingCandidate(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendContact} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  disabled
                  value={`${contactingCandidate.name} (${contactingCandidate.email})`}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContactingCandidate(null)}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal from Candidate Profile */}
      {interviewCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Schedule Interview with {interviewCandidate.name}
              </h3>
              <button
                onClick={() => setInterviewCandidate(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                >
                  <option value="Online">Online Video Meeting</option>
                  <option value="In-person">In-person Campus Session</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Location / Meeting URL
                </label>
                <input
                  type="text"
                  required
                  value={interviewMeeting}
                  onChange={(e) => setInterviewMeeting(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewCandidate(null)}
                  className="px-3 py-1.5 rounded-xl text-gray-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Confirm Interview</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
