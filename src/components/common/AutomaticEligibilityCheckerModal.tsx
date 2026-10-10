import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, StudentProfile, StudentEligibilityCheckResult } from '../../types';
import { skillBridgeEngine } from '../../services/skillBridgeIntelligenceEngine';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Award,
  Sparkles,
  X,
  Send,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface AutomaticEligibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting;
  customProfile?: StudentProfile;
  onApplyDirectly?: () => void;
}

export const AutomaticEligibilityCheckerModal: React.FC<AutomaticEligibilityCheckerModalProps> = ({
  isOpen,
  onClose,
  job,
  customProfile,
  onApplyDirectly,
}) => {
  const { studentProfile, submitEligibilityWaiver, showToast } = useApp();
  const profileToEvaluate = customProfile || studentProfile;

  const [isWaiverFormOpen, setIsWaiverFormOpen] = useState(false);
  const [waiverReason, setWaiverReason] = useState('');

  if (!isOpen) return null;

  const eligibilityResult: StudentEligibilityCheckResult = skillBridgeEngine.evaluateStudentEligibility(
    profileToEvaluate,
    job
  );

  const handleSendWaiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waiverReason.trim()) {
      showToast('Please describe the justification for the eligibility waiver.', 'warning');
      return;
    }

    submitEligibilityWaiver({
      studentId: profileToEvaluate.id,
      studentName: profileToEvaluate.name,
      studentEmail: profileToEvaluate.email,
      studentDepartment: profileToEvaluate.department,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      reason: waiverReason.trim(),
    });

    setIsWaiverFormOpen(false);
    setWaiverReason('');
  };

  const getStatusBadge = () => {
    switch (eligibilityResult.overallStatus) {
      case 'ELIGIBLE':
        return {
          label: 'Eligible to Apply',
          color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
        };
      case 'PARTIALLY_ELIGIBLE':
        return {
          label: 'Special Waiver Applicable',
          color: 'text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        };
      case 'NOT_ELIGIBLE':
      default:
        return {
          label: 'Criteria Not Met',
          color: 'text-rose-700 dark:text-rose-300 bg-rose-500/15 border-rose-500/30',
          icon: <XCircle className="w-4 h-4 text-rose-500" />,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white dark:bg-[#181920] w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Automated Eligibility Checker
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.color}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Evaluating {profileToEvaluate.name} against {job.companyName} – {job.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Match Percentage & Summary Banner */}
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Automated Compliance Score
            </span>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
              {eligibilityResult.matchScore}% Criteria Satisfied
            </div>
          </div>

          <div className="text-xs text-gray-600 dark:text-gray-300 max-w-sm">
            {eligibilityResult.overallStatus === 'ELIGIBLE' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                You meet 100% of the academic requirements and institutional policies for this drive.
              </span>
            ) : eligibilityResult.overallStatus === 'PARTIALLY_ELIGIBLE' ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                You have minor variance in requirements, but qualify to request an official Head of Placement Cell waiver.
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                One or more hard constraints (such as graduation batch or permitted disciplines) are not met.
              </span>
            )}
          </div>
        </div>

        {/* Itemized Criteria Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Itemized Placement Criteria Breakdown
          </h4>

          <div className="space-y-2.5">
            {eligibilityResult.criteria.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {c.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {c.criterion}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 pl-6 leading-relaxed">
                    {c.notes}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 block font-bold">Your Status</span>
                  <span
                    className={`font-bold ${
                      c.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {c.studentValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiver Request Trigger / Form */}
        {eligibilityResult.waiverApplicable && !isWaiverFormOpen && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-bold text-amber-800 dark:text-amber-300">
                Special Eligibility Waiver Eligible
              </h5>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                You can petition the placement directorate with your verified certifications or capstone project evidence.
              </p>
            </div>
            <button
              onClick={() => setIsWaiverFormOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-colors"
            >
              Request Waiver
            </button>
          </div>
        )}

        {isWaiverFormOpen && (
          <form
            onSubmit={handleSendWaiver}
            className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-indigo-500/30 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Eligibility Waiver Petition</span>
              </h5>
              <button
                type="button"
                onClick={() => setIsWaiverFormOpen(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            <textarea
              required
              rows={3}
              placeholder="State your justification (e.g. recent A+ in core subject, certified AWS architect, hackathon finalist)..."
              value={waiverReason}
              onChange={(e) => setWaiverReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Placement Directorate</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs cursor-pointer"
          >
            Close
          </button>

          {eligibilityResult.overallStatus === 'ELIGIBLE' && onApplyDirectly && (
            <button
              onClick={() => {
                onClose();
                onApplyDirectly();
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Proceed to Instant Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
