import React, { useState } from 'react';
import { AdminOpportunityItem } from '../../types';
import { X, Building2, Briefcase, Calendar, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface AdminOpportunityModalProps {
  opportunity: AdminOpportunityItem | null;
  onClose: () => void;
  onUpdateOpportunity: (id: string, updates: Partial<AdminOpportunityItem>) => void;
}

export const AdminOpportunityModal: React.FC<AdminOpportunityModalProps> = ({
  opportunity,
  onClose,
  onUpdateOpportunity,
}) => {
  const [moderationReason, setModerationReason] = useState('');

  if (!opportunity) return null;

  const handleStatusChange = (status: AdminOpportunityItem['status']) => {
    onUpdateOpportunity(opportunity.id, {
      status,
    });
    onClose();
  };

  return (
    <div
      id="admin-opportunity-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="admin-opportunity-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {opportunity.title}
              </h3>
              <p className="text-xs text-gray-500">
                {opportunity.provider} • {opportunity.type}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">PROVIDER</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{opportunity.provider}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">OPPORTUNITY TYPE</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{opportunity.type}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">DATE POSTED</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{opportunity.postedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">APPLICATIONS</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {opportunity.applicationsCount} Submissions
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block font-semibold mb-1">
              CURRENT MODERATION STATUS
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                opportunity.status === 'Active' || opportunity.status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : opportunity.status === 'Pending'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {opportunity.status}
            </span>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Moderation Reason / Action Feedback
            </label>
            <textarea
              rows={2}
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="e.g. Verified company accreditation and stipend standards..."
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden resize-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <button
            onClick={() => handleStatusChange('Closed')}
            className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer"
          >
            Close Listing
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusChange('Rejected')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
            >
              Reject Listing
            </button>
            <button
              onClick={() => handleStatusChange('Approved')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              Approve Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
