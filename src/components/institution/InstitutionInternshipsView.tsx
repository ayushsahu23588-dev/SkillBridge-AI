import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Plus,
  Calendar,
  DollarSign,
  Users,
  Check,
  X,
  ChevronRight,
  Download,
} from 'lucide-react';

export const InstitutionInternshipsView: React.FC = () => {
  const { jobs, institutionStudents, isDarkMode, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState<any | null>(null);

  // Filter only internships
  const allInternships = useMemo(() => {
    return jobs.filter((j) => j.type === 'Internship');
  }, [jobs]);

  // Aggregate student internship participation
  const activeStudentsInInternship = institutionStudents.filter(
    (s) => s.internshipStatus === 'In Internship'
  );
  const completedInternships = institutionStudents.filter(
    (s) => s.internshipStatus === 'Completed'
  );
  const seekingApprovals = 14;

  const filteredInternships = useMemo(() => {
    return allInternships.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.requiredSkills &&
          item.requiredSkills.some((s) => s.toLowerCase().includes(q)));

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && item.status === 'Active') ||
        (statusFilter === 'Pending' && item.status !== 'Active');

      return matchSearch && matchStatus;
    });
  }, [allInternships, searchQuery, statusFilter]);

  const handleApproveDrive = (driveTitle: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    showToast(`Approved campus internship drive: "${driveTitle}" for all eligible students.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-500" />
            <span>Campus Internship Management Hub</span>
          </h2>
          <p className="text-xs text-gray-400">
            Authorize corporate internship listings, monitor student industrial placements, and approve experiential credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {activeStudentsInInternship.length} Students Currently On-site
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Listed Drives</span>
          <div className="text-2xl font-black">{allInternships.length}</div>
          <span className="text-[11px] text-gray-400">Industry Postings</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Active Interns</span>
          <div className="text-2xl font-black text-emerald-500">{activeStudentsInInternship.length}</div>
          <span className="text-[11px] text-emerald-400">Underway</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Completed</span>
          <div className="text-2xl font-black text-blue-500">{completedInternships.length}</div>
          <span className="text-[11px] text-blue-400">Verified Credits</span>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
          }`}
        >
          <span className="text-xs text-gray-400 font-semibold block mb-1">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-500">{seekingApprovals}</div>
          <span className="text-[11px] text-amber-400">TPO Sign-off Req.</span>
        </div>
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
            placeholder="Search internship drives by role, corporate sponsor, or required skills..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
              isDarkMode
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl text-xs">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'All'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Drives
          </button>
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'Active'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active Only
          </button>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-3">
        {filteredInternships.map((internship) => (
          <div
            key={internship.id}
            onClick={() => setSelectedInternship(internship)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:border-amber-400/50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDarkMode ? 'bg-[#18191E] border-white/5' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    {internship.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                    {internship.status || 'Active Drive'}
                  </span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {internship.companyName} • {internship.location || 'Hybrid'}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className="font-semibold text-emerald-500">
                    Stipend: {internship.stipendOrSalary || '₹25,000 / month'}
                  </span>
                  <span>•</span>
                  <span>Duration: 3-6 Months</span>
                  <span>•</span>
                  <span>Deadline: {internship.deadline || 'Rolling basis'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={(e) => handleApproveDrive(internship.title, e)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Drive</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Drive details flagged for Dean Review`, 'info');
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-white/5 text-xs text-gray-400 font-medium cursor-pointer"
              >
                Flag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Internship Details Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`max-w-lg w-full rounded-2xl p-6 border shadow-2xl transition-all ${
              isDarkMode ? 'bg-[#18191E] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-white/10 mb-4">
              <div>
                <h3 className="text-base font-bold">{selectedInternship.title}</h3>
                <p className="text-xs text-amber-500 font-semibold">{selectedInternship.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedInternship(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-gray-400 block mb-1">Opportunity Scope</span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedInternship.description || 'Experiential learning internship for 3rd and 4th year B.Tech students.'}
                </p>
              </div>

              <div>
                <span className="font-bold text-gray-400 block mb-1">Required Skills</span>
                <div className="flex flex-wrap gap-1">
                  {(selectedInternship.requiredSkills || ['Node.js', 'React', 'Git']).map((sk: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Compensation:</span>
                  <span className="font-bold text-emerald-500">{selectedInternship.stipendOrSalary || '₹25,000/mo'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Campus Drive Verification:</span>
                  <span className="font-bold text-blue-500">Approved for Academic Credit</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-100 dark:border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInternship(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveDrive(selectedInternship.title);
                  setSelectedInternship(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
              >
                Sign Off & Notify Cohort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
