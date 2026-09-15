import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
  Building2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const ApplicationTrackingPage: React.FC = () => {
  const { applications, jobs, navigate, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Offer Extended':
      case 'Hired':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4F73C]/20 text-[#4D7C0F] dark:text-[#D4F73C] border border-[#D4F73C]/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selected / Offer Extended
          </span>
        );
      case 'Interview Scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Interview Scheduled
          </span>
        );
      case 'Technical Round':
      case 'Screening':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Shortlisted / Technical Round
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border border-gray-200 dark:border-white/10 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Applied / Under Review
          </span>
        );
    }
  };

  const handleWithdraw = (appId: string) => {
    showToast(`Application withdrawn successfully.`, 'info');
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Selected' && (app.status === 'Offer Extended' || app.status === 'Hired')) return true;
    if (filterStatus === 'Interview' && app.status === 'Interview Scheduled') return true;
    if (filterStatus === 'Under Review' && (app.status === 'Applied' || app.status === 'Screening')) return true;
    return app.status === filterStatus;
  });

  return (
    <div className="space-y-8 pb-12 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Campus Placement Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Application Tracking
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Live status of your internship and placement submissions, recruitment rounds, and direct company offers.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/internships')}
          className="px-4 py-2.5 rounded-xl bg-[#D4F73C] hover:bg-[#c6ea31] text-[#111216] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Briefcase className="w-4 h-4" />
          <span>Apply to More Opportunities</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['All', 'Under Review', 'Interview', 'Selected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              filterStatus === status
                ? 'bg-gray-900 dark:bg-white text-white dark:text-[#111216] shadow-xs'
                : 'bg-white dark:bg-[#14151B] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10'
            }`}
          >
            {status} ({status === 'All' ? applications.length : applications.filter((a) => a.status.toLowerCase().includes(status.toLowerCase())).length})
          </button>
        ))}
      </div>

      {/* Applications Table / Cards */}
      <div className="rounded-3xl bg-white dark:bg-[#14151B] border border-gray-200 dark:border-white/10 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Active Submissions ({filteredApps.length})
          </h2>
          <span className="text-xs text-gray-400 font-semibold">Real-Time Sync</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {filteredApps.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId);
            const companyName = job ? job.companyName : 'Tech Partner Corp';
            const roleTitle = job ? job.title : 'Software Engineer Intern';
            const companyLogo = job ? job.companyLogo : 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';

            return (
              <div
                key={app.id}
                className="p-6 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-white/10 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      {companyName}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {roleTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied on: {app.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5 text-[#84B000] dark:text-[#D4F73C]" />
                        <span>AI Match: {app.aiMatchScore}%</span>
                      </div>
                      {app.interviewDate && (
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          Interview: {app.interviewDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-white/5">
                  <div>{getStatusBadge(app.status)}</div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (job) {
                          navigate(`/student/internships/${job.id}`);
                        } else {
                          showToast('Role details synchronized with recruitment desk.', 'info');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
