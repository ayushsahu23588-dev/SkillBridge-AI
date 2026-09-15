import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const CompanyDashboard: React.FC = () => {
  const { jobs, applications, setActiveTab, isDarkMode } = useApp();

  const totalApplicants = applications.length;
  const highFitCandidates = applications.filter((a) => a.aiMatchScore >= 85).length;
  const scheduledInterviews = applications.filter(
    (a) => a.status === 'Interview Scheduled' || a.status === 'Technical Round'
  ).length;

  const pipelineData = [
    { stage: 'Applied', count: applications.filter((a) => a.status === 'Applied').length },
    { stage: 'Screening', count: applications.filter((a) => a.status === 'Screening').length },
    { stage: 'Interview', count: scheduledInterviews },
    { stage: 'Offers', count: applications.filter((a) => a.status === 'Offer Extended').length },
    { stage: 'Hired', count: applications.filter((a) => a.status === 'Hired').length },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-200/60 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            NovaCloud Systems • Verified Enterprise Partner
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Enterprise Talent Acquisition Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
            Streamline college hiring with AI candidate pre-vetting, institutional faculty skill validations, and automated interview workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="recruiter-post-job-btn"
            onClick={() => setActiveTab('post_job')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opening</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Active Job Openings
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {jobs.length}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Distributed across 3 Tier-1 colleges
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Applicants
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {totalApplicants}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pre-screened with verified GPA & Githubs
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              High AI Fit Candidates
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {highFitCandidates}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Score ≥ 85% skill alignment
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Active Interviews
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {scheduledInterviews}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Confirmed for current hiring cycle
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline Funnel Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Recruitment Funnel & Candidate Velocity
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time candidate progression through hiring stages
            </p>
          </div>
          <button
            onClick={() => setActiveTab('applicant_kanban')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Open Kanban Board</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis
                dataKey="stage"
                tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }}
              />
              <YAxis allowDecimals={false} tick={{ fill: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" name="Candidates" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
