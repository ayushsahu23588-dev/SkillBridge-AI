import React, { useState } from 'react';
import { AdminApplicationItem } from '../../types';
import { X, User, Briefcase, Calendar, CheckCircle2, Star, Sparkles, Building2 } from 'lucide-react';

interface AdminApplicationModalProps {
  application: AdminApplicationItem | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: AdminApplicationItem['status']) => void;
}

export const AdminApplicationModal: React.FC<AdminApplicationModalProps> = ({
  application,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AdminApplicationItem['status']>(
    application?.status || 'Applied'
  );

  if (!application) return null;

  const handleSave = () => {
    onUpdateStatus(application.id, selectedStatus);
    onClose();
  };

  return (
    <div
      id="admin-application-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="admin-application-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Application Dossier
            </span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
              {application.opportunityTitle}
            </h3>
            <p className="text-xs text-gray-500">{application.company}</p>
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
              <span className="text-[10px] text-gray-400 block font-semibold">CANDIDATE</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{application.studentName}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">AI MATCH FIT</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-bold text-blue-600 text-sm">{application.matchScore}%</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">APPLIED DATE</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{application.appliedDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">CURRENT STATUS</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{application.status}</span>
            </div>
          </div>

          {/* Admin Override Status */}
          <div>
            <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
              Administrative Status Override
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AdminApplicationItem['status'])}
              className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium outline-hidden"
            >
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Scheduled</option>
              <option value="Selected">Selected / Offer Made</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Update Application
          </button>
        </div>
      </div>
    </div>
  );
};
