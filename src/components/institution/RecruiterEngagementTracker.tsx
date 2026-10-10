import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RecruiterEngagementMetric } from '../../types';
import {
  Users,
  Building,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  Mail,
  Search,
  Filter,
  Sparkles,
  Award,
  ArrowUpRight,
  Download,
  AlertTriangle,
  Edit2,
  X,
} from 'lucide-react';

export const RecruiterEngagementTracker: React.FC = () => {
  const { recruiterEngagements, updateRecruiterEngagement, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<RecruiterEngagementMetric | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [editStatus, setEditStatus] = useState<RecruiterEngagementMetric['outreachStatus']>('Partner Active');
  const [editNotes, setEditNotes] = useState('');

  const filteredEngagements = useMemo(() => {
    return recruiterEngagements.filter((r) => {
      const matchSearch =
        r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.spocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.spocEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.outreachStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [recruiterEngagements, searchQuery, statusFilter]);

  const avgHealthScore = Math.round(
    recruiterEngagements.reduce((sum, r) => sum + r.engagementHealthScore, 0) /
      recruiterEngagements.length
  );
  const activePartnersCount = recruiterEngagements.filter(
    (r) => r.outreachStatus === 'Drive Scheduled' || r.outreachStatus === 'Partner Active' || r.outreachStatus === 'MOU Active'
  ).length;
  const totalOffersExtended = recruiterEngagements.reduce((sum, r) => sum + r.totalOffersExtended, 0);

  const handleOpenEdit = (recruiter: RecruiterEngagementMetric) => {
    setSelectedCompany(recruiter);
    setEditStatus(recruiter.outreachStatus);
    setEditNotes(recruiter.notes);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    updateRecruiterEngagement(selectedCompany.companyId, {
      outreachStatus: editStatus,
      notes: editNotes,
      lastInteractionDate: new Date().toISOString().slice(0, 10),
    });

    setIsEditModalOpen(false);
  };

  const handleExportScorecard = () => {
    const headers =
      'Company,SPOC,Email,Phone,Tier,Health Score,Outreach Status,Offers Extended,Shortlist Days,Turnaround Days,Student Rating,Repeat Willingness\n';
    const rows = recruiterEngagements
      .map(
        (r) =>
          `"${r.companyName}","${r.spocName}","${r.spocEmail}","${r.spocPhone}","${r.tier}",${r.engagementHealthScore},"${r.outreachStatus}",${r.totalOffersExtended},${r.averageTimeToShortlistDays},${r.offerTurnaroundDays},${r.studentSatisfactionRating},${r.repeatHiringWillingnessPercentage}%`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_Recruiter_Engagement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Recruiter engagement report exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/20">
              <Building className="w-3.5 h-3.5 text-[#D4F73C]" />
              <span>Corporate Relations & Talent Outreach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Recruiter Engagement & Partner Health Tracker
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Real-time monitoring of campus recruiter relationship health, shortlist release turnaround, student interviewer satisfaction, and corporate hiring partnership renewals.
            </p>
          </div>

          <button
            onClick={handleExportScorecard}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Partner Scorecard</span>
          </button>
        </div>
      </div>

      {/* Corporate Health Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="soft-card p-5">
          <span className="text-xs font-bold text-gray-500">Corporate Health Index</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {avgHealthScore} / 100
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">University-wide benchmark</span>
        </div>

        <div className="soft-card p-5">
          <span className="text-xs font-bold text-gray-500">Active Hiring Partners</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {activePartnersCount} Recruiters
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">Participating in 2026 Season</span>
        </div>

        <div className="soft-card p-5">
          <span className="text-xs font-bold text-gray-500">Total Offers Generated</span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {totalOffersExtended} Offers
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">From tracked corporate partners</span>
        </div>

        <div className="soft-card p-5">
          <span className="text-xs font-bold text-gray-500">Repeat Hiring Intent</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
            96.4%
          </div>
          <span className="text-[11px] text-gray-400 font-semibold">Corporate retention willingness</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search company or SPOC lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181920] text-xs font-semibold outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Partner Active', 'Drive Scheduled', 'Follow-up Needed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-[#181920] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
              }`}
            >
              {st === 'ALL' ? 'All Relationships' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Recruiter Engagement Cards */}
      <div className="space-y-3">
        {filteredEngagements.map((item) => (
          <div
            key={item.id}
            className="soft-card p-5 hover:border-indigo-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            <div className="flex items-start gap-4">
              <img
                src={item.companyLogo}
                alt={item.companyName}
                className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-200 dark:border-white/10"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">
                    {item.companyName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600">
                    {item.tier}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.outreachStatus === 'Drive Scheduled'
                        ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                        : item.outreachStatus === 'Partner Active' || item.outreachStatus === 'MOU Active'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}
                  >
                    {item.outreachStatus === 'MOU Active' ? 'Partner Active' : item.outreachStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span>SPOC: <strong>{item.spocName}</strong></span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{item.spocEmail}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{item.spocPhone}</span>
                  </span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 pt-1 leading-relaxed">
                  {item.notes}
                </p>
              </div>
            </div>

            {/* Health & Turnaround Stats */}
            <div className="flex items-center gap-4 lg:self-center self-end border-t lg:border-t-0 pt-3 lg:pt-0">
              <div className="text-center">
                <span className="text-[10px] text-gray-400 block font-bold">Health Score</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {item.engagementHealthScore}%
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-400 block font-bold">Offers</span>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                  {item.totalOffersExtended}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-400 block font-bold">Shortlist Speed</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {item.averageTimeToShortlistDays}d
                </span>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-gray-400 block font-bold">Student Rating</span>
                <span className="text-sm font-bold text-amber-500">
                  ★ {item.studentSatisfactionRating}
                </span>
              </div>

              <button
                onClick={() => handleOpenEdit(item)}
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Update</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Outreach Modal */}
      {isEditModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white dark:bg-[#181920] w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Update Outreach: {selectedCompany.companyName}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-bold">Outreach Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-semibold outline-none"
                >
                  <option value="Partner Active">Partner Active</option>
                  <option value="Drive Scheduled">Drive Scheduled</option>
                  <option value="Invite Sent">Invite Sent</option>
                  <option value="Follow-up Needed">Follow-up Needed</option>
                  <option value="Completed Season">Completed Season</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-bold">Follow-Up Action Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent font-medium outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
