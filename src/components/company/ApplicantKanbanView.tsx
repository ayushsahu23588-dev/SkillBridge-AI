import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import {
  Users,
  Sparkles,
  ArrowRight,
  Calendar,
  MessageSquare,
  CheckCircle2,
  X,
  Clock,
  Briefcase,
  ChevronRight,
  Filter,
  Search,
  Gift,
  FileText,
  Video,
  ThumbsDown,
  GraduationCap,
} from 'lucide-react';
import { CandidateDetailModal } from './CandidateDetailModal';

const KANBAN_COLUMNS: { status: ApplicationStatus; title: string; color: string }[] = [
  { status: 'Applied', title: 'New Applied', color: 'border-blue-500' },
  { status: 'Screening', title: 'Resume Screening', color: 'border-indigo-500' },
  { status: 'Interview Scheduled', title: 'Interview Scheduled', color: 'border-purple-500' },
  { status: 'Technical Round', title: 'Tech Evaluation', color: 'border-amber-500' },
  { status: 'Offer Extended', title: 'Offer Extended', color: 'border-teal-500' },
  { status: 'Hired', title: 'Hired & Placed', color: 'border-emerald-500' },
  { status: 'Rejected', title: 'Archived', color: 'border-gray-500' },
];

export const ApplicantKanbanView: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    jobs,
    scheduleCompanyInterview,
    extendCompanyOffer,
    currentCompany,
    showToast,
  } = useApp();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interview Schedule Modal
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [targetAppForInterview, setTargetAppForInterview] = useState<Application | null>(null);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Technical Systems Round 1',
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    scheduledTime: '14:00 PST',
    durationMinutes: 60,
    interviewerName: 'Alex Rivera (Staff Engineer)',
    interviewerEmail: 'alex.rivera@novacloud.io',
    meetingLink: 'https://meet.google.com/nvc-tech-eng',
    mode: 'Google Meet' as 'Google Meet' | 'Zoom' | 'MS Teams' | 'On-Campus',
    notes: 'Focus on distributed algorithms, Raft consensus, and real-time event streaming architectures.',
  });

  // Offer Modal
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [targetAppForOffer, setTargetAppForOffer] = useState<Application | null>(null);
  const [offerForm, setOfferForm] = useState({
    jobTitle: 'Distributed Cloud Systems Engineer',
    offerType: 'Full-time' as 'Full-time' | 'Internship',
    ctcOrStipend: '$155,000 / year + $20,000 RSUs',
    joiningBonus: '$10,000',
    joiningDate: '2025-07-15',
    expiryDate: '2025-06-30',
    location: 'Hybrid • San Francisco, CA / Remote',
  });

  const filteredApps = applications.filter((app) => {
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesScore = app.aiMatchScore >= minMatchScore;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentCollege.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesJob && matchesScore && matchesSearch;
  });

  const handleOpenInterviewModal = (app: Application) => {
    const job = jobs.find((j) => j.id === app.jobId);
    setTargetAppForInterview(app);
    setInterviewForm((prev) => ({
      ...prev,
      roundName: app.status === 'Applied' || app.status === 'Screening' ? 'Technical Round 1' : 'Final System Design Round',
    }));
    setIsInterviewModalOpen(true);
  };

  const handleSubmitInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppForInterview) return;
    const job = jobs.find((j) => j.id === targetAppForInterview.jobId);

    scheduleCompanyInterview({
      applicationId: targetAppForInterview.id,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      studentId: targetAppForInterview.studentId,
      studentName: targetAppForInterview.studentName,
      studentEmail: targetAppForInterview.studentEmail,
      studentAvatar: targetAppForInterview.studentAvatar,
      jobId: targetAppForInterview.jobId,
      jobTitle: job ? job.title : 'Software Engineer',
      roundName: interviewForm.roundName,
      scheduledDate: interviewForm.scheduledDate,
      scheduledTime: interviewForm.scheduledTime,
      durationMinutes: interviewForm.durationMinutes,
      interviewerName: interviewForm.interviewerName,
      interviewerEmail: interviewForm.interviewerEmail,
      meetingLink: interviewForm.meetingLink,
      status: 'Scheduled',
      mode: interviewForm.mode,
      notes: interviewForm.notes,
    });

    setIsInterviewModalOpen(false);
    setTargetAppForInterview(null);
  };

  const handleOpenOfferModal = (app: Application) => {
    const job = jobs.find((j) => j.id === app.jobId);
    setTargetAppForOffer(app);
    setOfferForm({
      jobTitle: job ? job.title : 'Software Engineer',
      offerType: job?.type === 'Internship' ? 'Internship' : 'Full-time',
      ctcOrStipend: job ? job.salaryOrStipend : '$155,000 / year + Equity',
      joiningBonus: '$10,000',
      joiningDate: '2025-07-15',
      expiryDate: '2025-06-30',
      location: job ? job.location : 'Hybrid • San Francisco, CA',
    });
    setIsOfferModalOpen(true);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppForOffer) return;

    extendCompanyOffer({
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logo,
      studentId: targetAppForOffer.studentId,
      studentName: targetAppForOffer.studentName,
      studentEmail: targetAppForOffer.studentEmail,
      jobId: targetAppForOffer.jobId,
      jobTitle: offerForm.jobTitle,
      offerType: offerForm.offerType,
      ctcOrStipend: offerForm.ctcOrStipend,
      joiningBonus: offerForm.joiningBonus,
      joiningDate: offerForm.joiningDate,
      expiryDate: offerForm.expiryDate,
      location: offerForm.location,
      status: 'Extended',
      offerLetterUrl: 'https://example.com/offers/official-letter.pdf',
    });

    setIsOfferModalOpen(false);
    setTargetAppForOffer(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Ranked Applicant Kanban
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Candidate Hiring Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Track candidates across interview stages, inspect verified skills, schedule live evaluation rounds, and extend digital offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs text-center">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
              Active Candidates
            </span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              {filteredApps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidate name, college, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            >
              <option value="ALL">All Active Job Openings</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <select
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            >
              <option value={0}>All Match Scores</option>
              <option value={80}>≥ 80% AI Match</option>
              <option value={90}>≥ 90% High Fit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
        {KANBAN_COLUMNS.map((col) => {
          const colApps = filteredApps.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              className="w-80 shrink-0 flex flex-col rounded-3xl bg-gray-100/70 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-4 space-y-3 min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full border-2 ${col.color} bg-white dark:bg-gray-900`} />
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                  {colApps.length}
                </span>
              </div>

              {/* Cards inside column */}
              <div className="space-y-3 flex-1">
                {colApps.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);

                  return (
                    <div
                      key={app.id}
                      id={`kanban-card-${app.id}`}
                      className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 hover:border-purple-400 dark:hover:border-purple-500 shadow-xs transition-all space-y-3 cursor-pointer"
                      onClick={() => {
                        setSelectedApp(app);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.studentAvatar}
                            alt={app.studentName}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                              {app.studentName}
                            </h4>
                            <p className="text-[10px] text-gray-500 truncate max-w-[130px]">
                              GPA {app.studentGpa} • {app.studentDepartment}
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 shrink-0">
                          {app.aiMatchScore}% Fit
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-600 dark:text-gray-300 font-medium truncate">
                        Role: {job ? job.title : 'Software Engineer'}
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1">
                        {app.studentSkills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Quick stage selector & actions */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
                        <select
                          value={app.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus);
                          }}
                          className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-[10px] font-medium text-gray-700 dark:text-gray-300"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Screening">Screening</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Technical Round">Technical Round</option>
                          <option value="Offer Extended">Offer Extended</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenInterviewModal(app);
                            }}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenOfferModal(app);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold"
                            title="Extend Offer"
                          >
                            <Gift className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable Candidate Detail Modal */}
      {selectedApp && (
        <CandidateDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedApp(null);
          }}
          application={selectedApp}
          onScheduleInterview={(candidateOrApp) => {
            setIsDetailModalOpen(false);
            handleOpenInterviewModal(selectedApp);
          }}
          onExtendOffer={(candidateOrApp) => {
            setIsDetailModalOpen(false);
            handleOpenOfferModal(selectedApp);
          }}
        />
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && targetAppForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Schedule Interview Round
                </h3>
                <p className="text-xs text-gray-500">
                  Candidate: <span className="font-bold text-gray-900 dark:text-white">{targetAppForInterview.studentName}</span>
                </p>
              </div>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitInterview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Interview Round Title
                </label>
                <input
                  type="text"
                  value={interviewForm.roundName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interviewForm.scheduledDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={interviewForm.scheduledTime}
                    onChange={(e) => setInterviewForm({ ...interviewForm, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Video Meeting Platform
                  </label>
                  <select
                    value={interviewForm.mode}
                    onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom Video</option>
                    <option value="MS Teams">Microsoft Teams</option>
                    <option value="On-Campus">On-Campus Room</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Meeting Link / Venue
                  </label>
                  <input
                    type="text"
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lead Interviewer
                </label>
                <input
                  type="text"
                  value={interviewForm.interviewerName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Preparation Rubric & Notes for Candidate
                </label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  Confirm & Dispatch Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Offer Modal */}
      {isOfferModalOpen && targetAppForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-500" />
                  Extend Official Job Offer
                </h3>
                <p className="text-xs text-gray-500">
                  Recipient: <span className="font-bold text-gray-900 dark:text-white">{targetAppForOffer.studentName}</span>
                </p>
              </div>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Designated Role Title
                </label>
                <input
                  type="text"
                  value={offerForm.jobTitle}
                  onChange={(e) => setOfferForm({ ...offerForm, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Annual Package (CTC) / Stipend
                  </label>
                  <input
                    type="text"
                    value={offerForm.ctcOrStipend}
                    onChange={(e) => setOfferForm({ ...offerForm, ctcOrStipend: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Joining / Sign-on Bonus
                  </label>
                  <input
                    type="text"
                    value={offerForm.joiningBonus}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningBonus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Joining Start Date
                  </label>
                  <input
                    type="date"
                    value={offerForm.joiningDate}
                    onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Offer Acceptance Deadline
                  </label>
                  <input
                    type="date"
                    value={offerForm.expiryDate}
                    onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location & Work Arrangement
                </label>
                <input
                  type="text"
                  value={offerForm.location}
                  onChange={(e) => setOfferForm({ ...offerForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  Issue Official Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
