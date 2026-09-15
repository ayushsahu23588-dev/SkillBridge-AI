import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  ExternalLink,
  Plus,
  CheckCircle2,
  XCircle,
  FileEdit,
  Award,
  Sparkles,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyInterview } from '../../types';

export const InterviewSchedulingView: React.FC = () => {
  const {
    companyInterviews,
    scheduleCompanyInterview,
    updateCompanyInterview,
    jobs,
    candidatePool,
    currentCompany,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Scheduled' | 'Completed' | 'Cancelled'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Schedule Interview Modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [newInterview, setNewInterview] = useState({
    studentId: candidatePool[0]?.id || 'cand_1',
    studentName: candidatePool[0]?.name || 'Aarav Patel',
    studentEmail: candidatePool[0]?.email || 'aarav.patel@student.apex.edu',
    studentAvatar: candidatePool[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    jobId: jobs[0]?.id || 'job_1',
    jobTitle: jobs[0]?.title || 'Distributed Cloud Systems Engineer',
    roundName: 'Technical Architecture Round 1',
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    scheduledTime: '14:00 PST',
    durationMinutes: 60,
    interviewerName: 'Sophia Sterling (Principal Architect)',
    interviewerEmail: 'sophia.s@novacloud.io',
    meetingLink: 'https://meet.google.com/nvc-eval-sync',
    mode: 'Google Meet' as 'Google Meet' | 'Zoom' | 'MS Teams' | 'On-Campus',
    notes: 'Focus on distributed consensus protocols, SQL indexes, and Redis caching topologies.',
  });

  // Evaluate / Feedback Modal
  const [isEvaluateOpen, setIsEvaluateOpen] = useState(false);
  const [targetInterviewForEval, setTargetInterviewForEval] = useState<CompanyInterview | null>(null);
  const [evalScore, setEvalScore] = useState<number>(88);
  const [evalNotes, setEvalNotes] = useState<string>('Strong algorithmic intuition; clearly articulated partition tolerance trade-offs.');
  const [evalRecommendation, setEvalRecommendation] = useState<'Proceed to Next Round' | 'Extend Formal Offer' | 'Decline'>('Extend Formal Offer');

  const filteredInterviews = companyInterviews.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roundName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleCompanyInterview({
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      studentId: newInterview.studentId,
      studentName: newInterview.studentName,
      studentEmail: newInterview.studentEmail,
      studentAvatar: newInterview.studentAvatar,
      jobId: newInterview.jobId,
      jobTitle: newInterview.jobTitle,
      roundName: newInterview.roundName,
      scheduledDate: newInterview.scheduledDate,
      scheduledTime: newInterview.scheduledTime,
      durationMinutes: newInterview.durationMinutes,
      interviewerName: newInterview.interviewerName,
      interviewerEmail: newInterview.interviewerEmail,
      meetingLink: newInterview.meetingLink,
      status: 'Scheduled',
      mode: newInterview.mode,
      notes: newInterview.notes,
    });
    setIsScheduleOpen(false);
  };

  const handleOpenEvaluate = (interview: CompanyInterview) => {
    setTargetInterviewForEval(interview);
    setEvalScore(interview.score || 88);
    setEvalNotes(interview.feedbackNotes || 'Solid technical performance during live coding.');
    setIsEvaluateOpen(true);
  };

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInterviewForEval) return;
    updateCompanyInterview(targetInterviewForEval.id, {
      status: 'Completed',
      score: evalScore,
      feedbackNotes: evalNotes,
    });
    setIsEvaluateOpen(false);
    setTargetInterviewForEval(null);
    showToast(`Evaluation recorded for ${targetInterviewForEval.studentName}! Score: ${evalScore}/100.`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            Live Interview Management & Rubric
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Technical Interview Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Coordinate synchronous technical interviews, join encrypted meeting rooms, and record standardized candidate evaluation scorecards.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidate name, interviewer, or round..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-900 dark:text-white shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'Scheduled', 'Completed', 'Cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInterviews.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between hover:border-purple-500/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={item.studentAvatar}
                    alt={item.studentName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.studentName}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {item.jobTitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                    item.status === 'Scheduled'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : item.status === 'Completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-gray-900 dark:text-white">
                  <span>{item.roundName}</span>
                  <span className="text-gray-500 font-mono text-[11px]">{item.durationMinutes} mins</span>
                </div>

                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3 text-purple-500" />
                    {item.scheduledDate} @ {item.scheduledTime}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-purple-600 dark:text-purple-400">
                    <Video className="w-3 h-3" />
                    {item.mode}
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 dark:text-gray-300">
                  Lead Evaluator: <span className="font-semibold text-gray-900 dark:text-white">{item.interviewerName}</span>
                </div>
              </div>

              {item.notes && (
                <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-2">
                  Notes: "{item.notes}"
                </p>
              )}

              {item.score && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                    Recorded Rubric Score:
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.score} / 100
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <a
                href={item.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Meeting</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEvaluate(item)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Scorecard & Feedback</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Interview Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-purple-500" />
                  Schedule Candidate Interview
                </h3>
                <p className="text-xs text-gray-500">
                  Direct integration with candidate calendar and automated email notifications
                </p>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInterview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Target Candidate
                </label>
                <select
                  value={newInterview.studentId}
                  onChange={(e) => {
                    const c = candidatePool.find((cand) => cand.id === e.target.value);
                    if (c) {
                      setNewInterview({
                        ...newInterview,
                        studentId: c.id,
                        studentName: c.name,
                        studentEmail: c.email,
                        studentAvatar: c.avatar,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  {candidatePool.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.department} - {c.college})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Job Opening
                </label>
                <select
                  value={newInterview.jobId}
                  onChange={(e) => {
                    const j = jobs.find((job) => job.id === e.target.value);
                    if (j) {
                      setNewInterview({
                        ...newInterview,
                        jobId: j.id,
                        jobTitle: j.title,
                      });
                    }
                  }}
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
                  Interview Round Name
                </label>
                <input
                  type="text"
                  value={newInterview.roundName}
                  onChange={(e) => setNewInterview({ ...newInterview, roundName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newInterview.scheduledDate}
                    onChange={(e) => setNewInterview({ ...newInterview, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={newInterview.scheduledTime}
                    onChange={(e) => setNewInterview({ ...newInterview, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Mode</label>
                  <select
                    value={newInterview.mode}
                    onChange={(e) => setNewInterview({ ...newInterview, mode: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="MS Teams">MS Teams</option>
                    <option value="On-Campus">On-Campus Room</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Meeting Link</label>
                  <input
                    type="text"
                    value={newInterview.meetingLink}
                    onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={newInterview.interviewerName}
                  onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-500/20"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scorecard Evaluation Modal */}
      {isEvaluateOpen && targetInterviewForEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Candidate Scorecard & Rubric
                </h3>
                <p className="text-xs text-gray-500">
                  Evaluating {targetInterviewForEval.studentName} for {targetInterviewForEval.roundName}
                </p>
              </div>
              <button
                onClick={() => setIsEvaluateOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">
                    Overall Technical Rating (1 - 100)
                  </label>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">
                    {evalScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Hiring Recommendation
                </label>
                <select
                  value={evalRecommendation}
                  onChange={(e) => setEvalRecommendation(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Extend Formal Offer">Strong Hire - Extend Formal Offer</option>
                  <option value="Proceed to Next Round">Hire - Proceed to Final System Design Round</option>
                  <option value="Decline">No Hire - Decline Application</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Evaluator Detailed Qualitative Feedback
                </label>
                <textarea
                  rows={4}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEvaluateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20"
                >
                  Submit Final Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
