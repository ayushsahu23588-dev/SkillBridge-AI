import React from 'react';
import { InstitutionCollaborationItem } from '../../types';
import { X, Building2, Calendar, FileText, CheckCircle2, ShieldCheck, Download, ExternalLink } from 'lucide-react';

interface ViewMouModalProps {
  collab: InstitutionCollaborationItem | null;
  onClose: () => void;
}

export const ViewMouModal: React.FC<ViewMouModalProps> = ({ collab, onClose }) => {
  if (!collab) return null;

  return (
    <div
      id="view-mou-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="view-mou-modal-content"
        className="w-full max-w-lg bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={collab.industryLogo}
              alt={collab.industry}
              className="w-10 h-10 rounded-xl object-cover border border-gray-200 dark:border-white/10"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {collab.industry}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-xs text-gray-500">{collab.collaborationType} Agreement</span>
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
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Status: {collab.status} Legal MoU</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">
              NAAC Criteria 3.4 Validated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">DEPARTMENT</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{collab.department}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">FACULTY LEAD</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">{collab.leadFaculty}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">VALIDITY WINDOW</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {collab.startDate} to {collab.endDate}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/5">
              <span className="text-[10px] text-gray-400 block font-semibold">BENEFICIARIES</span>
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {collab.studentsBenefited} Students & Faculty
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase mb-1">
              Agreed Scope & Deliverables
            </span>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200/60 dark:border-white/5">
              {collab.description}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">Document ID: SB-MOU-{collab.id}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(collab.mouDocumentUrl || '#', '_blank')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
