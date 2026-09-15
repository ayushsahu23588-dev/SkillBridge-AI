import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_CANDIDATES } from '../../data/industryFacultyMockData';
import {
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Video,
  X,
  Trash2,
  Filter,
  Eye,
  Mail,
  ChevronDown,
  LayoutGrid,
  List,
  FileCheck,
} from 'lucide-react';

export const ShortlistedCandidatesPage: React.FC = () => {
  const {
    shortlistedCandidates,
    industryOpportunities,
    updateShortlistedStatus,
    removeShortlistedCandidate,
    scheduleInterview,
    navigate,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'
  >('All');

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Interview scheduling modal state
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<any | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-09-20');
  const [interviewTime, setInterviewTime] = useState('15:00');
  const [interviewType, setInterviewType] = useState<'Online' | 'In-person'>('Online');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/technova-final-interview');
  const [interviewNotes, setInterviewNotes] = useState('Technical deep dive on system design and algorithms.');

  // Join candidate details with shortlisted objects
  const enrichedList = shortlistedCandidates.map((s: any) => {
    const candidateId = s.candidateId || s.studentId || s.id;
    const candidateName = s.candidateName || s.studentName || 'Candidate';
    const matchScore = s.matchScore || s.matchPercentage || 85;

    const student = DEMO_CANDIDATES.find((c) => c.id === candidateId) || {
      id: candidateId,
      name: candidateName,
      avatar: s.studentAvatar || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      college: s.studentCollege || s.college || 'Apex National Institute of Technology',
      department: s.studentDepartment || s.department || 'Computer Science',
      email: s.studentEmail || `${candidateName.toLowerCase().replace(/\s+/g, '.')}@apex.edu`,
      gpa: s.studentGpa || 8.8,
      skills: [{ name: 'Python' }, { name: 'SQL' }],
    };

    const opp = industryOpportunities.find((o) => o.id === s.opportunityId) || {
      id: s.opportunityId,
      title: s.opportunityTitle || 'Software Engineer Intern',
      type: s.opportunityType || 'Internship',
      requiredSkills: ['TypeScript', 'React', 'Node.js'],
    };

    const matchingSkills = (student.skills || [])
      .map((sk: any) => typeof sk === 'string' ? sk : sk.name)
      .filter((name: string) =>
        (opp.requiredSkills || []).some((req: string) => req.toLowerCase() === name.toLowerCase())
      );

    return {
      ...s,
      candidateId,
      candidateName,
      matchScore,
      student,
      opportunity: opp,
      matchingSkills: matchingSkills.length > 0 ? matchingSkills : ['Technical Aptitude', 'Problem Solving'],
    };
  });

  const filteredList = enrichedList.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  const handleStatusChange = (
    candidateId: string,
    opportunityId: string,
    newStatus: 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'
  ) => {
    updateShortlistedStatus(candidateId, opportunityId, newStatus);
    showToast(`Status updated to "${newStatus}".`, 'success');
  };

  const handleMoveToApplication = (item: any) => {
    updateShortlistedStatus(item.candidateId, item.opportunityId, 'Shortlisted');
    showToast(`Candidate ${item.candidateName} moved to Active Applications desk!`, 'success');
    navigate('/industry/applications');
  };

  const handleConfirmInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInterview) return;

    updateShortlistedStatus(
      selectedCandidateForInterview.candidateId,
      selectedCandidateForInterview.opportunityId,
      'Interview'
    );

    scheduleInterview(selectedCandidateForInterview.candidateId, {
      date: interviewDate,
      time: `${interviewTime} IST`,
      type: interviewType,
      locationOrLink: interviewLink,
      notes: interviewNotes,
    });

    showToast(
      `Interview scheduled with ${selectedCandidateForInterview.candidateName} for ${interviewDate}!`,
      'success'
    );
    setSelectedCandidateForInterview(null);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Shortlisted Candidates
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your candidate shortlist, advance applicants through interview stages, and extend return offers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#14151B] text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#14151B] text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => navigate('/industry/candidates')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-[#D4F73C]" />
            <span>Find More Candidates</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['All', 'Shortlisted', 'Interview', 'Selected', 'Rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === status
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {status}
            <span className="ml-1.5 text-[10px] opacity-80">
              {status === 'All'
                ? enrichedList.length
                : enrichedList.filter((i) => i.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {filteredList.length === 0 ? (
        <div className="p-12 text-center text-gray-500 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs">
          <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <div className="font-bold text-base text-gray-800 dark:text-gray-200">
            No candidates found
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            You currently have no candidates in the "{statusFilter}" status. Use AI Candidate Matching to discover and shortlist talent.
          </p>
          <button
            onClick={() => navigate('/industry/candidates')}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
          >
            Go to Candidate Matching
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredList.map((item) => (
            <div
              key={`${item.candidateId}-${item.opportunityId}`}
              className="p-6 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-5 hover:border-purple-300 dark:hover:border-purple-800/60 transition-all"
            >
              <div className="space-y-4">
                {/* Header: Student & AI Match */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.student.avatar}
                      alt={item.student.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-purple-500/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        {item.student.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.student.department}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {item.student.college}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-[#D4F73C]/20 border border-[#D4F73C]/50 text-gray-950 dark:text-[#D4F73C] font-black text-xs shrink-0">
                    {item.matchScore}% Match
                  </span>
                </div>

                {/* Applied Role */}
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Applied Role</span>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                      {item.opportunity.title}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    {item.opportunity.type}
                  </span>
                </div>

                {/* Matching Skills */}
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Matching Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.matchingSkills.slice(0, 4).map((sk: string, sIdx: number) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/50 dark:border-emerald-800/30"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-gray-500">Status</span>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(
                        item.candidateId,
                        item.opportunityId,
                        e.target.value as any
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                      item.status === 'Selected'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : item.status === 'Interview'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300'
                        : item.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/50 dark:text-red-300'
                        : 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300'
                    }`}
                  >
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/industry/candidates/${item.candidateId}`)}
                    className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => handleMoveToApplication(item)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 cursor-pointer"
                    title="Move to Application Desk"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Move to Application</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCandidateForInterview(item)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>

                  <button
                    onClick={() => {
                      removeShortlistedCandidate(item.candidateId, item.opportunityId);
                      showToast(`Removed from shortlist.`, 'info');
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                    title="Remove from Shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-3">Opportunity</th>
                  <th className="py-3.5 px-3">Match %</th>
                  <th className="py-3.5 px-3">Matching Skills</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {filteredList.map((item) => (
                  <tr
                    key={`${item.candidateId}-${item.opportunityId}`}
                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.student.avatar}
                          alt={item.student.name}
                          className="w-10 h-10 rounded-full object-cover border border-purple-500/20 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {item.student.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {item.student.department} • {item.student.college}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {item.opportunity.title}
                      </div>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                        {item.opportunity.type}
                      </span>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#D4F73C]/20 border border-[#D4F73C]/50 text-gray-950 dark:text-[#D4F73C] font-black text-xs">
                        {item.matchScore}% Match
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.matchingSkills.slice(0, 3).map((s: string, idx: number) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(
                            item.candidateId,
                            item.opportunityId,
                            e.target.value as any
                          )
                        }
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                          item.status === 'Selected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.status === 'Interview'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : item.status === 'Rejected'
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-purple-50 text-purple-700 border-purple-300'
                        }`}
                      >
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/industry/candidates/${item.candidateId}`)}
                          className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-800 dark:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleMoveToApplication(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>Move</span>
                        </button>

                        <button
                          onClick={() => setSelectedCandidateForInterview(item)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Interview</span>
                        </button>

                        <button
                          onClick={() => {
                            removeShortlistedCandidate(item.candidateId, item.opportunityId);
                            showToast(`Candidate removed from shortlist.`, 'info');
                          }}
                          title="Remove from shortlist"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedCandidateForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Schedule Interview
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedCandidateForInterview.candidateName} • {selectedCandidateForInterview.opportunityTitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedCandidateForInterview(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmInterview} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                    Time (IST)
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
                  Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Online', 'In-person'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setInterviewType(t)}
                      className={`py-2 rounded-xl border font-bold cursor-pointer transition-all ${
                        interviewType === t
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {interviewType === 'Online' ? 'Meeting Link' : 'Campus Venue / Room'}
                </label>
                <input
                  type="text"
                  required
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Instructions / Topics for Candidate
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCandidateForInterview(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
