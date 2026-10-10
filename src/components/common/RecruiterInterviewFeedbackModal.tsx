import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecruiterFeedbackItem } from '../../types';
import {
  MessageSquare,
  Sparkles,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Send,
  Building2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface RecruiterInterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedback?: RecruiterFeedbackItem | null;
  mode?: 'view' | 'submit';
  candidateName?: string;
  roleTitle?: string;
  companyName?: string;
  onSubmitFeedback?: (feedback: RecruiterFeedbackItem) => void;
}

export const RecruiterInterviewFeedbackModal: React.FC<RecruiterInterviewFeedbackModalProps> = ({
  isOpen,
  onClose,
  feedback,
  mode = 'view',
  candidateName = 'Aarav Patel',
  roleTitle = 'Associate Software Engineer',
  companyName = 'NovaCloud Systems',
  onSubmitFeedback,
}) => {
  const { showToast } = useApp();

  const [techRating, setTechRating] = useState<number>(feedback?.technicalRating || 5);
  const [psRating, setPsRating] = useState<number>(feedback?.problemSolvingRating || 4);
  const [commRating, setCommRating] = useState<number>(feedback?.communicationRating || 5);
  const [cultureRating, setCultureRating] = useState<number>(feedback?.culturalFitRating || 5);
  const [decision, setDecision] = useState<'Strong Hire' | 'Hire' | 'Need Improvement' | 'Reject'>(
    feedback?.hiringDecision || 'Strong Hire'
  );
  const [comments, setComments] = useState<string>(
    feedback?.constructiveComments ||
      'Candidate showed exceptional depth in distributed caching and clean TypeScript architecture. Highly recommend for full-time absorption.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback: RecruiterFeedbackItem = {
      id: `fb_${Date.now()}`,
      applicationId: feedback?.applicationId || 'app_1',
      candidateName,
      companyName,
      roleTitle,
      roundName: 'Technical & System Architecture Round',
      technicalRating: techRating,
      problemSolvingRating: psRating,
      communicationRating: commRating,
      culturalFitRating: cultureRating,
      overallScore: Math.round(((techRating + psRating + commRating + cultureRating) / 20) * 100),
      hiringDecision: decision,
      keyStrengths: [
        'Strong system design and API microservice concepts.',
        'Clear articulation of algorithmic trade-offs.',
      ],
      growthAreas: [
        'Explore distributed consensus protocols (Raft/Paxos).',
      ],
      constructiveComments: comments,
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    if (onSubmitFeedback) onSubmitFeedback(newFeedback);
    showToast(`Interview feedback submitted for ${candidateName}!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 text-gray-900 dark:text-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                Post-Interview Assessment
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === 'view' ? 'Recruiter Interview Feedback' : 'Submit Candidate Evaluation'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {candidateName} • {roleTitle} ({companyName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'view' && feedback ? (
          /* View Mode for Student & Placement Officer */
          <div className="space-y-4">
            {/* Score & Decision Pill */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Overall Evaluation</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {feedback.overallScore} / 100
                </div>
              </div>

              <span
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs ${
                  feedback.hiringDecision === 'Strong Hire' || feedback.hiringDecision === 'Hire'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                Recommendation: {feedback.hiringDecision}
              </span>
            </div>

            {/* 4 Ratings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">Technical Depth</span>
                <span className="font-bold text-sm text-yellow-500">★ {feedback.technicalRating} / 5</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">Problem Solving</span>
                <span className="font-bold text-sm text-yellow-500">★ {feedback.problemSolvingRating} / 5</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">Communication</span>
                <span className="font-bold text-sm text-yellow-500">★ {feedback.communicationRating} / 5</span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block">Culture Alignment</span>
                <span className="font-bold text-sm text-yellow-500">★ {feedback.culturalFitRating} / 5</span>
              </div>
            </div>

            {/* Strengths & Growth Areas */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Key Strengths Observed:
                </span>
                <div className="space-y-1">
                  {feedback.keyStrengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1.5">
                  Recommended Growth Areas:
                </span>
                <div className="space-y-1">
                  {feedback.growthAreas.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recruiter Comments */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Recruiter Detailed Commentary:
              </span>
              <p className="leading-relaxed text-gray-700 dark:text-gray-200 italic">
                "{feedback.constructiveComments}"
              </p>
            </div>
          </div>
        ) : (
          /* Submission Mode for Recruiters */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Technical Stack Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={techRating}
                  onChange={(e) => setTechRating(parseFloat(e.target.value) || 5)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Problem Solving Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={psRating}
                  onChange={(e) => setPsRating(parseFloat(e.target.value) || 4)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Communication Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.5"
                  value={commRating}
                  onChange={(e) => setCommRating(parseFloat(e.target.value) || 5)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Hiring Decision</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-bold"
                >
                  <option value="Strong Hire">Strong Hire</option>
                  <option value="Hire">Hire</option>
                  <option value="Need Improvement">Need Improvement</option>
                  <option value="Reject">Reject</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Constructive Feedback Notes</label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Detail technical strengths, missing competencies, and suggestions to help the student improve..."
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D4F73C] text-[#111216] text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Candidate Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
