import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryOpportunity } from '../../types';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  XCircle,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Target,
  Layers,
  X,
  AlertTriangle,
} from 'lucide-react';

export const ManageOpportunitiesPage: React.FC = () => {
  const {
    industryOpportunities,
    updateOpportunity,
    deleteOpportunity,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'All' | 'Internships' | 'Jobs' | 'Projects' | 'Drafts' | 'Active' | 'Closed'
  >('All');

  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [viewingOpp, setViewingOpp] = useState<IndustryOpportunity | null>(null);
  const [editingOpp, setEditingOpp] = useState<IndustryOpportunity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Form fields
  const [editTitle, setEditTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editStipend, setEditStipend] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Closed' | 'Draft'>('Active');
  const [editSkills, setEditSkills] = useState('');

  const openEditModal = (opp: IndustryOpportunity) => {
    setEditingOpp(opp);
    setEditTitle(opp.title);
    setEditDepartment(opp.department);
    setEditStipend(opp.stipendOrSalary);
    setEditDeadline(opp.deadline);
    setEditStatus(opp.status);
    setEditSkills(opp.requiredSkills.join(', '));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp) return;

    updateOpportunity(editingOpp.id, {
      title: editTitle,
      department: editDepartment,
      stipendOrSalary: editStipend,
      deadline: editDeadline,
      status: editStatus,
      requiredSkills: editSkills.split(',').map((s) => s.trim()).filter(Boolean),
    });

    showToast(`Opportunity "${editTitle}" updated successfully!`, 'success');
    setEditingOpp(null);
  };

  const handleCloseOpportunity = (opp: IndustryOpportunity) => {
    updateOpportunity(opp.id, { status: 'Closed' });
    showToast(`Applications closed for "${opp.title}".`, 'info');
  };

  const handleConfirmDelete = () => {
    if (!deletingId) return;
    deleteOpportunity(deletingId);
    showToast('Opportunity removed successfully.', 'success');
    setDeletingId(null);
  };

  // Filter logic
  const filteredOpportunities = industryOpportunities.filter((opp) => {
    // Search query
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === 'All') return true;
    if (activeTab === 'Internships') return opp.type === 'Internship';
    if (activeTab === 'Jobs') return opp.type === 'Job';
    if (activeTab === 'Projects') return opp.type === 'Project';
    if (activeTab === 'Drafts') return opp.status === 'Draft';
    if (activeTab === 'Active') return opp.status === 'Active';
    if (activeTab === 'Closed') return opp.status === 'Closed';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header & New Opportunity CTA Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Manage Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track, edit, close, and monitor applicant pipelines across your published campus roles.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/industry/post-internship')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Internship</span>
          </button>
          <button
            onClick={() => navigate('/industry/post-job')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Post Job</span>
          </button>
          <button
            onClick={() => navigate('/industry/post-project')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Post Project</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-2xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {(
              ['All', 'Internships', 'Jobs', 'Projects', 'Active', 'Drafts', 'Closed'] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {tab}
                <span className="ml-1.5 text-[10px] opacity-80">
                  {tab === 'All'
                    ? industryOpportunities.length
                    : tab === 'Internships'
                    ? industryOpportunities.filter((o) => o.type === 'Internship').length
                    : tab === 'Jobs'
                    ? industryOpportunities.filter((o) => o.type === 'Job').length
                    : tab === 'Projects'
                    ? industryOpportunities.filter((o) => o.type === 'Project').length
                    : tab === 'Active'
                    ? industryOpportunities.filter((o) => o.status === 'Active').length
                    : tab === 'Drafts'
                    ? industryOpportunities.filter((o) => o.status === 'Draft').length
                    : industryOpportunities.filter((o) => o.status === 'Closed').length}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roles, skills, or depts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Opportunities List / Table */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 shadow-xs overflow-hidden">
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Layers className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
            <div className="font-bold text-base text-gray-800 dark:text-gray-200">
              No opportunities found
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No postings match the selected filter or search query. Try changing the tab or create a new opportunity.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="py-3.5 px-4">Opportunity</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Posted Date</th>
                  <th className="py-3.5 px-3">Applications</th>
                  <th className="py-3.5 px-3">Deadline</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs">
                {filteredOpportunities.map((opp) => (
                  <tr
                    key={opp.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors">
                          {opp.title}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>{opp.department}</span>
                          <span>•</span>
                          <span>{opp.location}</span>
                          <span>•</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {opp.stipendOrSalary}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {opp.requiredSkills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[10px] text-gray-600 dark:text-gray-400"
                            >
                              {skill}
                            </span>
                          ))}
                          {opp.requiredSkills.length > 3 && (
                            <span className="text-[10px] text-gray-400">
                              +{opp.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          opp.type === 'Internship'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                            : opp.type === 'Job'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        }`}
                      >
                        {opp.type}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-gray-500 whitespace-nowrap">
                      {opp.postedDate}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-bold text-gray-900 dark:text-white tabular-nums">
                        {opp.applicationsCount}
                      </div>
                      <span className="text-[10px] text-gray-400">verified applicants</span>
                    </td>

                    <td className="py-4 px-3 text-gray-500 whitespace-nowrap">
                      {opp.deadline}
                    </td>

                    <td className="py-4 px-3 whitespace-nowrap">
                      {opp.status === 'Active' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : opp.status === 'Closed' ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400 border border-gray-300/40 flex items-center gap-1 w-fit">
                          <span>Applications Closed</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('/industry/candidates')}
                          title="Match Candidates with AI"
                          className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#D4F73C]" />
                          <span>Match</span>
                        </button>

                        <button
                          onClick={() => setViewingOpp(opp)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEditModal(opp)}
                          title="Edit Opportunity"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {opp.status === 'Active' && (
                          <button
                            onClick={() => handleCloseOpportunity(opp)}
                            title="Close Applications"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setDeletingId(opp.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
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
        )}
      </div>

      {/* View Opportunity Modal */}
      {viewingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/5 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {viewingOpp.type}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  {viewingOpp.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {viewingOpp.department} • {viewingOpp.location} • {viewingOpp.workMode}
                </p>
              </div>
              <button
                onClick={() => setViewingOpp(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">Overview</div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {viewingOpp.description}
                </p>
              </div>

              {viewingOpp.problemStatement && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20">
                  <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                    Problem Statement
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                    {viewingOpp.problemStatement}
                  </p>
                </div>
              )}

              {viewingOpp.responsibilities && viewingOpp.responsibilities.length > 0 && (
                <div>
                  <div className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Key Responsibilities
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
                    {viewingOpp.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Required Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {viewingOpp.requiredSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Stipend / CTC</div>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {viewingOpp.stipendOrSalary}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Duration</div>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {viewingOpp.duration}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Deadline</div>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {viewingOpp.deadline}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Applicants</div>
                  <div className="font-bold text-purple-600 mt-0.5">
                    {viewingOpp.applicationsCount} Students
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setViewingOpp(null)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewingOpp(null);
                  navigate('/industry/candidates');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find Matching Candidates</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit Opportunity Details
              </h3>
              <button
                onClick={() => setEditingOpp(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Stipend / CTC
                  </label>
                  <input
                    type="text"
                    required
                    value={editStipend}
                    onChange={(e) => setEditStipend(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="Active">Active (Accepting Applications)</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed (Applications Closed)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Required Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Delete Opportunity?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Are you sure you want to remove this role? All associated student applicant pipelines will be unlinked.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
