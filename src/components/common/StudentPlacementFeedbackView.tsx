import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentPlacementFeedback, RecruiterFeedbackItem } from '../../types';
import { skillBridgeEngine } from '../../services/skillBridgeIntelligenceEngine';
import {
  MessageSquare,
  Sparkles,
  Award,
  Search,
  Filter,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Star,
  HelpCircle,
  X,
  Target,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  Send,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export const StudentPlacementFeedbackView: React.FC = () => {
  const { studentFeedbackList, addStudentFeedback, studentProfile, showToast, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'personal' | 'structured'>('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State for Structured Drive Feedback
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [driveExperienceRating, setDriveExperienceRating] = useState(5);
  const [oaInfrastructureRating, setOaInfrastructureRating] = useState(4);
  const [recruiterCoordinationRating, setRecruiterCoordinationRating] = useState(5);
  const [selectionOutcome, setSelectionOutcome] = useState<StudentPlacementFeedback['selectionOutcome']>('Selected');
  const [feedbackSummary, setFeedbackSummary] = useState('');
  const [placementCellSuggestions, setPlacementCellSuggestions] = useState('');
  const [offeredPackage, setOfferedPackage] = useState('');

  // Personal interview feedback list from corporate recruiters and mock trainers
  const personalFeedbackList: RecruiterFeedbackItem[] = useMemo(() => {
    return skillBridgeEngine.getRecruiterFeedbackList();
  }, []);

  const filteredPersonalFeedback = useMemo(() => {
    return personalFeedbackList.filter((fb) => {
      const q = searchQuery.toLowerCase();
      return (
        fb.companyName.toLowerCase().includes(q) ||
        fb.roleTitle.toLowerCase().includes(q) ||
        fb.roundName.toLowerCase().includes(q) ||
        fb.constructiveComments.toLowerCase().includes(q)
      );
    });
  }, [personalFeedbackList, searchQuery]);

  const filteredStructuredFeedback = useMemo(() => {
    return studentFeedbackList.filter((fb) => {
      const q = searchQuery.toLowerCase();
      return (
        fb.companyName.toLowerCase().includes(q) ||
        fb.roleTitle.toLowerCase().includes(q) ||
        fb.experienceSummary.toLowerCase().includes(q)
      );
    });
  }, [studentFeedbackList, searchQuery]);

  const handleSubmitStructuredFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) {
      showToast('Please provide both company name and role title.', 'warning');
      return;
    }

    addStudentFeedback({
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      studentDepartment: studentProfile.department,
      studentAvatar: studentProfile.avatar,
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      driveDate: new Date().toISOString().slice(0, 10),
      selectionOutcome,
      oaDifficulty: oaInfrastructureRating,
      techDifficulty: driveExperienceRating,
      hrDifficulty: recruiterCoordinationRating,
      questionsAsked: [
        `Drive Coordination Score: ${recruiterCoordinationRating}/5`,
        `Testing Platform Score: ${oaInfrastructureRating}/5`,
      ],
      keyTopicsTested: ['Core Engineering Fundamentals', 'Analytical Aptitude'],
      experienceSummary: feedbackSummary.trim(),
      preparationAdvice: placementCellSuggestions.trim(),
      packageOfferedLpa: offeredPackage ? parseFloat(offeredPackage) : undefined,
    });

    setIsSubmitModalOpen(false);
    setCompanyName('');
    setRoleTitle('');
    setFeedbackSummary('');
    setPlacementCellSuggestions('');
    setOfferedPackage('');
    showToast('Structured drive feedback recorded successfully for the Placement Cell.', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <MessageSquare className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Performance Evaluation & Placement Feedback</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Personal Interview Feedback & Structured Placement Feedback
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Review confidential, verified interviewer ratings on your technical and HR rounds, identify precise strengths and growth areas, and submit structured feedback on campus recruitment drives.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#D4F73C] hover:bg-[#c7eb34] text-black font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Drive Feedback</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Personal Interview Feedback vs Structured Placement Feedback */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            Personal Interview Feedback ({personalFeedbackList.length})
          </button>
          <button
            onClick={() => setActiveTab('structured')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'structured'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            Structured Drive Feedback ({studentFeedbackList.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-semibold outline-none"
          />
        </div>
      </div>

      {/* Tab 1: Personal Interview Feedback */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          {filteredPersonalFeedback.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 space-y-3">
              <UserCheck className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">No personal interview feedback records found</h3>
              <p className="text-xs text-gray-500">Recruiter evaluations and mock interview debriefs will appear here automatically.</p>
            </div>
          ) : (
            filteredPersonalFeedback.map((fb) => (
              <div
                key={fb.id}
                className="rounded-3xl bg-white dark:bg-[#15161D] border border-gray-200 dark:border-white/10 p-6 shadow-sm space-y-5"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        {fb.companyName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {fb.hiringDecision}
                      </span>
                      <span className="text-xs text-gray-400">• {fb.submittedDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                      {fb.roleTitle}
                    </h3>
                    <p className="text-xs text-gray-500">{fb.roundName}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 bg-gray-50 dark:bg-white/5 px-3.5 py-2 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Overall Score:</span>
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                      {fb.overallScore} / 100
                    </span>
                  </div>
                </div>

                {/* 4 Dimension Ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-gray-400 block text-[10px] font-bold">Technical Competency</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                      {fb.technicalRating} / 5.0
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-gray-400 block text-[10px] font-bold">Problem Solving & DSA</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                      {fb.problemSolvingRating} / 5.0
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-gray-400 block text-[10px] font-bold">Communication Clarity</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {fb.communicationRating} / 5.0
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <span className="text-gray-400 block text-[10px] font-bold">Cultural Alignment</span>
                    <span className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
                      {fb.culturalFitRating} / 5.0
                    </span>
                  </div>
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Demonstrated Strengths</span>
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                      {fb.keyStrengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 space-y-2">
                    <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Areas for Continued Improvement</span>
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                      {fb.growthAreas.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evaluator Notes */}
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">
                    Interviewer Constructive Remarks
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    &quot;{fb.constructiveComments}&quot;
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Structured Placement Feedback */}
      {activeTab === 'structured' && (
        <div className="space-y-4">
          {filteredStructuredFeedback.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 space-y-3">
              <MessageSquare className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">No structured placement feedback submitted yet</h3>
              <p className="text-xs text-gray-500">Submit your feedback on completed recruitment drives using the button above.</p>
            </div>
          ) : (
            filteredStructuredFeedback.map((fb) => (
              <div
                key={fb.id}
                className="rounded-3xl bg-white dark:bg-[#15161D] border border-gray-200 dark:border-white/10 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {fb.companyName}
                      </h3>
                      <span className="text-xs text-gray-400">• {fb.roleTitle}</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      Logged by {fb.studentName} on {fb.driveDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Outcome: {fb.selectionOutcome}
                    </span>
                    {fb.packageOfferedLpa && (
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-xs">
                        ₹{fb.packageOfferedLpa} LPA
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 text-xs text-center">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold">Drive Organization</span>
                    <span className="font-black text-purple-600 dark:text-purple-400">{fb.oaDifficulty} / 5</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold">Test Infrastructure</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400">{fb.techDifficulty} / 5</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold">Recruiter Coordination</span>
                    <span className="font-black text-amber-600 dark:text-amber-400">{fb.hrDifficulty} / 5</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-100 dark:border-white/5">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                      Drive Experience Summary
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {fb.experienceSummary}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                      Feedback for Placement Cell
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {fb.preparationAdvice}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Structured Drive Feedback Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitStructuredFeedback}
            className="bg-white dark:bg-[#181920] w-full max-w-lg rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <span>Submit Structured Drive Feedback</span>
                </h3>
                <p className="text-xs text-gray-500">Provide official feedback to the Central Placement Cell.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google India"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer L3"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Drive Selection Outcome</label>
                  <select
                    value={selectionOutcome}
                    onChange={(e) => setSelectionOutcome(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    <option value="Selected">Selected / Offer Made</option>
                    <option value="Final Round Reached">Final Interview Round Reached</option>
                    <option value="Technical Round Reached">Technical Round Reached</option>
                    <option value="Eliminated in OA">Eliminated in Online Test</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Package Offered (₹ LPA, optional)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 18.5"
                    value={offeredPackage}
                    onChange={(e) => setOfferedPackage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Drive Organization</label>
                  <select
                    value={driveExperienceRating}
                    onChange={(e) => setDriveExperienceRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} / 5 Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">OA Infrastructure</label>
                  <select
                    value={oaInfrastructureRating}
                    onChange={(e) => setOaInfrastructureRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} / 5 Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-bold">Coordination</label>
                  <select
                    value={recruiterCoordinationRating}
                    onChange={(e) => setRecruiterCoordinationRating(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} / 5 Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Drive Experience & Process Feedback</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of test structure, question difficulty, and interview transparency..."
                  value={feedbackSummary}
                  onChange={(e) => setFeedbackSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Recommendations for Placement Cell</label>
                <textarea
                  rows={2}
                  placeholder="Suggestions regarding scheduling, lab facilities, or recruiter expectations..."
                  value={placementCellSuggestions}
                  onChange={(e) => setPlacementCellSuggestions(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
