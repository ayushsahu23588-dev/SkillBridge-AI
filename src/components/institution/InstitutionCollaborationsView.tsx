import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionCollaborationItem } from '../../types';
import {
  Building2,
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Clock,
  X,
} from 'lucide-react';

interface InstitutionCollaborationsViewProps {
  onOpenAddCollab: () => void;
}

export const InstitutionCollaborationsView: React.FC<InstitutionCollaborationsViewProps> = ({
  onOpenAddCollab,
}) => {
  const {
    institutionCollaborations,
    updateInstitutionCollaboration,
    isDarkMode,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedCollab, setSelectedCollab] = useState<InstitutionCollaborationItem | null>(null);
  const [isMouDocModalOpen, setIsMouDocModalOpen] = useState(false);

  const filteredCollaborations = institutionCollaborations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      c.industry.toLowerCase().includes(q) ||
      (c.department && c.department.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q));

    const matchType = typeFilter === 'All' || c.collaborationType === typeFilter;
    return matchSearch && matchType;
  });

  const handleStatusChange = (
    id: string,
    newStatus: 'Active' | 'Proposed' | 'Completed'
  ) => {
    updateInstitutionCollaboration(id, { status: newStatus });
    showToast(`Updated collaboration MoU status to ${newStatus}`, 'success');
  };

  const types = [
    'All',
    'Internship Partner',
    'Research Collaboration',
    'Industrial Training',
    'Consultancy',
    'Curriculum Advisory',
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            <span>Industry-Academia Collaboration & Corporate MoUs</span>
          </h2>
          <p className="text-xs text-gray-400">
            Institutional agreements with leading corporate enterprises for internships, research grants, and curriculum co-design.
          </p>
        </div>

        <button
          onClick={onOpenAddCollab}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New MoU</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 transition-all ${
          isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
        }`}
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partnerships by corporate name, department, or scope..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-purple-500 transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs outline-none cursor-pointer ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Collaboration Types' : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Collaborations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollaborations.map((collab) => (
          <div
            key={collab.id}
            onClick={() => setSelectedCollab(collab)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-purple-400/50 hover:scale-[1.01] flex flex-col justify-between ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-bold text-[10px] uppercase">
                  {collab.collaborationType}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    collab.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : collab.status === 'Proposed'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-400'
                  }`}
                >
                  {collab.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                {collab.industry}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                Branch: <strong className="text-gray-900 dark:text-white">{collab.department}</strong>
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">
                {collab.description || 'Formal institutional collaboration for shared labs and student placements.'}
              </p>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Duration</span>
                  <span className="font-semibold">{collab.startDate} — {collab.endDate || 'Ongoing'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Beneficiary Cohort</span>
                  <span className="font-bold text-purple-400">{collab.studentsInvolved || collab.studentsBenefited || 50} Students</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCollab(collab);
                  setIsMouDocModalOpen(true);
                }}
                className="text-purple-500 hover:text-purple-400 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Signed MoU</span>
              </button>

              <span className="text-gray-400 text-[11px]">
                Faculty Lead: {collab.leadFaculty || collab.facultyCoordinator || 'Dept HOD'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MoU Document Viewer Modal */}
      {isMouDocModalOpen && selectedCollab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`max-w-xl w-full rounded-2xl p-6 border shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-base font-bold">Memorandum of Understanding (MoU)</h3>
                  <p className="text-xs text-gray-400">Official Institutional Repository Document</p>
                </div>
              </div>
              <button
                onClick={() => setIsMouDocModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-3 text-xs leading-relaxed">
              <div className="text-center font-bold pb-2 border-b border-gray-200 dark:border-white/10 uppercase tracking-wider text-purple-400">
                Apex National Institute of Technology & {selectedCollab.industry}
              </div>

              <p>
                <strong>Partnership Scope:</strong> This Memorandum formalizes the mutual collaboration between Apex Institute and {selectedCollab.industry} under the scope of <em>{selectedCollab.collaborationType}</em>.
              </p>

              <p>
                <strong>Academic Disciplines:</strong> Primary affiliation with the Department of {selectedCollab.department}, accommodating an estimated annual cohort of {selectedCollab.studentsInvolved || 50} undergraduate and postgraduate scholars.
              </p>

              <p>
                <strong>Validity Period:</strong> Executed from {selectedCollab.startDate} through {selectedCollab.endDate || '2028-12-31'}.
              </p>

              <div className="pt-3 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-gray-400 block">Institutional Signatory:</span>
                  <span className="font-bold">Director & Dean of Placements</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Corporate Signatory:</span>
                  <span className="font-bold">VP of Talent Acquisition, {selectedCollab.industry}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(selectedCollab.id, 'Active')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Activate MoU
                </button>
                <button
                  onClick={() => handleStatusChange(selectedCollab.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 text-xs font-medium cursor-pointer"
                >
                  Mark Completed
                </button>
              </div>

              <button
                onClick={() => setIsMouDocModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
